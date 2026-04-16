'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setDeviceType(isMobile ? 'mobile' : 'desktop');

    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setShowInstall(false);
      }
    };

    checkIfInstalled();

    // Listen for install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstall(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Show manual instructions
      setShowInstructions(true);
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
        setShowInstall(false);
      } else {
        console.log('❌ User dismissed the install prompt');
        setShowInstructions(true);
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install error:', error);
      setShowInstructions(true);
    }
  };

  const handleClose = () => {
    setShowInstall(false);
    setShowInstructions(false);
  };

  // Don't show if already installed
  if (isInstalled) return null;

  // Don't show if not prompted and no deferred prompt
  if (!showInstall && !deferredPrompt) return null;

  return (
    <>
      {/* Install Banner */}
      {showInstall && !showInstructions && (
        <div
          style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            zIndex: 999998,
            background: 'linear-gradient(135deg, #764ba2 0%, #f5576c 100%)',
            padding: '16px',
            boxShadow: '0 -4px 20px rgba(118, 75, 162, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <Download size={24} color="#fff" />
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontWeight: 'bold', margin: 0, fontSize: '16px' }}>
              Install GameZone App
            </p>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: '4px 0 0 0', fontSize: '14px' }}>
              Play games like a native app!
            </p>
          </div>
          <button
            onClick={handleInstall}
            style={{
              background: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              color: '#764ba2',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '15px',
              whiteSpace: 'nowrap',
            }}
          >
            Install
          </button>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Manual Instructions Modal */}
      {showInstructions && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10001,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              border: '1px solid rgba(118, 75, 162, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '24px' }}>📱 Install App</h2>
              <button
                onClick={handleClose}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {deviceType === 'mobile' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <Smartphone size={24} color="#c084fc" />
                  <p style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                    Mobile Installation
                  </p>
                </div>

                <div style={{ background: 'rgba(31, 41, 55, 0.5)', borderRadius: '12px', padding: '20px' }}>
                  <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>
                    <strong style={{ color: '#fff' }}>iOS (iPhone/iPad):</strong>
                  </p>
                  <ol style={{ color: '#d1d5db', paddingLeft: '20px', margin: '0 0 20px 0' }}>
                    <li style={{ marginBottom: '8px' }}>Tap the <strong style={{ color: '#60a5fa' }}>Share</strong> button (square with arrow)</li>
                    <li style={{ marginBottom: '8px' }}>Scroll down and tap <strong style={{ color: '#60a5fa' }}>"Add to Home Screen"</strong></li>
                    <li style={{ marginBottom: '8px' }}>Tap <strong style={{ color: '#60a5fa' }}>"Add"</strong> in the top right</li>
                  </ol>

                  <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>
                    <strong style={{ color: '#fff' }}>Android:</strong>
                  </p>
                  <ol style={{ color: '#d1d5db', paddingLeft: '20px', margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>Tap the <strong style={{ color: '#60a5fa' }}>⋮ menu</strong> (three dots)</li>
                    <li style={{ marginBottom: '8px' }}>Tap <strong style={{ color: '#60a5fa' }}>"Install app"</strong> or <strong style={{ color: '#60a5fa' }}>"Add to Home screen"</strong></li>
                    <li style={{ marginBottom: '8px' }}>Confirm installation</li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <Monitor size={24} color="#c084fc" />
                  <p style={{ color: '#fff', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                    Desktop Installation
                  </p>
                </div>

                <div style={{ background: 'rgba(31, 41, 55, 0.5)', borderRadius: '12px', padding: '20px' }}>
                  <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>
                    <strong style={{ color: '#fff' }}>Chrome/Edge:</strong>
                  </p>
                  <ol style={{ color: '#d1d5db', paddingLeft: '20px', margin: '0 0 20px 0' }}>
                    <li style={{ marginBottom: '8px' }}>Look for the <strong style={{ color: '#60a5fa' }}>install icon</strong> (📥) in the address bar</li>
                    <li style={{ marginBottom: '8px' }}>Click it and select <strong style={{ color: '#60a5fa' }}>"Install"</strong></li>
                    <li style={{ marginBottom: '8px' }}>Or click the <strong style={{ color: '#60a5fa' }}>⋮ menu</strong> → <strong style={{ color: '#60a5fa' }}>"Install GameZone"</strong></li>
                  </ol>

                  <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>
                    <strong style={{ color: '#fff' }}>Safari (Mac):</strong>
                  </p>
                  <ol style={{ color: '#d1d5db', paddingLeft: '20px', margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>Click <strong style={{ color: '#60a5fa' }}>File</strong> in the menu bar</li>
                    <li style={{ marginBottom: '8px' }}>Select <strong style={{ color: '#60a5fa' }}>"Add to Dock"</strong></li>
                  </ol>
                </div>
              </>
            )}

            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(118, 75, 162, 0.15)', borderRadius: '10px' }}>
              <p style={{ color: '#c084fc', margin: 0, fontSize: '14px' }}>
                ✨ <strong>Benefits:</strong> Play games instantly, works offline, looks like a native app!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
