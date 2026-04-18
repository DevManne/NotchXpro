import React, { useState, useEffect } from 'react';
import {
  Clock,
  Battery,
  BatteryCharging,
  CloudRain,
  Bell,
  Music,
  Play,
  Pause,
  SkipForward,
  Activity,
  Wifi,
  Bluetooth,
} from 'lucide-react';
import useBattery from '../hooks/useBattery';
import useWeather from '../hooks/useWeather';
import { useSpotifyContext } from '../context/SpotifyContext';

function formatTemp(weather) {
  if (weather.missingKey) return '—°';
  if (weather.denied) return '📍?';
  if (weather.loading) return '…';
  if (weather.temp == null) return '—°';
  return `${weather.temp}°F`;
}

function formatBattery(battery) {
  if (!battery.supported) return '—';
  if (battery.level == null) return '…';
  return `${battery.level}%`;
}

export default function NotchWidget({ settings }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  const battery = useBattery();
  const weather = useWeather();
  const spotify = useSpotifyContext();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const opacity = settings?.opacity?.[0] ?? 80;
  const showGlow = settings?.glowEffect !== false;
  const showClock = settings?.showClock !== false;
  const showBattery = settings?.showBattery !== false;
  const showWeather = settings?.showWeather !== false;
  const showNotifications = settings?.showNotifications !== false;
  const showMusic = settings?.showMusic !== false;
  const showSystemStatus = settings?.showSystemStatus !== false;

  const notifCount = 3; // still mocked — no Notifications API equivalent for other apps
  const batteryLabel = formatBattery(battery);
  const tempLabel = formatTemp(weather);
  const BatteryIcon = battery.charging ? BatteryCharging : Battery;

  const handleStopProp = (fn) => (e) => {
    e.stopPropagation();
    fn && fn();
  };

  const expand = () => setIsExpanded(true);
  const collapse = () => setIsExpanded(false);

  const compactRenderers = {
    clock: showClock && (
      <div key="clock" className="flex items-center gap-1.5" data-testid="notch-compact-clock">
        <Clock className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium">
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    ),
    battery: showBattery && (
      <div key="battery" className="flex items-center gap-1.5" data-testid="notch-compact-battery">
        <BatteryIcon className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium">{batteryLabel}</span>
      </div>
    ),
    weather: showWeather && (
      <div key="weather" className="flex items-center gap-1.5" data-testid="notch-compact-weather">
        <CloudRain className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium">{tempLabel}</span>
      </div>
    ),
    notifications: showNotifications && (
      <div key="notif" className="flex items-center gap-1.5" data-testid="notch-compact-notifications">
        <Bell className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium">{notifCount}</span>
      </div>
    ),
  };

  const order = Array.isArray(settings?.order) && settings.order.length
    ? settings.order
    : ['clock', 'battery', 'weather', 'notifications'];
  const compactItems = order.map((key) => compactRenderers[key]).filter(Boolean);

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[60]" data-testid="notch-widget-root">
      <div
        data-testid="notch-widget"
        data-expanded={isExpanded ? 'true' : 'false'}
        className={`transition-all duration-500 ease-out cursor-pointer ${
          isExpanded ? 'w-[28rem] h-36' : 'w-64 h-10'
        } glass-effect ${isExpanded ? 'rounded-3xl' : 'notch-shape border-t-0'} flex items-center justify-center ${showGlow ? 'animate-pulse-glow' : ''}`}
        style={{ opacity: opacity / 100 }}
        onMouseEnter={expand}
        onMouseLeave={collapse}
        onFocus={expand}
        onBlur={collapse}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label="MacBook Notch - hover to expand"
      >
        {/* Compact */}
        {!isExpanded && (
          <div className="flex items-center gap-4 px-4 text-xs" data-testid="notch-compact">
            {compactItems.length > 0
              ? compactItems.reduce((acc, item, idx) => {
                  if (idx === 0) return [item];
                  return [...acc, <div key={`div-${idx}`} className="h-4 w-px bg-border" />, item];
                }, [])
              : <span className="text-muted-foreground" data-testid="notch-empty-hint">Hover to expand</span>}
          </div>
        )}

        {/* Expanded */}
        {isExpanded && (
          <div className="w-full h-full p-4 flex flex-col gap-2.5 animate-fadeIn" data-testid="notch-expanded">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                {showClock && (
                  <div className="flex items-center gap-2" data-testid="notch-expanded-clock">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                )}
                {showBattery && (
                  <div className="flex items-center gap-2" data-testid="notch-expanded-battery">
                    <BatteryIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{batteryLabel}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {showSystemStatus && (
                  <>
                    <Wifi className="h-4 w-4 text-primary" data-testid="notch-expanded-wifi" />
                    <Bluetooth className="h-4 w-4 text-primary" data-testid="notch-expanded-bluetooth" />
                  </>
                )}
                {showNotifications && (
                  <div className="flex items-center gap-1.5" data-testid="notch-expanded-notifications">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5">{notifCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Music Player */}
            {showMusic && (
              <div
                className="flex items-center gap-3 bg-card/50 rounded-2xl p-2.5 border border-border/50"
                data-testid="notch-music-player"
              >
                {!spotify.configured ? (
                  <div className="flex-1 text-xs text-muted-foreground" data-testid="notch-music-not-configured">
                    Music: add <code className="text-primary">REACT_APP_SPOTIFY_CLIENT_ID</code> in .env
                  </div>
                ) : !spotify.connected ? (
                  <>
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Music className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">Spotify not connected</p>
                      <p className="text-xs text-muted-foreground truncate">Connect to see now playing</p>
                    </div>
                    <button
                      onClick={handleStopProp(spotify.login)}
                      className="text-xs font-semibold bg-primary text-primary-foreground rounded-full px-3 py-1.5 hover:opacity-90 smooth-transition"
                      data-testid="notch-spotify-connect-btn"
                    >
                      Connect
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                      {spotify.track?.albumArt ? (
                        <img src={spotify.track.albumArt} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Music className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" data-testid="notch-music-title">
                        {spotify.track?.name || (spotify.connecting ? 'Connecting…' : 'Nothing playing')}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" data-testid="notch-music-artist">
                        {spotify.track?.artist || (spotify.error ? spotify.error : 'Open Spotify & hit play')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleStopProp(spotify.togglePlay)}
                        className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center smooth-transition"
                        data-testid="notch-play-toggle-btn"
                        aria-label={spotify.paused ? 'Play' : 'Pause'}
                      >
                        {spotify.paused ? (
                          <Play className="h-4 w-4 text-primary ml-0.5" />
                        ) : (
                          <Pause className="h-4 w-4 text-primary" />
                        )}
                      </button>
                      <button
                        onClick={handleStopProp(spotify.skipNext)}
                        className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center smooth-transition"
                        data-testid="notch-skip-btn"
                        aria-label="Skip forward"
                      >
                        <SkipForward className="h-3.5 w-3.5 text-primary" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Quick Info Row */}
            <div className="flex items-center justify-between text-xs">
              {showWeather && (
                <div className="flex items-center gap-2 bg-card/30 rounded-full px-3 py-1.5" data-testid="notch-expanded-weather">
                  <CloudRain className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {weather.missingKey
                      ? 'Add OpenWeather key'
                      : weather.denied
                      ? 'Location denied'
                      : weather.loading
                      ? 'Loading weather…'
                      : weather.temp != null
                      ? `${weather.temp}°F · ${weather.description}${weather.city ? ` · ${weather.city}` : ''}`
                      : 'Weather unavailable'}
                  </span>
                </div>
              )}
              {showSystemStatus && (
                <div className="flex items-center gap-2 bg-card/30 rounded-full px-3 py-1.5" data-testid="notch-expanded-system">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {battery.supported && battery.charging
                      ? 'Charging'
                      : battery.supported && battery.level != null && battery.level < 20
                      ? 'Low battery'
                      : 'System: Optimal'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
