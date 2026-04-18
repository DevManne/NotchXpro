import { useEffect, useState } from 'react';

const STORAGE_KEY = 'notchpro:settings:v1';

export const WIDGET_KEYS = ['clock', 'battery', 'weather', 'notifications'];

export const THEMES = {
  aurora: {
    label: 'Aurora',
    vars: {
      '--primary': '221 83% 53%',
      '--ring': '221 83% 53%',
      '--glow-primary': '221 83% 53%',
      '--glow-secondary': '250 100% 70%',
      '--gradient-primary': 'linear-gradient(135deg, hsl(221 83% 53%), hsl(250 100% 70%))',
      '--shadow-glow': '0 0 40px hsl(221 83% 53% / 0.3)',
    },
    swatch: ['#2563eb', '#8b5cf6'],
  },
  sunset: {
    label: 'Sunset',
    vars: {
      '--primary': '20 95% 58%',
      '--ring': '20 95% 58%',
      '--glow-primary': '20 95% 58%',
      '--glow-secondary': '340 90% 65%',
      '--gradient-primary': 'linear-gradient(135deg, hsl(20 95% 58%), hsl(340 90% 65%))',
      '--shadow-glow': '0 0 40px hsl(20 95% 58% / 0.35)',
    },
    swatch: ['#f97316', '#ec4899'],
  },
  matrix: {
    label: 'Matrix',
    vars: {
      '--primary': '142 72% 45%',
      '--ring': '142 72% 45%',
      '--glow-primary': '142 72% 45%',
      '--glow-secondary': '140 100% 70%',
      '--gradient-primary': 'linear-gradient(135deg, hsl(142 72% 45%), hsl(140 100% 70%))',
      '--shadow-glow': '0 0 40px hsl(142 72% 45% / 0.35)',
    },
    swatch: ['#16a34a', '#4ade80'],
  },
};

export const DEFAULT_SETTINGS = {
  showClock: true,
  showBattery: true,
  showWeather: true,
  showNotifications: true,
  showMusic: true,
  showSystemStatus: true,
  opacity: [80],
  glowEffect: true,
  order: [...WIDGET_KEYS],
  theme: 'aurora',
};

function sanitizeOrder(input) {
  if (!Array.isArray(input)) return [...WIDGET_KEYS];
  const unique = Array.from(new Set(input.filter((k) => WIDGET_KEYS.includes(k))));
  // append any missing keys so user never loses a widget slot after schema upgrades
  WIDGET_KEYS.forEach((k) => {
    if (!unique.includes(k)) unique.push(k);
  });
  return unique;
}

function sanitizeTheme(t) {
  return THEMES[t] ? t : 'aurora';
}

function normalize(raw) {
  const merged = { ...DEFAULT_SETTINGS, ...raw };
  merged.order = sanitizeOrder(merged.order);
  merged.theme = sanitizeTheme(merged.theme);
  if (!Array.isArray(merged.opacity)) merged.opacity = DEFAULT_SETTINGS.opacity;
  return merged;
}

function readSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return normalize(JSON.parse(raw));
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export default function useNotchSettings() {
  const [settings, setSettings] = useState(readSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      // ignore
    }
  }, [settings]);

  // Apply theme CSS variables globally
  useEffect(() => {
    const theme = THEMES[settings.theme] || THEMES.aurora;
    const root = document.documentElement;
    const applied = [];
    Object.entries(theme.vars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
      applied.push(k);
    });
    return () => {
      applied.forEach((k) => root.style.removeProperty(k));
    };
  }, [settings.theme]);

  // Sync across tabs/pages
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setSettings(normalize(JSON.parse(e.newValue)));
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const safeSetSettings = (updater) => {
    if (typeof updater === 'function') {
      setSettings((prev) => normalize(updater(prev)));
    } else {
      setSettings(normalize(updater));
    }
  };

  return [settings, safeSetSettings];
}
