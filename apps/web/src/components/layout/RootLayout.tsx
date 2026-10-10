import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppHeader } from './AppHeader/AppHeader.js';
import { AppFooter } from './AppFooter/AppFooter.js';
import { CloudOff } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const [isWakingServer, setIsWakingServer] = useState(false);

  useEffect(() => {
    // Probe /healthz with a timeout to detect sleeping cold-starts
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setIsWakingServer(true);
    }, 2500);

    fetch('/healthz', { signal: controller.signal })
      .then((res) => {
        if (res.ok) setIsWakingServer(false);
      })
      .catch(() => {
        // Cold boot or offline
      })
      .finally(() => {
        clearTimeout(timeout);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Toaster position="bottom-right" richColors />

      {isWakingServer && (
        <div
          role="status"
          style={{
            backgroundColor: '#0F2B2E',
            color: '#F5F7F6',
            padding: '10px 16px',
            textAlign: 'center',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <CloudOff size={16} color="#F2B33D" />
          <span>Waking the reservation server — about 30 seconds...</span>
        </div>
      )}

      <AppHeader />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <AppFooter />
    </div>
  );
};
