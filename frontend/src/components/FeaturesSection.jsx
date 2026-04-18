import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Palette, Zap, Lock, Layout, Sparkles, Monitor, Expand } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Expand,
      title: 'Dynamic Island',
      description: 'Expandable notch interface that transforms into an interactive island with live activities and controls.',
    },
    {
      icon: Palette,
      title: 'Beautiful Design',
      description: 'Glassmorphic UI with smooth animations and customizable themes that match your style.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Zero latency updates with optimized performance that won\'t slow down your Mac.',
    },
    {
      icon: Layout,
      title: 'Flexible Widgets',
      description: 'Choose from 12+ widgets including clock, battery, weather, notifications, and music player.',
    },
    {
      icon: Sparkles,
      title: 'Smart Customization',
      description: 'Adjust opacity, toggle widgets, and create your perfect notch experience.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'All data stays on your device. No tracking, no analytics, just pure functionality.',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">Everything you need to make your notch useful</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary/50 smooth-transition hover:shadow-lg group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 smooth-transition">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}</div>
      </div>
    </section>
  );
}