import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import NotchDemo from '../components/NotchDemo';
import HowItWorks from '../components/HowItWorks';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import NotchWidget from '../components/NotchWidget';
import useNotchSettings from '../hooks/useNotchSettings';

export default function LandingPage() {
  const [settings] = useNotchSettings();

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      <NotchWidget settings={settings} />
      <Navbar />
      <main>
        <HeroSection />
        <NotchDemo />
        <FeaturesSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}