'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Gamepad2, HelpCircle, X } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Gamepad2 className="w-8 h-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GameZone
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              />
              {searchQuery && (
                <Link 
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300"
                >
                  Search
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-gray-300 hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href="/#categories" className="text-gray-300 hover:text-purple-400 transition-colors">
              Categories
            </Link>
            <Link href="/#featured" className="text-gray-300 hover:text-purple-400 transition-colors">
              Featured
            </Link>

            {/* Info/Help Button */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-2 text-gray-300 hover:text-purple-400 hover:bg-white/10 rounded-lg transition-all"
              title="Help & Info"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="relative z-50 md:hidden p-3 rounded-2xl text-gray-300 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-gray-950/95 border-t border-gray-800 shadow-2xl backdrop-blur-xl p-5 z-40">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            </div>
            {searchQuery && (
              <Link 
                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
              >
                Search for "{searchQuery}"
              </Link>
            )}
            <div className="space-y-2">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/#categories" 
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/#featured"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Featured
              </Link>
              <button
                onClick={() => {
                  setShowInfoModal(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left rounded-2xl px-4 py-3 text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>Help & Info</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info/Help Modal */}
      {showInfoModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999999,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflow: 'auto',
          }}
          onClick={() => setShowInfoModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '2px solid rgba(118, 75, 162, 0.5)',
              boxShadow: '0 0 50px rgba(118, 75, 162, 0.3), 0 25px 50px rgba(0, 0, 0, 0.7)',
              margin: 'auto',
              animation: 'fadeInScale 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h2 style={{ color: '#fff', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
                  🎮 GameZone
                </h2>
                <p style={{ color: '#c084fc', margin: '8px 0 0 0', fontSize: '14px' }}>Play Free HTML5 Games</p>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: 'none',
                  borderRadius: '12px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                ✕
              </button>
            </div>

            {/* Features */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#c084fc', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', margin: 0, marginBottom: '16px' }}>
                ⭐ What is GameZone?
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.8', margin: '0 0 12px 0' }}>
                GameZone is your ultimate destination for free HTML5 games! Play instantly in your browser with no downloads required.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { icon: '⚡', text: 'Instant Play' },
                  { icon: '📱', text: 'All Devices' },
                  { icon: '🎯', text: '100+ Games' },
                  { icon: '🚀', text: 'Fast & Fun' },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    background: 'rgba(31, 41, 55, 0.6)',
                    borderRadius: '10px',
                    border: '1px solid rgba(118, 75, 162, 0.3)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</div>
                    <div style={{ color: '#d1d5db', fontSize: '13px', fontWeight: '500' }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Categories */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#c084fc', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', margin: 0, marginBottom: '12px' }}>
                🎮 Game Categories
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Puzzle', 'Action', 'Arcade', 'Racing', 'Strategy', 'Casual'].map((cat, idx) => (
                  <div key={idx} style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #764ba2, #f5576c)',
                    borderRadius: '20px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}>
                    {cat}
                  </div>
                ))}
              </div>
            </div>

            {/* How to Play */}
            <div>
              <h3 style={{ color: '#c084fc', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', margin: 0, marginBottom: '12px' }}>
                🚀 How to Get Started
              </h3>
              <ol style={{ color: '#d1d5db', paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
                <li style={{ marginBottom: '10px', lineHeight: '1.6' }}>
                  Browse games from the <strong style={{ color: '#60a5fa' }}>Home</strong> page
                </li>
                <li style={{ marginBottom: '10px', lineHeight: '1.6' }}>
                  Click any game to start playing instantly
                </li>
                <li style={{ marginBottom: '10px', lineHeight: '1.6' }}>
                  No sign-ups needed, just play and enjoy!
                </li>
                <li style={{ lineHeight: '1.6' }}>
                  Challenge your friends and see who scores the highest 🏆
                </li>
              </ol>
            </div>

            <style>{`
              @keyframes fadeInScale {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </nav>
  );
}
