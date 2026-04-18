import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Laptop } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-effect border-b" data-testid="navbar">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
          data-testid="navbar-logo"
        >
          <div className="p-2 rounded-lg bg-primary/10">
            <Laptop className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold">NotchPro</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary smooth-transition" data-testid="nav-features">
            Features
          </a>
          <a href="#demo" className="text-sm font-medium hover:text-primary smooth-transition" data-testid="nav-demo">
            Demo
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary smooth-transition" data-testid="nav-how-it-works">
            How It Works
          </a>
        </div>

        <Button onClick={() => navigate('/dashboard')} className="smooth-transition" data-testid="nav-dashboard-btn">
          Try Dashboard
        </Button>
      </div>
    </nav>
  );
}