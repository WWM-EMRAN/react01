import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // CRA will automatically look for App.js OR App.jsx
import { SiteProvider } from './components/SiteContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <SiteProvider>
            <App />
        </SiteProvider>
    </React.StrictMode>
);