import React from 'react';
import { Card, CardContent } from './ui/card';
import { Download, Settings, Rocket } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Download,
      title: 'Access Dashboard',
      description: 'Open the NotchPro dashboard with one click',
      number: '01',
    },
    {
      icon: Settings,
      title: 'Customize Widgets',
      description: 'Choose which widgets to display and adjust appearance',
      number: '02',
    },
    {
      icon: Rocket,
      title: 'Enjoy Your Notch',
      description: 'Your personalized notch is ready to use instantly',
      number: '03',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <Card className="relative border-2 hover:border-primary/50 smooth-transition hover:shadow-lg">
                <CardContent className="pt-6 text-center space-y-4">
                  {/* Step Number */}
                  <div className="text-6xl font-bold text-primary/20 absolute top-4 right-4">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="inline-flex p-4 rounded-full bg-primary/10">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}