'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import type React from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const { signUp, signIn } = useAuth();

  useEffect(() => {
    // Check if Firebase is properly configured
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!firebaseApiKey || firebaseApiKey.includes('YOUR_')) {
      setIsDemoMode(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (isSignUp && (!displayName || displayName.trim().length < 2)) {
      setError('Please enter your name (at least 2 characters)');
      return;
    }

    if (!email || email.trim().length === 0) {
      setError('Please enter your email address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, displayName.trim());
      } else {
        await signIn(email, password);
      }
      resetForm();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // User-friendly error messages
      const errorCode = err.code || '';
      if (errorCode.includes('email-already-in-use')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (errorCode.includes('weak-password')) {
        setError('Password must be at least 6 characters long.');
      } else if (errorCode.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (errorCode.includes('user-not-found') || errorCode.includes('wrong-password')) {
        setError('Invalid email or password. Please try again.');
      } else if (errorCode.includes('too-many-requests')) {
        setError('Too many failed attempts. Please wait and try again later.');
      } else if (errorCode.includes('network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
    setShowPassword(false);
  };

  if (!isOpen) return null;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(12px)',
        padding: '12px',
        overflow: 'auto',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(118, 75, 162, 0.3)',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            border: 'none',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #764ba2 0%, #f5576c 100%)',
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <h2 
            id="auth-modal-title"
            style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#fff', 
            margin: '0 0 8px 0' 
          }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            margin: 0,
            fontSize: '16px'
          }}>
            {isSignUp ? 'Join GameZone and save your scores' : 'Sign in to continue playing'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Demo Mode Notice */}
          {isDemoMode && !error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '10px',
              color: '#93c5fd',
              fontSize: '13px',
            }}>
              ℹ️ Demo Mode: Sign in/up features will be enabled once Firebase credentials are added. For now, all UI features work perfectly!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          {/* Display Name (Sign Up Only) */}
          {isSignUp && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: '#d1d5db',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px',
              }}>
                👤 Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  pointerEvents: 'none',
                }}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name (e.g., Ahmed)"
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    paddingRight: '14px',
                    height: '52px',
                    background: 'rgba(31, 41, 55, 0.8)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#764ba2';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(118, 75, 162, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#d1d5db',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '6px',
            }}>
              📧 Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none',
              }}>
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (e.g., ahmed@gmail.com)"
                autoComplete="email"
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  paddingRight: '14px',
                  height: '52px',
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#764ba2';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(118, 75, 162, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#d1d5db',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '6px',
            }}>
              🔒 Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none',
              }}>
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (at least 6 characters)"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  paddingRight: '50px',
                  height: '52px',
                  background: 'rgba(31, 41, 55, 0.8)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#764ba2';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(118, 75, 162, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '52px',
              background: loading 
                ? 'rgba(118, 75, 162, 0.5)' 
                : 'linear-gradient(135deg, #764ba2 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {loading ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                </svg>
                Processing...
              </>
            ) : (
              isSignUp ? 'Sign Up' : 'Sign In'
            )}
          </button>

          {/* Toggle Auth Mode */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '20px',
            fontSize: '15px',
          }}>
            <span style={{ color: '#9ca3af' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#c084fc',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                padding: 0,
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
