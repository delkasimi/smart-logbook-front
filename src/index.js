// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const root = document.getElementById('root');
const rootContainer = createRoot(root);
rootContainer.render(<App />);