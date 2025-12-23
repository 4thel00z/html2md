import React from 'react';
import { createRoot } from 'react-dom/client';
import './output.css';
import { ConverterApp } from './components/ConverterApp.tsx';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ConverterApp />
    </React.StrictMode>
  );
}

