import React from 'react';
import { Check } from 'lucide-react';
import { THEMES } from '../hooks/useNotchSettings';

export default function ThemePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3" data-testid="theme-picker">
      {Object.entries(THEMES).map(([key, theme]) => {
        const selected = value === key;
        return (
          <button
            type="button"
            key={key}
            onClick={() => onChange(key)}
            data-testid={`theme-option-${key}`}
            data-selected={selected ? 'true' : 'false'}
            aria-pressed={selected}
            className={`relative p-4 rounded-xl border-2 smooth-transition text-left ${
              selected ? 'border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]' : 'border-border hover:border-primary/50'
            }`}
          >
            <div
              className="h-12 rounded-lg mb-3"
              style={{
                background: `linear-gradient(135deg, ${theme.swatch[0]}, ${theme.swatch[1]})`,
              }}
            />
            <p className="text-sm font-semibold flex items-center justify-between">
              {theme.label}
              {selected && <Check className="h-4 w-4 text-primary" />}
            </p>
          </button>
        );
      })}
    </div>
  );
}
