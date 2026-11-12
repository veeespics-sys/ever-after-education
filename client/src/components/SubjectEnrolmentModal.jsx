import React, { useState, useEffect } from 'react';
import { X, BookCheck, CheckCircle2, AlertCircle, History, Sparkles, BookOpen } from 'lucide-react';

export function SubjectEnrolmentModal({ isOpen, onClose, learner, token, onEnrolmentUpdated }) {
  if (!isOpen || !learner) return null;

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [enrolments, setEnrolments] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/learners/${learner.id}/subjects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to load subject enrolments');
      }

      const data = await res.json();
      setAvailableSubjects(data.availableForGrade || []);
      setEnrolments(data.enrolments || []);

      const activeCodes = new Set(
        (data.enrolments || []).filter(e => e.status === 'active').map(e => e.subject_code)
      );
      setSelectedCodes(activeCodes);

      const learnerRes = await fetch(`/api/learners/${learner.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (learnerRes.ok) {
        const lData = await learnerRes.json();
        setHistoryList(lData.history || []);
      }
    } catch (err) {
      console.error('Load enrolment data error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [learner.id, isOpen]);

  const toggleSubject = (code) => {
    setSelectedCodes(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const currentActiveCodes = new Set(
        enrolments.filter(e => e.status === 'active').map(e => e.subject_code)
      );

      const toEnrol = Array.from(selectedCodes).filter(c => !currentActiveCodes.has(c));
      const toDeactivate = Array.from(currentActiveCodes).filter(c => !selectedCodes.has(c));

      if (toEnrol.length > 0) {
        const enrolRes = await fetch(`/api/learners/${learner.id}/subjects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ subjectCodes: toEnrol })
        });
        if (!enrolRes.ok) {
          const err = await enrolRes.json();
          throw new Error(err.error || 'Failed to enrol in selected subjects');
        }
      }

      for (const code of toDeactivate) {
        const deactRes = await fetch(`/api/learners/${learner.id}/subjects/${code}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'inactive',
            reason: 'Subject unselected by parent in enrolment settings'
          })
        });
        if (!deactRes.ok) {
          const err = await deactRes.json();
          throw new Error(err.error || `Failed to update status for ${code}`);
        }
      }

      onEnrolmentUpdated();
      onClose();
    } catch (err) {
      console.error('Save enrolment error:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookCheck size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.25rem' }}>
                Subject Enrolment: {learner.first_name}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {learner.grade} • South African CAPS Curriculum Offerings
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="notice-box notice-warning">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="notice-box notice-privacy" style={{ margin: 0, padding: '0.75rem 1rem' }}>
            <Sparkles size={16} />
            <div style={{ fontSize: '0.825rem' }}>
              <strong>Zero Data Loss Policy:</strong> Parents choose which subjects each learner studies. Unchecking a subject archives it without erasing previous lesson completions, scores, or history.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Select Enrolled Subjects ({selectedCodes.size} active)
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowHistory(!showHistory)}
              style={{ fontSize: '0.775rem' }}
            >
              <History size={13} />
              <span>{showHistory ? 'Hide History' : 'View Audit History'}</span>
            </button>
          </div>

          {showHistory && (
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Historical Enrolment Log:
              </div>
              {historyList.length === 0 ? (
                <div style={{ color: 'var(--text-subtle)' }}>No past modifications recorded yet.</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {historyList.map(h => (
                    <li key={h.id} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.35rem' }}>
                      <strong>{h.subject_title || h.subject_code}</strong>: {h.action} ({h.new_status})
                      <span style={{ color: 'var(--text-subtle)', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                        {new Date(h.timestamp).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading CAPS subjects for {learner.grade}...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {availableSubjects.map(sub => {
                const isSelected = selectedCodes.has(sub.code);
                return (
                  <div
                    key={sub.code}
                    id={`subject-item-${sub.code}`}
                    className={`enrolment-item-card ${isSelected ? 'enrolled' : ''}`}
                    onClick={() => toggleSubject(sub.code)}
                  >
                    <input
                      type="checkbox"
                      className="enrolment-checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      id={`check-${sub.code}`}
                    />
                    <div className="enrolment-details">
                      <div className="enrolment-title-row">
                        <span className="enrolment-title" style={{ fontWeight: 700 }}>{sub.title}</span>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          {sub.is_core === 1 && (
                            <span className="role-tag" style={{ background: '#FEF3C7', color: '#92400E' }}>
                              Core Subject
                            </span>
                          )}
                          <span className="verification-badge">
                            DBE Verified
                          </span>
                        </div>
                      </div>
                      <div className="enrolment-meta" style={{ marginBottom: '0.35rem' }}>
                        {sub.description}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <BookOpen size={12} />
                        <span>Reference: {sub.caps_doc_ref}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            id="save-enrolment-btn"
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Updating Enrolments...' : 'Save Enrolment Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}