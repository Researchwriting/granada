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
import DarkGranadaLandingPage from './DarkGranadaLandingPage.tsx';
import DarkSearchLoadingPage from './DarkSearchLoadingPage.tsx';
import DarkSearchResultsPage from './DarkSearchResultsPage.tsx';
import DarkCheckoutPage from './DarkCheckoutPage.tsx';
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
            <Route path="/" element={<DarkGranadaLandingPage />} />
            <Route path="/search" element={<DarkSearchLoadingPage />} />
            <Route path="/results" element={<DarkSearchResultsPage />} />
            <Route path="/checkout" element={<DarkCheckoutPage />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);