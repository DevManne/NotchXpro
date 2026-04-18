import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import SpotifyCallback from './pages/SpotifyCallback';
import { Toaster } from './components/ui/sonner';
import { SpotifyProvider } from './context/SpotifyContext';

function App() {
  return (
    <Router>
      <SpotifyProvider>
        <div className="App dark min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/callback" element={<SpotifyCallback />} />
          </Routes>
          <Toaster />
        </div>
      </SpotifyProvider>
    </Router>
  );
}

export default App;