import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Simplify the rendering process to reduce potential errors
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found!");
} else {
  // Simple loading state
  rootElement.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #000;
      color: #8050FF;
    ">
      <div>Loading NODO AI...</div>
    </div>
  `;

  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    // Clear loading message
    rootElement.innerHTML = '';

    // Mount app
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }, 100);
}
