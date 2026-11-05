import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import { BrandLogo } from './BrandLogo';
import { X, Lock, Mail, User, ShieldCheck, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onLearnerLoginSuccess }) {
  if (!isOpen) return null;

  const { login, register, loginLearner, family } = useAuth();
  const [authMode, setAuthMode] = useState('parent'); // 'parent' | 'learner'
  const [isRegister, setIsRegister] = useState(false);

  // Parent form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [familyName, setFamilyName] = useState('');

  // Learner form fields
  const [familyLearners, setFamilyLearners] = useState([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState('');
  const [pin, setPin] = useState('');

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load learners for the current active family device
  useEffect(() => {
    if (family?.id) {
      fetch(`/api/auth/family-learners/${family.id}`)
        .then(res => res.json())
        .then(data => {
          const l = data.learners || [];
          setFamilyLearners(l);
          if (l.length > 0 && !selectedLearnerId) {
            setSelectedLearnerId(l[0].id);
          }
        })
        .catch(err => console.error('Failed to load family learners:', err));
    }
  }, [family?.id, authMode]);

  const handleParentSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isRegister) {
        if (!familyName.trim() || !displayName.trim()) {
          throw new Error('Please fill in your name and family workspace name.');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters.');
        }
        await register({ email, password, displayName, familyName });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLearnerSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedLearnerId) {
      setError('Please select your learner name.');
      return;
    }
    if (!pin || !/^\d{4,6}$/.test(pin.trim())) {
      setError('Please enter your 4 to 6 digit secret PIN.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await loginLearner({ learnerId: selectedLearnerId, pin: pin.trim() });
      if (onLearnerLoginSuccess) {
        onLearnerLoginSuccess(res.learner);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getAvatarIcon = (code) => {
    const found = APP_CONFIG.avatarOptions.find(a => a.code === code);
    return found ? found.icon : '🌱';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Lock size={18} color="var(--color-bronze-dark)" />
            <h3 className="modal-title font-display" style={{ fontSize: '1.15rem' }}>
              {authMode === 'learner'
                ? 'Learner PIN Sign In'
                : isRegister
                ? 'New Family Registration'
                : 'Parent & Tutor Sign In'}
            </h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Auth Mode Toggle */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-alt)' }}>
          <button
            type="button"
            className={`tab-btn ${authMode === 'parent' ? 'active' : ''}`}
            onClick={() => { setAuthMode('parent'); setError(null); }}
            style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
          >
            Parent / Tutor
          </button>
          <button
            type="button"
            className={`tab-btn ${authMode === 'learner' ? 'active' : ''}`}
            onClick={() => { setAuthMode('learner'); setError(null); }}
            style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
          >
            Learner (PIN)
          </button>
        </div>

        {authMode === 'parent' ? (
          <form onSubmit={handleParentSubmit}>
            <div className="modal-body">
              {/* Centered Brand Emblem & Wordmark */}
              <div style={{ textAlign: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                <BrandLogo variant="stacked" size="md" />
              </div>

              {error && (
                <div className="notice-box notice-warning">
                  <span>{error}</span>
                </div>
              )}

              {isRegister && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-family-name">Family Workspace Name</label>
                    <input
                      id="reg-family-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dlamini Family"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      required
                    />
                    <span className="form-hint">Each homeschool family workspace is completely isolated from all other families.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-display-name">Parent / Tutor Full Name</label>
                    <input
                      id="reg-display-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Nomvula Dlamini"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  className="form-input"
                  placeholder="parent@example.co.za"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  className="form-input"
                  placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError(null);
                  }}
                >
                  {isRegister
                    ? 'Already have a family workspace? Sign In instead'
                    : "New to Ever After Education? Register a new Family"}
                </button>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                Published by <strong>{APP_CONFIG.publisherBrand}</strong>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                id="auth-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Please wait...' : isRegister ? 'Create Family Workspace' : 'Sign In'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLearnerSubmit}>
            <div className="modal-body">
              <div style={{ textAlign: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
                <BrandLogo variant="stacked" size="md" />
              </div>

              {error && (
                <div className="notice-box notice-warning">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="notice-box notice-privacy" style={{ margin: '0 0 1rem 0', padding: '0.65rem 0.85rem' }}>
                <ShieldCheck size={16} />
                <div style={{ fontSize: '0.8rem' }}>
                  <strong>Safe Learner Sign In:</strong> Tap your name below and enter your secret 4-digit PIN to access your lessons.
                </div>
              </div>

              {/* Learner Select */}
              <div className="form-group">
                <label className="form-label">Who is learning today?</label>
                {familyLearners.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
                    {familyLearners.map(lrn => (
                      <button
                        key={lrn.id}
                        type="button"
                        className={`card ${selectedLearnerId === lrn.id ? 'active' : ''}`}
                        onClick={() => setSelectedLearnerId(lrn.id)}
                        style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderColor: selectedLearnerId === lrn.id ? 'var(--color-primary-700)' : 'var(--border-subtle)',
                          background: selectedLearnerId === lrn.id ? 'var(--color-primary-50)' : 'var(--bg-surface-alt)'
                        }}
                      >
                        <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                          {getAvatarIcon(lrn.avatar_code)}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {lrn.preferred_name || lrn.first_name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {lrn.grade}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter Learner ID (e.g. lrn_kamohelo_01)"
                    value={selectedLearnerId}
                    onChange={(e) => setSelectedLearnerId(e.target.value)}
                    required
                  />
                )}
              </div>

              {/* PIN input */}
              <div className="form-group">
                <label className="form-label" htmlFor="learner-login-pin">Secret PIN</label>
                <input
                  id="learner-login-pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="••••"
                  className="form-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  style={{ fontSize: '1.4rem', letterSpacing: '0.4em', textAlign: 'center', fontWeight: 700 }}
                  required
                  autoFocus
                />
                <span className="form-hint">
                  Your 4 to 6 digit secret PIN set during invitation activation.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                id="learner-login-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !selectedLearnerId || pin.length < 4}
              >
                <KeyRound size={16} />
                <span>{submitting ? 'Checking PIN...' : 'Start Learning'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
