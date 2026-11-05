import React, { useState, useEffect } from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { X, Send, QrCode, ShieldCheck, CheckCircle2, AlertCircle, Clock, Trash2, RefreshCw, KeyRound, Sparkles } from 'lucide-react';

export function InvitationModal({ isOpen, onClose, learners = [], initialLearner = null, token, onInvitationChanged }) {
  if (!isOpen) return null;

  const [selectedLearnerId, setSelectedLearnerId] = useState(initialLearner?.id || (learners[0]?.id || ''));
  const [expiresInDays, setExpiresInDays] = useState('7');
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'list'
  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [invitationsList, setInvitationsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/invitations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInvitationsList(data.invitations || []);
      }
    } catch (err) {
      console.error('Fetch invitations error:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInvitations();
      setGeneratedInvite(null);
      setError(null);
      setSuccessMsg(null);
      if (initialLearner) {
        setSelectedLearnerId(initialLearner.id);
      } else if (learners.length > 0 && !selectedLearnerId) {
        setSelectedLearnerId(learners[0].id);
      }
    }
  }, [isOpen, initialLearner]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedLearnerId) {
      setError('Please select a learner.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);

      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          learnerId: selectedLearnerId,
          expiresInDays: parseInt(expiresInDays, 10)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate invitation.');
      }

      const inviteUrl = `${window.location.origin}/invite/${data.rawToken}`;
      setGeneratedInvite({
        ...data.invitation,
        rawToken: data.rawToken,
        inviteUrl,
        learner: data.learner
      });

      setSuccessMsg(`Secure invitation generated for ${data.learner.firstName}.`);
      fetchInvitations();
      if (onInvitationChanged) onInvitationChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (inviteId) => {
    if (!window.confirm('Are you sure you want to revoke this invitation? Any unused link or QR code will stop working immediately.')) {
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/invitations/${inviteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to revoke invitation.');

      setSuccessMsg('Invitation revoked successfully.');
      if (generatedInvite?.id === inviteId) {
        setGeneratedInvite(null);
      }
      fetchInvitations();
      if (onInvitationChanged) onInvitationChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  const selectedLearner = learners.find(l => l.id === selectedLearnerId);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="pill-badge" style={{ background: '#FFF7ED', color: '#C2410C', borderColor: '#FDBA74' }}>
            <Clock size={12} /> Pending Activation
          </span>
        );
      case 'accepted':
        return (
          <span className="pill-badge" style={{ background: '#F0FDF4', color: '#15803D', borderColor: '#86EFAC' }}>
            <CheckCircle2 size={12} /> Account Active
          </span>
        );
      case 'expired':
        return (
          <span className="pill-badge" style={{ background: '#F3F4F6', color: '#6B7280', borderColor: '#D1D5DB' }}>
            Expired
          </span>
        );
      case 'revoked':
        return (
          <span className="pill-badge" style={{ background: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' }}>
            Revoked
          </span>
        );
      default:
        return <span className="pill-badge">{status}</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <QrCode size={20} color="var(--color-bronze-dark)" />
            <h3 className="modal-title font-display">
              Learner Access &amp; Invitations
            </h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Tab selection */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 1.5rem' }}>
          <button
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
            style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
          >
            Generate Invitation
          </button>
          <button
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => { setActiveTab('list'); fetchInvitations(); }}
            style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
          >
            Invitation History ({invitationsList.length})
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && (
            <div className="notice-box notice-warning">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="notice-box notice-success" style={{ background: '#F0FDF4', borderColor: '#86EFAC', color: '#15803D' }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'create' && (
            <div>
              {!generatedInvite ? (
                <form onSubmit={handleGenerate}>
                  <div className="notice-box notice-privacy" style={{ margin: '0 0 1.25rem 0' }}>
                    <ShieldCheck size={18} />
                    <div style={{ fontSize: '0.825rem' }}>
                      <strong>Safe Pilot Onboarding:</strong> Each invitation generates a single-use cryptographic token. When opened, the learner will choose their own secret 4-digit PIN. Raw tokens are never logged or stored in plain text.
                    </div>
                  </div>

                  {/* Select Learner */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="invite-learner-select">Select Learner</label>
                    <select
                      id="invite-learner-select"
                      className="form-select"
                      value={selectedLearnerId}
                      onChange={(e) => setSelectedLearnerId(e.target.value)}
                      required
                    >
                      {learners.map(lrn => (
                        <option key={lrn.id} value={lrn.id}>
                          {lrn.first_name} {lrn.preferred_name && `("${lrn.preferred_name}")`} — {lrn.grade}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Expiration */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="invite-expiry-select">Invitation Expiration</label>
                    <select
                      id="invite-expiry-select"
                      className="form-select"
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(e.target.value)}
                    >
                      <option value="1">24 Hours (Fast Setup)</option>
                      <option value="3">3 Days</option>
                      <option value="7">7 Days (Recommended)</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days</option>
                    </select>
                    <span className="form-hint">
                      Unused invitations automatically expire and can be revoked or re-issued at any time.
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      Cancel
                    </button>
                    <button
                      id="generate-invite-submit-btn"
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || !selectedLearnerId}
                    >
                      <Send size={15} />
                      <span>{loading ? 'Generating...' : 'Create Invitation Link & QR Code'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="card" style={{ background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-bronze-dark)' }}>
                        Invitation for {generatedInvite.learner?.firstName || 'Learner'}
                      </span>
                      {getStatusBadge(generatedInvite.status)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Expires: {new Date(generatedInvite.expires_at).toLocaleString()}
                    </div>
                  </div>

                  {/* QR Code and Copy Link Display */}
                  <QRCodeDisplay
                    url={generatedInvite.inviteUrl}
                    title={`Scan to Activate: ${generatedInvite.learner?.firstName}`}
                    size={220}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setGeneratedInvite(null)}
                    >
                      <RefreshCw size={14} />
                      <span>Create Another Invitation</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-danger-600)' }}
                      onClick={() => handleRevoke(generatedInvite.id)}
                    >
                      <Trash2 size={14} />
                      <span>Revoke Link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'list' && (
            <div>
              {invitationsList.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                  <QrCode size={36} color="var(--color-bronze-light)" />
                  <h4 style={{ marginTop: '0.5rem' }}>No invitations issued yet</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Use the "Generate Invitation" tab above to create your child's onboarding link.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {invitationsList.map(inv => (
                    <div
                      key={inv.id}
                      style={{
                        padding: '0.85rem 1rem',
                        background: 'var(--bg-surface-alt)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600 }}>{inv.learner_name}</span>
                          <span className="pill-badge" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>{inv.grade}</span>
                          {getStatusBadge(inv.status)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Created: {new Date(inv.created_at).toLocaleDateString()} • Expires: {new Date(inv.expires_at).toLocaleDateString()}
                          {inv.accepted_at && ` • Activated: ${new Date(inv.accepted_at).toLocaleDateString()}`}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {inv.status === 'pending' && (
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--color-danger-600)', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => handleRevoke(inv.id)}
                            title="Revoke this invitation"
                          >
                            <Trash2 size={13} />
                            <span>Revoke</span>
                          </button>
                        )}
                        {inv.status !== 'pending' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => {
                              setSelectedLearnerId(inv.learner_id);
                              setActiveTab('create');
                            }}
                            title="Generate a new replacement invitation"
                          >
                            <RefreshCw size={13} />
                            <span>New Link</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
