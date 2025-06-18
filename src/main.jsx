// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import AuthProviderWithNavigate from './auth/auth.jsx';
import './app.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProviderWithNavigate>
        <App />
      </AuthProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>
);
