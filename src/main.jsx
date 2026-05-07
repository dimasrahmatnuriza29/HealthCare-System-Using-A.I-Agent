import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CustomerProvider } from './contexts/CustomerContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CustomerProvider>
      <App />
    </CustomerProvider>
  </React.StrictMode>,
);
