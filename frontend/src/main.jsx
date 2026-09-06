import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#ffffff', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
          <div style={{ background: '#1e293b', padding: '40px', borderRadius: '24px', maxWidth: '480px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <img src="/logo.png" alt="EasyXerox" style={{ height: '40px', margin: '0 auto 16px auto', display: 'block' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '12px' }}>Application Update Notice</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>
              The application has been updated with the latest live components. Please tap below to refresh your browser cache.
            </p>
            <button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  caches.keys().then((names) => {
                    for (let name of names) caches.delete(name);
                  });
                }
                window.location.reload();
              }}
              style={{ background: '#0C3D97', color: '#ffffff', border: 'none', padding: '14px 32px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(12, 61, 151, 0.4)' }}
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
