import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { X, UserPlus, Save, ShieldAlert, Sparkles } from 'lucide-react';

export function LearnerModal({ isOpen, onClose, onSaved, initialLearner = null, token }) {
  if (!isOpen) return null;

  const isEditing = Boolean(initialLearner);
  const [firstName, setFirstName] = useState(initialLearner?.first_name || '');
  const [preferredName, setPreferredName] = useState(initialLearner?.preferred_name || '');
  const [grade, setGrade] = useState(initialLearner?.grade || 'Grade 4');
  const [avatarCode, setAvatarCode] = useState(initialLearner?.avatar_code || 'sprout');
  const [learningNotes, setLearningNotes] = useState(initialLearner?.learning_notes || '');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialLearner) {
      setFirstName(initialLearner.first_name || '');
      setPreferredName(initialLearner.preferred_name || '');
      setGrade(initialLearner.grade || 'Grade 4');
      setAvatarCode(initialLearner.avatar_code || 'sprout');
      setLearningNotes(initialLearner.learning_notes || '');
    } else {
      setFirstName('');
      setPreferredName('');
      setGrade('Grade 4');
      setAvatarCode('sprout');
      setLearningNotes('');
    }
    setError(null);
  }, [initialLearner, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('Please enter the learner’s first name.');
      return;
    }
    if (!grade.trim()) {
      setError('Please select a grade level.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const url = isEditing ? `/api/learners/${initialLearner.id}` : '/api/learners';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          preferredName: preferredName.trim() || firstName.trim(),
          grade,
          avatarCode,
          learningNotes: learningNotes.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save learner profile.');
      }

      onSaved(data.learner);
      onClose();
    } catch (err) {
      console.error('Save learner error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isEditing ? <Save size={20} color="var(--color-bronze-dark)" /> : <UserPlus size={20} color="var(--color-bronze-dark)" />}
            <h3 className="modal-title font-display">
              {isEditing ? `Edit Learner: ${initialLearner.first_name}` : 'Add New Learner'}
            </h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="notice-box notice-warning">
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="notice-box notice-privacy" style={{ margin: 0, padding: '0.75rem 1rem' }}>
              <Sparkles size={16} />
              <div style={{ fontSize: '0.8rem' }}>
                <strong>POPIA Privacy Safeguard:</strong> We collect only the minimum required information (name and grade). We do not collect birth dates, physical addresses, or medical information.
              </div>
            </div>

            {/* First Name & Nickname */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="learner-first-name">
                  First Name <span style={{ color: 'var(--color-danger-600)' }}>*</span>
                </label>
                <input
                  id="learner-first-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kamohelo"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="learner-preferred-name">Preferred Name / Nickname</label>
                <input
                  id="learner-preferred-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kamo"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                />
              </div>
            </div>

            {/* CAPS Grade Selection */}
            <div className="form-group">
              <label className="form-label" htmlFor="learner-grade">
                CAPS Grade Level <span style={{ color: 'var(--color-danger-600)' }}>*</span>
              </label>
              <select
                id="learner-grade"
                className="form-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              >
                {APP_CONFIG.phases.map(phase => (
                  <optgroup key={phase.id} label={phase.name}>
                    {phase.grades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <span className="form-hint">
                Changing a learner's grade preserves all historical learning records and assessments safely.
              </span>
            </div>

            {/* Avatar Selection */}
            <div className="form-group">
              <label className="form-label">Profile Icon</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {APP_CONFIG.avatarOptions.map(av => (
                  <button
                    key={av.code}
                    type="button"
                    className={`btn btn-sm ${avatarCode === av.code ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setAvatarCode(av.code)}
                    style={{ fontSize: '1rem', padding: '0.4rem 0.75rem' }}
                  >
                    <span>{av.icon}</span>
                    <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }}>{av.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div className="form-group">
              <label className="form-label" htmlFor="learner-notes">Educational Notes (Parent / Tutor Only)</label>
              <textarea
                id="learner-notes"
                className="form-textarea"
                rows="2"
                placeholder="e.g. Learns well with step-by-step visual models."
                value={learningNotes}
                onChange={(e) => setLearningNotes(e.target.value)}
              />
              <span className="form-hint">
                Confidential parent observations. Never shared with other families or public directories.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              id="learner-modal-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Learner' : 'Add Learner Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
