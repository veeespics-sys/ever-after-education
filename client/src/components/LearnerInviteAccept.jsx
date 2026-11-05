import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { APP_CONFIG } from '../config/appConfig';
import { ShieldCheck, KeyRound, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export function LearnerInviteAccept({ token, onAcceptSuccess, onGoToLogin }) {
  const [loading, setLoading] = useState(true);
  const [verifyData, setVerifyData] = useState(null);
  const [verifyError, setVerifyError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!token) {
      setVerifyError('No invitation token found in link.');
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        setLoading(true);
        setVerifyError(null);

        const res = await fetch(`/api/invitations/verify/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setErrorCode(data.code);
          throw new Error(data.error || 'Invalid invitation link.');
        }

        setVerifyData(data);
      } catch (err) {
        setVerifyError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const cleanPin = pin.trim();
    const cleanConfirm = confirmPin.trim();

    if (!cleanPin || !/^\d{4,6}$/.test(cleanPin)) {
      setSubmitError('Please choose a 4 to 6 digit secret PIN (numbers only).');
      return;
    }

    if (cleanPin !== cleanConfirm) {
      setSubmitError('The two PINs do not match. Please re-enter them carefully.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, pin: cleanPin })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to activate account.');
      }

      // Save token and trigger login state
      localStorage.setItem('thuto_token', data.token);
      if (onAcceptSuccess) {
        onAcceptSuccess(data);
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getAvatarIcon = (code) => {
    const found = APP_CONFIG.avatarOptions.find(a => a.code === code);
    return found ? found.icon : '🌱';
  };

  if (loading) {
    return (
      <div className="card" style={{ maxWidth: '520px', margin: '3rem auto', textAlign: 'center', padding: '3rem 2rem' }}>
        <BrandLogo variant="stacked" size="md" />
        <div style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
          Verifying your learning invitation...
        </div>
      </div>
    );
  }

  if (verifyError) {
    return (
      <div className="card" style={{ maxWidth: '520px', margin: '3rem auto', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <BrandLogo variant="stacked" size="md" />
        
        <div style={{ margin: '2rem 0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
            <AlertCircle size={28} />
          </div>
          <h2 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--color-bronze-dark)' }}>
            Invitation Unavailable
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px' }}>
            {verifyError}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={onGoToLogin}>
            Go to Learner Sign In
          </button>
        </div>
      </div>
    );
  }

  const { learner, familyName } = verifyData;

  return (
    <div className="card" style={{ maxWidth: '540px', margin: '2.5rem auto', padding: '2rem 2.25rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <BrandLogo variant="stacked" size="md" />
      </div>

      {/* Welcoming Learner Badge */}
      <div style={{ background: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
        <div className="learner-avatar-box" style={{ width: '56px', height: '56px', fontSize: '1.8rem', background: '#FFFFFF' }}>
          {getAvatarIcon(learner.avatarCode)}
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-bronze-medium)', letterSpacing: '0.05em' }}>
            {familyName}
          </span>
          <h2 className="font-display" style={{ fontSize: '1.35rem', color: 'var(--color-bronze-dark)', margin: '0.1rem 0' }}>
            Welcome, {learner.preferredName || learner.firstName}!
          </h2>
          <span className="pill-badge" style={{ fontSize: '0.75rem' }}>{learner.grade}</span>
        </div>
      </div>

      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Your parent or tutor has invited you to your private learning space. Choose a secret <strong>4 to 6 digit PIN</strong> so you can easily sign in to practice your lessons anytime.
      </div>

      {submitError && (
        <div className="notice-box notice-warning" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={18} />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="learner-setup-pin">
            Secret 4-Digit PIN <span style={{ color: 'var(--color-danger-600)' }}>*</span>
          </label>
          <input
            id="learner-setup-pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="e.g. 1234"
            className="form-input"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            style={{ fontSize: '1.25rem', letterSpacing: '0.3em', textAlign: 'center', fontWeight: 700 }}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="learner-confirm-pin">
            Confirm Secret PIN <span style={{ color: 'var(--color-danger-600)' }}>*</span>
          </label>
          <input
            id="learner-confirm-pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="Re-enter your PIN"
            className="form-input"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
            style={{ fontSize: '1.25rem', letterSpacing: '0.3em', textAlign: 'center', fontWeight: 700 }}
            required
          />
          <span className="form-hint">
            Remember this PIN! You will use it each time you open your learning dashboard.
          </span>
        </div>

        <div className="notice-box notice-privacy" style={{ margin: '1rem 0 1.5rem 0', padding: '0.65rem 0.85rem' }}>
          <ShieldCheck size={16} />
          <div style={{ fontSize: '0.775rem' }}>
            <strong>Child Safety:</strong> Your PIN is encrypted with standard password hashing and protected by automatic lockout against guessing.
          </div>
        </div>

        <button
          id="learner-accept-submit-btn"
          type="submit"
          className="btn btn-primary"
          disabled={submitting || pin.length < 4}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', justifyContent: 'center' }}
        >
          <KeyRound size={18} />
          <span>{submitting ? 'Setting up your space...' : 'Activate My Learning Space'}</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
