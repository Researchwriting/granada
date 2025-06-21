import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import LandingPage from './LandingPage.tsx';
import MarketingLandingPage from './MarketingLandingPage.tsx';
import KiinLandingPage from './KiinLandingPage.tsx';
import GranadaLandingPage from './GranadaLandingPage.tsx';
import SearchLoadingPage from './SearchLoadingPage.tsx';
import SearchResultsPage from './SearchResultsPage.tsx';
import CheckoutPage from './CheckoutPage.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/marketing" element={<MarketingLandingPage />} />
            <Route path="/kiin" element={<KiinLandingPage />} />
            <Route path="/" element={<GranadaLandingPage />} />
            <Route path="/search" element={<SearchLoadingPage />} />
            <Route path="/results" element={<SearchResultsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);