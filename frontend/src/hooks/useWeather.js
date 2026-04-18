import { useEffect, useRef, useState } from 'react';

const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;
const CACHE_KEY = 'notchpro:weather:v1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.t > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch (e) {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }));
  } catch (e) {
    /* ignore */
  }
}

/**
 * useWeather — fetches current weather from OpenWeatherMap using the browser's geolocation.
 * Graceful states:
 *   - missingKey: true when REACT_APP_OPENWEATHER_KEY is not set
 *   - denied: true when user denies geolocation
 *   - loading, error: standard network states
 * Returns { temp (F), description, city, icon, supported, missingKey, denied, loading, error }
 */
export default function useWeather() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    missingKey: !API_KEY,
    denied: false,
    supported: typeof navigator !== 'undefined' && !!navigator.geolocation,
    temp: null,
    description: null,
    city: null,
    icon: null,
  });
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    if (!API_KEY) {
      setState((s) => ({ ...s, loading: false, missingKey: true }));
      return;
    }

    // Serve cached response instantly if fresh
    const cached = readCache();
    if (cached) {
      setState((s) => ({ ...s, ...cached, loading: false }));
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState((s) => ({ ...s, loading: false, supported: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=imperial`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`OpenWeatherMap ${res.status}`);
          const data = await res.json();
          const next = {
            temp: Math.round(data.main?.temp),
            description: data.weather?.[0]?.main || 'Clear',
            city: data.name || 'Unknown',
            icon: data.weather?.[0]?.icon || null,
          };
          writeCache(next);
          setState((s) => ({ ...s, ...next, loading: false, error: null }));
        } catch (e) {
          setState((s) => ({ ...s, loading: false, error: e.message }));
        }
      },
      (err) => {
        setState((s) => ({
          ...s,
          loading: false,
          denied: err.code === err.PERMISSION_DENIED,
          error: err.message,
        }));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, []);

  return state;
}
