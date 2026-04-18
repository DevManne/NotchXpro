import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../hooks/useSpotify';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function SpotifyCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('working'); // 'working' | 'ok' | 'error'
  const [message, setMessage] = useState('Finishing Spotify sign-in…');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const err = params.get('error');

    if (err) {
      setStatus('error');
      setMessage(`Spotify returned: ${err}`);
      return;
    }
    if (!code) {
      setStatus('error');
      setMessage('Missing authorization code.');
      return;
    }

    exchangeCodeForToken(code)
      .then(() => {
        setStatus('ok');
        setMessage('Connected! Redirecting…');
        setTimeout(() => navigate('/dashboard', { replace: true }), 600);
      })
      .catch((e) => {
        setStatus('error');
        setMessage(e.message || 'Token exchange failed.');
      });
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-6"
      data-testid="spotify-callback-page"
    >
      <div className="glass-effect rounded-3xl p-10 max-w-md w-full text-center space-y-4">
        {status === 'working' && <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />}
        {status === 'ok' && <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />}
        {status === 'error' && <XCircle className="h-10 w-10 text-destructive mx-auto" />}
        <h1 className="text-2xl font-bold text-foreground" data-testid="spotify-callback-status">
          {status === 'working' ? 'Connecting to Spotify' : status === 'ok' ? 'Connected' : 'Connection Failed'}
        </h1>
        <p className="text-muted-foreground" data-testid="spotify-callback-message">{message}</p>
        {status === 'error' && (
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="text-primary text-sm underline"
            data-testid="spotify-callback-back-btn"
          >
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
