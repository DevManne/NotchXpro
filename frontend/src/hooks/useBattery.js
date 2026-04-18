import { useEffect, useState } from 'react';

/**
 * useBattery — reads the browser Battery Status API.
 * Returns { supported, level (0-100), charging } with live updates.
 * Falls back to supported=false on unsupported browsers (Firefox, Safari).
 */
export default function useBattery() {
  const [state, setState] = useState({
    supported: true,
    level: null,
    charging: null,
  });

  useEffect(() => {
    let battery;
    let cancelled = false;

    const update = (b) => {
      if (cancelled) return;
      setState({
        supported: true,
        level: Math.round(b.level * 100),
        charging: b.charging,
      });
    };

    if (typeof navigator === 'undefined' || !navigator.getBattery) {
      setState({ supported: false, level: null, charging: null });
      return;
    }

    navigator
      .getBattery()
      .then((b) => {
        battery = b;
        update(b);
        const handler = () => update(b);
        b.addEventListener('levelchange', handler);
        b.addEventListener('chargingchange', handler);
        // store cleanup
        battery._cleanup = () => {
          b.removeEventListener('levelchange', handler);
          b.removeEventListener('chargingchange', handler);
        };
      })
      .catch(() => {
        if (!cancelled) setState({ supported: false, level: null, charging: null });
      });

    return () => {
      cancelled = true;
      if (battery && battery._cleanup) battery._cleanup();
    };
  }, []);

  return state;
}
