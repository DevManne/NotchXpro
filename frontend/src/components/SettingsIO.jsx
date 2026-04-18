import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_SETTINGS } from '../hooks/useNotchSettings';

const SCHEMA_VERSION = 1;

export default function SettingsIO({ settings, onReplace }) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const payload = {
      app: 'NotchPro',
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notchpro-settings-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('Settings exported', { description: 'Saved as JSON to your downloads.' });
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // reset so same file can be re-selected
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      // Accept either { settings: {...} } or a raw settings object
      const incoming = parsed && typeof parsed === 'object' && parsed.settings
        ? parsed.settings
        : parsed;
      if (!incoming || typeof incoming !== 'object') {
        throw new Error('Invalid file format');
      }

      // Only keep keys we recognize
      const allowed = Object.keys(DEFAULT_SETTINGS);
      const cleaned = Object.fromEntries(
        Object.entries(incoming).filter(([k]) => allowed.includes(k))
      );
      if (Object.keys(cleaned).length === 0) {
        throw new Error('No recognizable settings in file');
      }

      onReplace({ ...DEFAULT_SETTINGS, ...cleaned });
      toast.success('Settings imported', {
        description: `Applied ${Object.keys(cleaned).length} setting(s).`,
      });
    } catch (err) {
      toast.error('Import failed', { description: err.message || 'Could not read settings file.' });
    }
  };

  return (
    <div className="flex items-center gap-2" data-testid="settings-io">
      <Button variant="outline" size="sm" onClick={handleExport} data-testid="export-settings-btn">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={handleImportClick} data-testid="import-settings-btn">
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFile}
        data-testid="settings-file-input"
      />
    </div>
  );
}
