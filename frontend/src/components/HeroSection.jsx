import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8 animate-fadeIn">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Transform Your MacBook Notch</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Make Your Notch
            <br />
            <span className="text-gradient">Work For You</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Turn the MacBook notch from a design quirk into a powerful dashboard.
            Display time, battery, weather, and more in beautiful glassmorphic style.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="group smooth-transition glow-effect"
              data-testid="hero-open-dashboard-btn"
            >
              Open Dashboard
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 smooth-transition" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="smooth-transition"
              data-testid="hero-see-demo-btn"
            >
              See Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
            <div>
              <div className="text-3xl font-bold text-primary">12+</div>
              <div className="text-sm text-muted-foreground">Widgets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Customizable</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">0ms</div>
              <div className="text-sm text-muted-foreground">Latency</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}