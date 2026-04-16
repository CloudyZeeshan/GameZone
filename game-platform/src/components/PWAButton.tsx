'use client';

import { useState, useEffect } from 'react';
import { Download, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PWAButtonProps {
  showLabel?: boolean;
}

export default function PWAButton({ showLabel = true }: PWAButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installStatus, setInstallStatus] = useState<'ready' | 'installing' | 'installed'>('ready');

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setInstallStatus('installed');
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('Install button clicked');
    
    if (!deferredPrompt) {
      console.log('No deferred prompt, showing instructions');
      // Show manual instructions (more common in development)
      setShowInstructions(true);
      return;
    }

    try {
      setInstallStatus('installing');
      console.log('Showing install prompt...');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
        setInstallStatus('installed');
        setShowPrompt(false);
      } else {
        console.log('❌ User dismissed the install prompt');
        setInstallStatus('ready');
        setShowInstructions(true);
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install error:', error);
      setInstallStatus('ready');
      setShowInstructions(true);
    }
  };

  const handleManualInstall = () => {
    setShowInstructions(true);
  };

  if (isInstalled) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm"
        title="App is installed!"
      >
        <CheckCircle2 size={18} />
        {showLabel && <span className="hidden sm:inline">Installed</span>}
      </div>
    );
  }

  if (!showPrompt && !deferredPrompt) {
    // Show button anyway to allow manual install
    return (
      <button
        onClick={handleManualInstall}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-300 hover:text-blue-400 hover:bg-white/10 transition-all"
        title="Install as app"
      >
        <Download size={20} />
        {showLabel && <span className="hidden sm:inline">Install</span>}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        disabled={installStatus === 'installing'}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
          installStatus === 'installing'
            ? 'bg-blue-500/50 text-white cursor-wait'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
        }`}
        title="Download app for mobile, tablet, and desktop"
      >
        <Download size={20} />
        {showLabel && <span>{installStatus === 'installing' ? 'Installing...' : 'Install App'}</span>}
      </button>

      {/* Manual Installation Instructions Modal */}
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
            padding: '12px',
          }}
          onClick={() => setShowInstructions(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              border: '1px solid rgba(118, 75, 162, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>📱 Install GameZone</h2>
              <button
                onClick={() => setShowInstructions(false)}
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
                  fontSize: '20px',
                }}
              >
                ✕
              </button>
            </div>

            {/* iOS Instructions */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>🍎</span>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>iPhone / iPad (iOS)</h3>
              </div>
              <div style={{ background: 'rgba(31, 41, 55, 0.5)', borderRadius: '12px', padding: '16px', marginLeft: '34px' }}>
                <ol style={{ color: '#d1d5db', paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                    Open GameZone in Safari
                  </li>
                  <li style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                    Tap the <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Share ↗️</span> button (bottom of screen)
                  </li>
                  <li style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                    Scroll down and tap <span style={{ background: 'rgba(96, 165, 250, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#60a5fa' }}>"Add to Home Screen"</span>
                  </li>
                  <li style={{ lineHeight: '1.6' }}>
                    Tap <span style={{ background: 'rgba(96, 165, 250, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#60a5fa' }}>"Add"</span> in the top right
                  </li>
                </ol>
              </div>
            </div>

            {/* Android Instructions */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>🤖</span>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Android Phone / Tablet</h3>
              </div>
              <div style={{ background: 'rgba(31, 41, 55, 0.5)', borderRadius: '12px', padding: '16px', marginLeft: '34px' }}>
                <ol style={{ color: '#d1d5db', paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                    Open GameZone in Chrome or Firefox
                  </li>
                  <li style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                    Tap the <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>⋮ menu</span> (three dots, top right)
                  </li>
                  <li style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                    Tap <span style={{ background: 'rgba(96, 165, 250, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#60a5fa' }}>"Install app"</span> or <span style={{ background: 'rgba(96, 165, 250, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#60a5fa' }}>"Add to Home Screen"</span>
                  </li>
                  <li style={{ lineHeight: '1.6' }}>
                    Confirm the installation
                  </li>
                </ol>
              </div>
            </div>

            {/* Desktop Instructions */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>💻</span>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Desktop / Laptop</h3>
              </div>
              <div style={{ background: 'rgba(31, 41, 55, 0.5)', borderRadius: '12px', padding: '16px', marginLeft: '34px' }}>
                <p style={{ color: '#9ca3af', marginBottom: '12px', fontSize: '14px', margin: 0, marginBottom: '12px' }}>
                  <strong style={{ color: '#60a5fa' }}>Chrome / Edge:</strong>
                </p>
                <ol style={{ color: '#d1d5db', paddingLeft: '20px', margin: '0 0 12px 0' }}>
                  <li style={{ marginBottom: '4px', lineHeight: '1.6' }}>
                    Look for the install icon 📥 in the address bar
                  </li>
                  <li style={{ lineHeight: '1.6' }}>
                    Or click the ⋮ menu → <span style={{ background: 'rgba(96, 165, 250, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#60a5fa' }}>"Install GameZone"</span>
                  </li>
                </ol>

                <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, marginBottom: '8px' }}>
                  <strong style={{ color: '#60a5fa' }}>Safari (Mac):</strong>
                </p>
                <ol style={{ color: '#d1d5db', paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '4px', lineHeight: '1.6' }}>
                    Click the share icon 🔗 in the toolbar
                  </li>
                  <li style={{ lineHeight: '1.6' }}>
                    Select <span style={{ background: 'rgba(96, 165, 250, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#60a5fa' }}>"Add to Dock"</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Benefits */}
            <div style={{ padding: '16px', background: 'rgba(118, 75, 162, 0.15)', borderRadius: '12px' }}>
              <p style={{ color: '#c084fc', margin: 0, fontSize: '15px', lineHeight: '1.6' }}>
                <strong>✨ Why Install?</strong>
              </p>
              <ul style={{ color: '#c084fc', margin: '8px 0 0 20px', fontSize: '14px', paddingLeft: 0 }}>
                <li style={{ marginBottom: '4px' }}>Play games instantly - no browser needed</li>
                <li style={{ marginBottom: '4px' }}>Works offline - play anywhere, anytime</li>
                <li style={{ marginBottom: '4px' }}>Looks like a native app on your home screen</li>
                <li>Fast performance and smooth gameplay</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
