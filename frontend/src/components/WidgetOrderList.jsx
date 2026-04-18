import React, { useState } from 'react';
import { GripVertical, Clock, Battery, CloudRain, Bell, EyeOff } from 'lucide-react';
import { WIDGET_KEYS } from '../hooks/useNotchSettings';

const META = {
  clock: { label: 'Clock', icon: Clock, visibleKey: 'showClock' },
  battery: { label: 'Battery', icon: Battery, visibleKey: 'showBattery' },
  weather: { label: 'Weather', icon: CloudRain, visibleKey: 'showWeather' },
  notifications: { label: 'Notifications', icon: Bell, visibleKey: 'showNotifications' },
};

export default function WidgetOrderList({ order, settings, onChange }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const safeOrder = order && order.length ? order : [...WIDGET_KEYS];

  const move = (from, to) => {
    if (from === to || to < 0 || to >= safeOrder.length) return;
    const next = [...safeOrder];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const handleDragStart = (idx) => (e) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox needs data to be set
    try {
      e.dataTransfer.setData('text/plain', String(idx));
    } catch (err) {
      // ignore
    }
  };

  const handleDragOver = (idx) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overIdx !== idx) setOverIdx(idx);
  };

  const handleDrop = (idx) => (e) => {
    e.preventDefault();
    if (dragIdx != null) move(dragIdx, idx);
    setDragIdx(null);
    setOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <ul className="space-y-2" data-testid="widget-order-list">
      {safeOrder.map((key, idx) => {
        const meta = META[key];
        if (!meta) return null;
        const Icon = meta.icon;
        const hidden = !settings[meta.visibleKey];
        const isDragging = dragIdx === idx;
        const isOver = overIdx === idx && dragIdx !== idx;
        return (
          <li
            key={key}
            draggable
            onDragStart={handleDragStart(idx)}
            onDragOver={handleDragOver(idx)}
            onDrop={handleDrop(idx)}
            onDragEnd={handleDragEnd}
            data-testid={`order-item-${key}`}
            data-order-index={idx}
            className={`flex items-center gap-3 p-3 rounded-lg border bg-card smooth-transition select-none cursor-grab active:cursor-grabbing ${
              isDragging ? 'opacity-40' : ''
            } ${isOver ? 'ring-2 ring-primary border-primary' : ''}`}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 flex-shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{meta.label}</p>
              <p className="text-xs text-muted-foreground">Position {idx + 1} of {safeOrder.length}</p>
            </div>
            {hidden && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground" data-testid={`order-item-${key}-hidden`}>
                <EyeOff className="h-3 w-3" />
                Hidden
              </span>
            )}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(idx, idx - 1)}
                disabled={idx === 0}
                className="text-xs px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed smooth-transition"
                data-testid={`order-item-${key}-up`}
                aria-label={`Move ${meta.label} up`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(idx, idx + 1)}
                disabled={idx === safeOrder.length - 1}
                className="text-xs px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed smooth-transition"
                data-testid={`order-item-${key}-down`}
                aria-label={`Move ${meta.label} down`}
              >
                ↓
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
