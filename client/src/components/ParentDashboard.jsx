import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import { 
  Users, UserPlus, BookOpen, Settings, Eye, Clock, ShieldCheck, 
  Sparkles, CheckCircle2, AlertTriangle, Activity, ArrowRight, BookCheck, Edit3,
  QrCode, KeyRound, Send, RefreshCw, Trash2
} from 'lucide-react';

export function ParentDashboard({ onAddLearner, onEditLearner, onManageSubjects, onSwitchToLearnerView, onInviteLearner, refreshKey = 0 }) {
  const { family, token, activeLearner, setActiveLearner } = useAuth();
  const [learners, setLearners] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('learners'); // 'learners' | 'invitations' | 'activity' | 'audit'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch learners
      const learnersRes = await fetch('/api/learners', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!learnersRes.ok) throw new Error('Failed to load family learners');
      const learnersData = await learnersRes.json();
      setLearners(learnersData.learners || []);

      // 2. Fetch invitations
      const invRes = await fetch('/api/invitations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvitations(invData.invitations || []);
      }

      // 3. Fetch activity overview
      const actRes = await fetch('/api/family/activity', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (actRes.ok) {
        const actData = await actRes.json();
        setActivityList(actData.activity || []);
      }

      // 4. Fetch audit logs
      const auditRes = await fetch('/api/family/audit', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs || []);
      }
    } catch (err) {
      console.error('Fetch family data error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchFamilyData();
  }, [token, refreshKey]);

  const getStatusBadge = (state) => {
    switch (state) {
      case 'online':
        return (
          <span className="activity-status-indicator status-online">
            <span className="status-dot"></span> Online Now
          </span>
        );
      case 'working_on_lesson':
        return (
          <span className="activity-status-indicator status-working">
            <span className="status-dot"></span> Working on Lesson
          </span>
        );
      case 'recently_active':
        return (
          <span className="activity-status-indicator status-recent">
            <span className="status-dot"></span> Active in last 24h
          </span>
        );
      default:
        return (
          <span className="activity-status-indicator status-offline">
            <span className="status-dot"></span> Offline
          </span>
        );
    }
  };

  const getAvatarIcon = (code) => {
    const found = APP_CONFIG.avatarOptions.find(a => a.code === code);
    return found ? found.icon : '🌱';
  };

  return (
    <div>
      {/* Hero Welcome */}
      <section className="hero-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', zIndex: 2, flex: '1 1 500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="pill-badge" style={{ background: 'rgba(184, 125, 75, 0.25)', borderColor: 'rgba(184, 125, 75, 0.4)' }}>
              {APP_CONFIG.brandName} • Family Workspace
            </span>
            <span className="pill-badge">
              Isolated Data Boundary: {family?.id}
            </span>
          </div>
          <h1>{family ? family.name : 'Homeschool Family Workspace'}</h1>
          <p className="hero-subtitle">
            Manage your learners, select CAPS curriculum subjects, and nurture educational mastery across Grades R through 12.
          </p>

          <div className="hero-badges">
            <span className="pill-badge">
              <CheckCircle2 size={14} color="#6C927F" />
              CAPS Aligned (Grades R–12)
            </span>
            <span className="pill-badge">
              <ShieldCheck size={14} color="#B87D4B" />
              POPIA Data Minimisation Enforced
            </span>
            <span className="pill-badge">
              <Sparkles size={14} color="#D4A77E" />
              Zero Silent Data Loss Guarantee
            </span>
          </div>
        </div>

        <div style={{ flex: '0 1 340px', maxWidth: '340px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '2px solid rgba(184, 125, 75, 0.35)' }}>
          <img
            src="/brand/everafter-promo.jpg"
            alt="Ever After Education homeschool study scene"
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Philosophy & Privacy Notice */}
      <div className="notice-box notice-info">
        <Activity size={20} color="var(--color-bronze-dark)" />
        <div>
          <strong>Educational Assessment Philosophy:</strong> {APP_CONFIG.brandName} identifies observable learning patterns (e.g., repeated fraction errors or method retention) to constructively adapt explanations. We do not diagnose medical conditions, use screen time as a measure of understanding, or rank learners against peers.
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        <button
          id="tab-learners"
          className={`tab-btn ${activeTab === 'learners' ? 'active' : ''}`}
          onClick={() => setActiveTab('learners')}
        >
          <Users size={16} />
          <span>Learner Profiles ({learners.length})</span>
        </button>
        <button
          id="tab-invitations"
          className={`tab-btn ${activeTab === 'invitations' ? 'active' : ''}`}
          onClick={() => setActiveTab('invitations')}
        >
          <QrCode size={16} />
          <span>Invitations &amp; Access ({invitations.filter(i => i.status === 'pending').length} active)</span>
        </button>
        <button
          id="tab-activity"
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Clock size={16} />
          <span>Learning Activity States</span>
        </button>
        <button
          id="tab-audit"
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <ShieldCheck size={16} />
          <span>Security &amp; Audit Trail</span>
        </button>
      </div>

      {/* Tab 1: Learners List */}
      {activeTab === 'learners' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="font-display" style={{ fontSize: '1.4rem' }}>Enrolled Learners</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Each child has an isolated grade, selected CAPS subjects, and personal learning records.
              </p>
            </div>
            <button
              id="add-learner-btn"
              className="btn btn-primary"
              onClick={onAddLearner}
            >
              <UserPlus size={16} />
              <span>Add Learner Profile</span>
            </button>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              Loading learner records...
            </div>
          ) : learners.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🌱</div>
              <h3 className="empty-state-title">No learners added yet</h3>
              <p className="empty-state-desc">
                Begin by adding your first learner profile. You will be able to choose their CAPS grade level and select their enrolled subjects.
              </p>
              <button className="btn btn-primary" onClick={onAddLearner}>
                <UserPlus size={16} />
                <span>Add Your First Learner</span>
              </button>
            </div>
          ) : (
            <div className="grid-2">
              {learners.map(lrn => (
                <div key={lrn.id} id={`learner-card-${lrn.id}`} className="learner-card">
                  <div className="learner-card-top">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div className="learner-avatar-box">
                        {getAvatarIcon(lrn.avatar_code)}
                      </div>
                      <div className="learner-info">
                        <div className="learner-name">
                          {lrn.first_name} {lrn.preferred_name && lrn.preferred_name !== lrn.first_name && `("${lrn.preferred_name}")`}
                        </div>
                        <div className="learner-grade-tag">
                          {lrn.grade}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(lrn.activity_state)}
                  </div>

                  {lrn.learning_notes && (
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', background: 'var(--bg-surface-alt)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Notes:</strong> {lrn.learning_notes}
                    </div>
                  )}

                  <div className="learner-subjects-wrap">
                    <div className="learner-subjects-label">
                      Active Subjects ({lrn.active_subject_count})
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-subtle)' }}>
                      {lrn.active_subject_count === 0 ? (
                        <span style={{ color: 'var(--color-warning-600)' }}>
                          No subjects enrolled. Click "Manage Subjects" below.
                        </span>
                      ) : (
                        <span>Enrolled in CAPS subjects for {lrn.grade}.</span>
                      )}
                    </div>
                  </div>

                  {/* Actions for this learner */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      id={`edit-learner-btn-${lrn.id}`}
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEditLearner(lrn)}
                      title="Edit learner details or grade"
                    >
                      <Edit3 size={14} />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      id={`manage-subjects-btn-${lrn.id}`}
                      className="btn btn-secondary btn-sm"
                      onClick={() => onManageSubjects(lrn)}
                      title="Enrol in or modify CAPS subjects"
                    >
                      <BookCheck size={14} />
                      <span>Manage Subjects</span>
                    </button>

                    <button
                      id={`invite-learner-btn-${lrn.id}`}
                      className="btn btn-secondary btn-sm"
                      onClick={() => onInviteLearner(lrn)}
                      title="Generate onboarding invitation link or QR code"
                    >
                      <QrCode size={14} />
                      <span>Invite / QR</span>
                    </button>

                    <button
                      id={`preview-learner-btn-${lrn.id}`}
                      className="btn btn-accent btn-sm"
                      onClick={() => onSwitchToLearnerView(lrn)}
                      title="Switch to learner view for this child"
                      style={{ marginLeft: 'auto' }}
                    >
                      <Eye size={14} />
                      <span>View as Learner</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Invitations & Access (Phase 2 Feature) */}
      {activeTab === 'invitations' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="font-display" style={{ fontSize: '1.4rem' }}>Learner Access &amp; Invitations</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Generate secure, single-use invitation links and QR codes for your learners to set up their secret PINs.
              </p>
            </div>
            <button
              id="generate-new-invite-btn"
              className="btn btn-primary"
              onClick={() => onInviteLearner(learners[0] || null)}
              disabled={learners.length === 0}
            >
              <Send size={15} />
              <span>Generate Invitation &amp; QR Code</span>
            </button>
          </div>

          <div className="notice-box notice-privacy" style={{ marginBottom: '1.5rem' }}>
            <ShieldCheck size={18} />
            <div style={{ fontSize: '0.825rem' }}>
              <strong>Status Clarity:</strong> Invitation status indicates whether a learner's account credentials (PIN) are pending, active, expired, or revoked. To see if a learner is currently logged in or actively working on lessons, refer to the <strong>Learning Activity States</strong> tab.
            </div>
          </div>

          {invitations.length === 0 ? (
            <div className="empty-state">
              <QrCode size={40} color="var(--color-bronze-light)" />
              <h3 className="empty-state-title">No invitations issued yet</h3>
              <p className="empty-state-desc">
                Generate an invitation link or QR code to let your learner set up their private learning PIN on a tablet or computer.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onInviteLearner(learners[0] || null)}
                disabled={learners.length === 0}
              >
                <Send size={15} />
                <span>Create Your First Invitation</span>
              </button>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>Learner</th>
                    <th>Grade</th>
                    <th>Access / Invitation Status</th>
                    <th>Expires At</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600 }}>{inv.learner_name}</td>
                      <td>{inv.grade}</td>
                      <td>
                        {inv.status === 'pending' && (
                          <span className="pill-badge" style={{ background: '#FFF7ED', color: '#C2410C', borderColor: '#FDBA74' }}>
                            <Clock size={12} /> Pending Activation
                          </span>
                        )}
                        {inv.status === 'accepted' && (
                          <span className="pill-badge" style={{ background: '#F0FDF4', color: '#15803D', borderColor: '#86EFAC' }}>
                            <CheckCircle2 size={12} /> PIN Setup / Account Linked
                          </span>
                        )}
                        {inv.status === 'expired' && (
                          <span className="pill-badge" style={{ background: '#F3F4F6', color: '#6B7280', borderColor: '#D1D5DB' }}>
                            Expired
                          </span>
                        )}
                        {inv.status === 'revoked' && (
                          <span className="pill-badge" style={{ background: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' }}>
                            Revoked
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                        {new Date(inv.expires_at).toLocaleString()}
                      </td>
                      <td style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {inv.status === 'pending' && (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--color-danger-600)', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                              onClick={async () => {
                                if (window.confirm(`Revoke unused invitation for ${inv.learner_name}?`)) {
                                  await fetch(`/api/invitations/${inv.id}`, {
                                    method: 'DELETE',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  });
                                  fetchFamilyData();
                                }
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Revoke</span>
                            </button>
                          )}
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                            onClick={() => {
                              const found = learners.find(l => l.id === inv.learner_id);
                              onInviteLearner(found || { id: inv.learner_id, first_name: inv.learner_name, grade: inv.grade });
                            }}
                          >
                            <RefreshCw size={13} />
                            <span>New Link</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Activity States */}
      {activeTab === 'activity' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title font-display">
                <Clock size={20} color="var(--color-primary-700)" />
                Learner Activity Indicators
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Educational status indicators clearly distinguish between being logged in, recent activity, and active lesson engagement.
              </p>
            </div>
          </div>

          <table className="audit-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Grade</th>
                <th>Current Status</th>
                <th>Current Activity / Subject</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {activityList.map(item => (
                <tr key={item.learner_id}>
                  <td style={{ fontWeight: 600 }}>{item.first_name}</td>
                  <td>{item.grade}</td>
                  <td>{getStatusBadge(item.state)}</td>
                  <td>{item.current_subject_title || 'General navigation'}</td>
                  <td style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                    {item.last_active_at ? new Date(item.last_active_at).toLocaleString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Security & Audit Trail */}
      {activeTab === 'audit' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title font-display">
                <ShieldCheck size={20} color="var(--color-primary-700)" />
                Family Security & Administrative Log
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Logs administrative actions, enrolment modifications, and security events for this family only.
              </p>
            </div>
          </div>

          {auditLogs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No administrative events recorded yet.
            </div>
          ) : (
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>
                      <span className="role-tag" style={{ background: 'var(--bg-surface-alt)', color: 'var(--text-main)' }}>
                        {log.action}
                      </span>
                    </td>
                    <td>{log.details}</td>
                    <td style={{ fontWeight: 500 }}>{log.performed_by || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
