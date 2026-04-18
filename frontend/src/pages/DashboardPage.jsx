import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import NotchWidget from '../components/NotchWidget';
import WidgetOrderList from '../components/WidgetOrderList';
import ThemePicker from '../components/ThemePicker';
import SettingsIO from '../components/SettingsIO';
import { ArrowLeft, Clock, Battery, CloudRain, Bell, Music2, Activity, RotateCcw, Music, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import useNotchSettings, { DEFAULT_SETTINGS } from '../hooks/useNotchSettings';
import { useSpotifyContext } from '../context/SpotifyContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useNotchSettings();
  const spotify = useSpotifyContext();

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Avoid toast spam on continuous slider changes
    if (key !== 'opacity') {
      toast.success('Setting updated', {
        description: 'Your preference has been saved',
      });
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    toast.success('Settings reset', {
      description: 'Defaults restored',
    });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard-page">
      {/* Top Notch Widget */}
      <NotchWidget settings={settings} />
      
      <div className="container mx-auto px-4 pt-16 pb-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-accent"
            data-testid="back-home-btn"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-4xl font-bold mb-2" data-testid="dashboard-title">Notch Dashboard</h1>
              <p className="text-muted-foreground">Customize your MacBook notch experience</p>
            </div>
            <Button variant="outline" onClick={handleReset} data-testid="reset-settings-btn">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <SettingsIO settings={settings} onReplace={setSettings} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Customization */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Settings</CardTitle>
                <CardDescription>
                  Choose which widgets to display in your notch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="widgets" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="widgets" data-testid="tab-widgets">Widgets</TabsTrigger>
                    <TabsTrigger value="layout" data-testid="tab-layout">Layout</TabsTrigger>
                    <TabsTrigger value="appearance" data-testid="tab-appearance">Appearance</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="widgets" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card" data-testid="setting-clock-row">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="clock" className="font-medium">Clock</Label>
                          <p className="text-sm text-muted-foreground">Display current time</p>
                        </div>
                      </div>
                      <Switch
                        id="clock"
                        checked={settings.showClock}
                        onCheckedChange={(checked) => handleSettingChange('showClock', checked)}
                        data-testid="switch-clock"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card" data-testid="setting-battery-row">
                      <div className="flex items-center gap-3">
                        <Battery className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="battery" className="font-medium">Battery Status</Label>
                          <p className="text-sm text-muted-foreground">Show battery percentage</p>
                        </div>
                      </div>
                      <Switch
                        id="battery"
                        checked={settings.showBattery}
                        onCheckedChange={(checked) => handleSettingChange('showBattery', checked)}
                        data-testid="switch-battery"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card" data-testid="setting-weather-row">
                      <div className="flex items-center gap-3">
                        <CloudRain className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="weather" className="font-medium">Weather</Label>
                          <p className="text-sm text-muted-foreground">Current temperature</p>
                        </div>
                      </div>
                      <Switch
                        id="weather"
                        checked={settings.showWeather}
                        onCheckedChange={(checked) => handleSettingChange('showWeather', checked)}
                        data-testid="switch-weather"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card" data-testid="setting-notifications-row">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                          <p className="text-sm text-muted-foreground">Show notification count</p>
                        </div>
                      </div>
                      <Switch
                        id="notifications"
                        checked={settings.showNotifications}
                        onCheckedChange={(checked) => handleSettingChange('showNotifications', checked)}
                        data-testid="switch-notifications"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card" data-testid="setting-music-row">
                      <div className="flex items-center gap-3">
                        <Music className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="music" className="font-medium">Music Player</Label>
                          <p className="text-sm text-muted-foreground">Now playing controls (expanded view)</p>
                        </div>
                      </div>
                      <Switch
                        id="music"
                        checked={settings.showMusic}
                        onCheckedChange={(checked) => handleSettingChange('showMusic', checked)}
                        data-testid="switch-music"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card" data-testid="setting-system-row">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="system" className="font-medium">System Status</Label>
                          <p className="text-sm text-muted-foreground">Wi-Fi, Bluetooth & system health (expanded view)</p>
                        </div>
                      </div>
                      <Switch
                        id="system"
                        checked={settings.showSystemStatus}
                        onCheckedChange={(checked) => handleSettingChange('showSystemStatus', checked)}
                        data-testid="switch-system"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label>Compact Widget Order</Label>
                      <p className="text-xs text-muted-foreground">
                        Drag or use the arrows to reorder how widgets appear in the compact notch (left to right).
                      </p>
                      <WidgetOrderList
                        order={settings.order}
                        settings={settings}
                        onChange={(next) => handleSettingChange('order', next)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Theme Preset</Label>
                      <p className="text-xs text-muted-foreground">Pick a color palette for the notch accent + glow.</p>
                      <ThemePicker
                        value={settings.theme}
                        onChange={(t) => handleSettingChange('theme', t)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="appearance" className="space-y-6 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="opacity">Notch Opacity</Label>
                        <span className="text-sm text-muted-foreground" data-testid="opacity-value">{settings.opacity[0]}%</span>
                      </div>
                      <Slider
                        id="opacity"
                        value={settings.opacity}
                        onValueChange={(value) => handleSettingChange('opacity', value)}
                        max={100}
                        min={20}
                        step={5}
                        data-testid="slider-opacity"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card" data-testid="setting-glow-row">
                      <div>
                        <Label htmlFor="glow" className="font-medium">Glow Effect</Label>
                        <p className="text-sm text-muted-foreground">Subtle glow around notch</p>
                      </div>
                      <Switch
                        id="glow"
                        checked={settings.glowEffect}
                        onCheckedChange={(checked) => handleSettingChange('glowEffect', checked)}
                        data-testid="switch-glow"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Your notch at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Widgets</p>
                    <p className="text-2xl font-bold" data-testid="active-widgets-count">
                      {[
                        settings.showClock,
                        settings.showBattery,
                        settings.showWeather,
                        settings.showNotifications,
                        settings.showMusic,
                        settings.showSystemStatus,
                      ].filter(Boolean).length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Music2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customizations</p>
                    <p className="text-2xl font-bold">12+</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spotify</CardTitle>
                <CardDescription>Connect for real now-playing in the notch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3" data-testid="spotify-card">
                {!spotify.configured ? (
                  <p className="text-xs text-muted-foreground" data-testid="spotify-card-not-configured">
                    Add <code className="text-primary">REACT_APP_SPOTIFY_CLIENT_ID</code> and restart the frontend.
                  </p>
                ) : spotify.connected ? (
                  <>
                    <p className="text-sm" data-testid="spotify-card-connected">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2" />
                      Connected{spotify.deviceId ? ' · Device ready' : ''}
                    </p>
                    {spotify.track && (
                      <p className="text-xs text-muted-foreground truncate">
                        Now: {spotify.track.name} — {spotify.track.artist}
                      </p>
                    )}
                    {spotify.error && (
                      <p className="text-xs text-destructive">{spotify.error}</p>
                    )}
                    <Button variant="outline" size="sm" onClick={spotify.logout} data-testid="spotify-disconnect-btn">
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground">Premium account required for Web Playback.</p>
                    <Button onClick={spotify.login} data-testid="spotify-connect-btn">
                      Connect Spotify
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>💡 Adjust opacity for better visibility in different lighting</p>
                <p>⚡ Enable only essential widgets for a cleaner look</p>
                <p>🎨 Glow effect looks best in dark mode</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}