import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Clock, Battery, CloudRain, Bell, Music, Sparkles } from 'lucide-react';

export default function NotchDemo() {
  const [isNotchExpanded, setIsNotchExpanded] = useState(false);

  return (
    <section id="demo" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Dynamic Island Experience</h2>
          <p className="text-xl text-muted-foreground">Hover over the notch to see it transform into an interactive island</p>
        </div>

        {/* Notch Simulator */}
        <div className="relative mx-auto max-w-4xl">
          <Card className="bg-card/50 backdrop-blur-sm border-2">
            <CardContent className="p-12">
              {/* MacBook Screen Mockup */}
              <div className="relative bg-background rounded-lg border-4 border-border overflow-hidden" style={{ aspectRatio: '16/10' }}>
                {/* Dynamic Island Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div 
                    className={`relative cursor-pointer transition-all duration-500 ease-out ${
                      isNotchExpanded ? 'w-80 h-28' : 'w-48 h-8'
                    }`}
                    onMouseEnter={() => setIsNotchExpanded(true)}
                    onMouseLeave={() => setIsNotchExpanded(false)}
                    data-testid="notch-demo-island"
                    data-expanded={isNotchExpanded ? 'true' : 'false'}
                  >
                    {/* Notch Shape */}
                    <div className={`w-full h-full glass-effect animate-pulse-glow ${
                      isNotchExpanded ? 'rounded-3xl' : 'notch-shape border-t-0'
                    }`} />
                    
                    {/* Compact State */}
                    {!isNotchExpanded && (
                      <div className="absolute inset-0 flex items-center justify-center gap-4 px-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-primary" />
                          <span className="font-medium">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="h-3 w-px bg-border" />
                        <div className="flex items-center gap-1.5">
                          <Battery className="h-3 w-3 text-primary" />
                          <span className="font-medium">87%</span>
                        </div>
                        <div className="h-3 w-px bg-border" />
                        <div className="flex items-center gap-1.5">
                          <CloudRain className="h-3 w-3 text-primary" />
                          <span className="font-medium">72°F</span>
                        </div>
                      </div>
                    )}

                    {/* Expanded State */}
                    {isNotchExpanded && (
                      <div className="absolute inset-0 p-3 flex flex-col gap-2 text-xs animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-primary" />
                              <span className="font-medium">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Battery className="h-3 w-3 text-primary" />
                              <span className="font-medium">87%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Bell className="h-3 w-3 text-primary" />
                            <span className="text-xs bg-primary text-primary-foreground rounded-full px-1">3</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-card/30 rounded-xl p-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <Music className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">Now Playing</p>
                            <p className="text-xs text-muted-foreground truncate">Track - Artist</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-card/20 rounded-full px-2 py-1 flex items-center gap-1">
                            <CloudRain className="h-3 w-3 text-primary" />
                            <span>72°F</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Screen Content */}
                <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
                  <div className="p-4 rounded-full bg-primary/10 animate-float">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Dynamic Island Magic</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Hover over the notch above to expand and see live information, music controls, and more
                  </p>
                  <div className="text-sm text-primary animate-pulse">
                    ↑ Try hovering over the notch
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}