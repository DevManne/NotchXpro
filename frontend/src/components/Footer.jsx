import React from 'react';
import { Laptop, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t py-12 px-4 bg-card/50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Laptop className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">NotchPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making your MacBook notch work for you with beautiful, customizable widgets.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary smooth-transition">Features</a></li>
              <li><a href="#demo" className="hover:text-primary smooth-transition">Demo</a></li>
              <li><a href="#how-it-works" className="hover:text-primary smooth-transition">How It Works</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary smooth-transition">Documentation</a></li>
              <li><a href="#" className="hover:text-primary smooth-transition">Support</a></li>
              <li><a href="#" className="hover:text-primary smooth-transition">Updates</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 smooth-transition">
                <Github className="h-5 w-5 text-primary" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 smooth-transition">
                <Twitter className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 NotchPro. Made with ❤️ for MacBook users.</p>
        </div>
      </div>
    </footer>
  );
}