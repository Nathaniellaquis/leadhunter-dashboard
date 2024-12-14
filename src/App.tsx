// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicRoute } from './contexts/PublicRoute';
import { PrivateRoute } from './contexts/PrivateRoute';
import { AuthAwareRoute } from './contexts/AuthAwareRoute'; // Import the new wrapper

import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import PlatformEmails from './pages/PlatformEmails';
import PricingPage from './pages/PricingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/platform/:platform" element={<PlatformEmails />} />
          </Route>

          {/* Auth-aware route (no redirects, just shows correct topbar) */}
          <Route
            path="/pricing"
            element={
              <AuthAwareRoute>
                <PricingPage />
              </AuthAwareRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
