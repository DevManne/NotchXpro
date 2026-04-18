import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 p-12 text-center">
          {/* Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
          
          {/* Content */}
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform
              <br />
              <span className="text-gradient">Your Notch?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of MacBook users who have made their notch work for them.
              Start customizing today.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="group smooth-transition glow-effect"
              data-testid="cta-get-started-btn"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 smooth-transition" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}