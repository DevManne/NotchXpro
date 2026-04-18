import { useCallback, useEffect, useRef, useState } from 'react';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
].join(' ');

const TOKEN_KEY = 'notchpro:spotify:token:v1';
const VERIFIER_KEY = 'notchpro:spotify:verifier:v1';

// ── PKCE helpers ────────────────────────────────────────────────────────────
function randomString(length = 64) {
  const arr = new Uint8Array(length);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (x) => ('0' + (x % 36).toString(36)).slice(-1)).join('');
}

async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(digest);
}

function base64UrlEncode(bytes) {
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ── token storage ───────────────────────────────────────────────────────────
function readToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.expires_at && Date.now() > parsed.expires_at - 30_000) return parsed; // still return so we can refresh
    return parsed;
  } catch (e) {
    return null;
  }
}

function writeToken(tok) {
  const payload = {
    ...tok,
    expires_at: Date.now() + (tok.expires_in || 3600) * 1000,
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(payload));
  return payload;
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(VERIFIER_KEY);
}

// ── public flow helpers ─────────────────────────────────────────────────────
export async function beginSpotifyLogin() {
  if (!CLIENT_ID) {
    alert('Spotify is not configured. Add REACT_APP_SPOTIFY_CLIENT_ID to frontend/.env and restart.');
    return;
  }
  const verifier = randomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));
  localStorage.setItem(VERIFIER_KEY, verifier);
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code) {
  const verifier = localStorage.getItem(VERIFIER_KEY);
  if (!verifier) throw new Error('Missing PKCE verifier');
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: verifier,
  });
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  const data = await res.json();
  return writeToken(data);
}

async function refreshAccessToken(refresh_token) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
    client_id: CLIENT_ID,
  });
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status}`);
  const data = await res.json();
  // Spotify sometimes omits refresh_token; keep the old one
  return writeToken({ ...data, refresh_token: data.refresh_token || refresh_token });
}

// ── SDK loader (singleton) ──────────────────────────────────────────────────
let sdkReadyPromise = null;
function loadSDK() {
  if (sdkReadyPromise) return sdkReadyPromise;
  sdkReadyPromise = new Promise((resolve) => {
    if (window.Spotify) return resolve(window.Spotify);
    window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify);
    const s = document.createElement('script');
    s.src = 'https://sdk.scdn.co/spotify-player.js';
    s.async = true;
    document.body.appendChild(s);
  });
  return sdkReadyPromise;
}

// ── main hook ───────────────────────────────────────────────────────────────
/**
 * useSpotify — PKCE OAuth + Web Playback SDK.
 * Returns:
 *   { configured, connected, connecting, error,
 *     track: { name, artist, albumArt } | null,
 *     paused, deviceId,
 *     login(), logout(), togglePlay(), skipNext(), skipPrev() }
 */
export default function useSpotify() {
  const [token, setToken] = useState(() => readToken());
  const [playerState, setPlayerState] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const playerRef = useRef(null);

  const configured = !!CLIENT_ID && !!REDIRECT_URI;
  const connected = !!token?.access_token;

  // Refresh token proactively if near expiry
  useEffect(() => {
    if (!token?.refresh_token) return;
    const msUntilExpiry = (token.expires_at || 0) - Date.now();
    if (msUntilExpiry <= 60_000) {
      refreshAccessToken(token.refresh_token)
        .then(setToken)
        .catch((e) => {
          setError(e.message);
          clearToken();
          setToken(null);
        });
      return;
    }
    const t = setTimeout(() => {
      refreshAccessToken(token.refresh_token).then(setToken).catch(() => {});
    }, msUntilExpiry - 60_000);
    return () => clearTimeout(t);
  }, [token]);

  // Initialize the Web Playback SDK player when we have a token
  useEffect(() => {
    if (!connected) return;
    let disposed = false;
    setConnecting(true);

    loadSDK().then((Spotify) => {
      if (disposed) return;
      const player = new Spotify.Player({
        name: 'NotchPro Dynamic Island',
        getOAuthToken: (cb) => {
          const current = readToken();
          if (!current) return;
          if (current.expires_at && Date.now() > current.expires_at - 30_000 && current.refresh_token) {
            refreshAccessToken(current.refresh_token).then((t) => cb(t.access_token));
          } else {
            cb(current.access_token);
          }
        },
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        setConnecting(false);
      });
      player.addListener('not_ready', () => setDeviceId(null));
      player.addListener('player_state_changed', (state) => setPlayerState(state));
      player.addListener('initialization_error', ({ message }) => setError(message));
      player.addListener('authentication_error', ({ message }) => {
        setError(message);
        clearToken();
        setToken(null);
      });
      player.addListener('account_error', ({ message }) => setError(message || 'Spotify Premium required'));

      player.connect();
      playerRef.current = player;
    });

    return () => {
      disposed = true;
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, [connected]);

  const login = useCallback(() => beginSpotifyLogin(), []);
  const logout = useCallback(() => {
    if (playerRef.current) playerRef.current.disconnect();
    clearToken();
    setToken(null);
    setPlayerState(null);
    setDeviceId(null);
  }, []);
  const togglePlay = useCallback(() => playerRef.current?.togglePlay(), []);
  const skipNext = useCallback(() => playerRef.current?.nextTrack(), []);
  const skipPrev = useCallback(() => playerRef.current?.previousTrack(), []);

  const currentTrack = playerState?.track_window?.current_track;
  const track = currentTrack
    ? {
        name: currentTrack.name,
        artist: currentTrack.artists?.map((a) => a.name).join(', '),
        albumArt: currentTrack.album?.images?.[0]?.url,
      }
    : null;

  return {
    configured,
    connected,
    connecting,
    error,
    track,
    paused: playerState?.paused ?? true,
    deviceId,
    login,
    logout,
    togglePlay,
    skipNext,
    skipPrev,
  };
}
