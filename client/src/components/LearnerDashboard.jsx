import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import { LessonPlayer } from './LessonPlayer';
import { 
  BookOpen, Sparkles, Award, ArrowLeft, CheckCircle2, Play, 
  HelpCircle, Lightbulb, Compass, Target, Clock, Shield, LogOut,
  Calculator, Check
} from 'lucide-react';

export function LearnerDashboard({ learner, onBackToParent }) {
  const { token, user, logout } = useAuth();
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Phase 3: Lesson Engine active mode
  const [isLessonPlayerActive, setIsLessonPlayerActive] = useState(false);
  const [lessonProgressSummary, setLessonProgressSummary] = useState(null);

  // Fetch this specific learner's enrolled subjects and progress
  useEffect(() => {
    if (!learner) return;

    const fetchLearnerData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch subjects
        const res = await fetch(`/api/learners/${learner.id}/subjects`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to load learner subjects');

        const data = await res.json();
        const active = (data.enrolments || []).filter(e => e.status === 'active');
        setEnrolledSubjects(active);

        if (active.length > 0) {
          setSelectedSubject(active[0]);
        }

        // Fetch Phase 3 lesson progress summary
        try {
          const progRes = await fetch(`/api/lessons/progress/${learner.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (progRes.ok) {
            const progData = await progRes.json();
            setLessonProgressSummary(progData.summary);
          }
        } catch (progErr) {
          console.warn('Could not fetch lesson progress:', progErr);
        }
      } catch (err) {
        console.error('Fetch learner subjects error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnerData();
  }, [learner?.id, token]);

  const getAvatarIcon = (code) => {
    const found = APP_CONFIG.avatarOptions.find(a => a.code === code);
    return found ? found.icon : '🌱';
  };

  if (!learner) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>No learner selected</h3>
        <button className="btn btn-primary" onClick={onBackToParent} style={{ marginTop: '1rem' }}>
          Return to Parent Dashboard
        </button>
      </div>
    );
  }

  // If Lesson Player is active, render full-screen interactive lesson view
  if (isLessonPlayerActive) {
    return (
      <LessonPlayer
        learner={learner}
        initialGrade={learner.grade}
        token={token}
        onBack={() => {
          setIsLessonPlayerActive(false);
          // Refetch progress
          if (learner.id) {
            fetch(`/api/lessons/progress/${learner.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
              .then(r => r.json())
              .then(d => { if (d.summary) setLessonProgressSummary(d.summary); })
              .catch(() => {});
          }
        }}
      />
    );
  }

  return (
    <div>
      {/* Top Banner for Learner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        {user?.role === 'learner' ? (
          <button
            id="learner-logout-btn"
            className="btn btn-secondary btn-sm"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Sign Out ({learner.first_name})</span>
          </button>
        ) : (
          <button
            id="learner-back-to-parent-btn"
            className="btn btn-secondary btn-sm"
            onClick={onBackToParent}
          >
            <ArrowLeft size={16} />
            <span>Exit to Parent Workspace</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img
            src="/brand/everafter-emblem.png"
            alt="Ever After Education Emblem"
            style={{ height: '22px', width: 'auto', objectFit: 'contain' }}
          />
          <span style={{ fontSize: '0.825rem', color: 'var(--text-subtle)' }}>
            Safe Learner Space • Private &amp; Isolated Profile
          </span>
        </div>
      </div>

      {/* Hero Welcome Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #2D1B11 0%, #4D2D1B 55%, #234938 100%)', color: '#ffffff', marginBottom: '2rem', border: '1px solid rgba(184, 125, 75, 0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div className="learner-avatar-box" style={{ width: '64px', height: '64px', fontSize: '2.2rem', background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(184, 125, 75, 0.5)' }}>
            {getAvatarIcon(learner.avatar_code)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 className="font-display" style={{ color: '#ffffff', fontSize: '1.85rem' }}>
                Welcome back, {learner.preferred_name || learner.first_name}!
              </h1>
              <span className="pill-badge" style={{ background: 'var(--color-bronze-metallic)' }}>
                {learner.grade}
              </span>
            </div>
            <p style={{ color: '#E8DFD5', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Ready for today's learning journey? Work at your own pace with line-by-line equations and progressive hints.
            </p>
          </div>
        </div>
      </div>

      {/* Phase 3 High School Math Launch Banner */}
      <div className="card" style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, #FBF9F5 100%)', border: '2px solid var(--color-bronze-metallic)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-100)', color: 'var(--color-primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="verification-badge">Phase 3 Live</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent-700)', textTransform: 'uppercase' }}>
                  CAPS Mathematics Engine
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-900)', marginTop: '0.15rem' }}>
                High School Algebra Modules (Grades 8, 9 &amp; 10)
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Solve equations step-by-step with real-time feedback, worked solutions, and 3 tiers of progressive hints.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {lessonProgressSummary && lessonProgressSummary.totalCompleted > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                  Your Mastery
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-900)' }}>
                  {lessonProgressSummary.masteredCount} Mastered • {lessonProgressSummary.averageScore}% Avg
                </div>
              </div>
            )}
            <button
              id="launch-math-engine-btn"
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}
              onClick={() => setIsLessonPlayerActive(true)}
            >
              <Play size={16} />
              <span>Launch Math Engine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Encouragement / Growth Cards (Individualized - NO public competition) */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--color-accent-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-700)' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
              Personal Growth
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary-900)' }}>
              Self-Paced Mastery
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              No speed rush or comparison
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-700)' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
              Curriculum Scope
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary-900)' }}>
              {enrolledSubjects.length} Active Subjects
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              CAPS Aligned Learning
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--color-success-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-700)' }}>
            <Target size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
              Support Available
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary-900)' }}>
              3-Tier Progressive Hints
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Rules, steps &amp; solutions
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Subjects Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>
          My Enrolled Subjects
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Subjects selected for you by your parent/tutor for {learner.grade}.
        </p>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          Loading your subjects...
        </div>
      ) : enrolledSubjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3 className="empty-state-title">No subjects enrolled yet</h3>
          <p className="empty-state-desc">
            Your parent or tutor hasn't enrolled you in any subjects yet. Ask them to add CAPS Mathematics or other subjects in the Parent Dashboard.
          </p>
          <button className="btn btn-secondary" onClick={onBackToParent}>
            Back to Parent View
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {enrolledSubjects.map(sub => {
            const isSelected = selectedSubject?.id === sub.id;
            const isMath = sub.title.toLowerCase().includes('math');

            return (
              <div
                key={sub.id}
                id={`learner-subject-card-${sub.subject_code}`}
                className="card"
                style={{
                  border: isSelected ? '2px solid var(--color-primary-600)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => setSelectedSubject(sub)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent-700)', letterSpacing: '0.04em' }}>
                      {sub.phase || 'CAPS Subject'}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary-900)', marginTop: '0.15rem' }}>
                      {sub.title}
                    </h3>
                  </div>
                  <span className="verification-badge">DBE Verified</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {sub.description}
                </p>

                <div style={{ background: 'var(--bg-surface-alt)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle)' }}>
                    Reference: {sub.caps_doc_ref || 'Official CAPS DBE syllabus'}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-700)' }}>
                    {isMath ? 'Phase 3 Interactive' : 'Active Subject'}
                  </span>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  {isMath ? (
                    <button
                      id={`practice-math-btn-${sub.subject_code}`}
                      className="btn btn-sm btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLessonPlayerActive(true);
                      }}
                    >
                      <Play size={14} />
                      <span>Start CAPS Math Practice</span>
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubject(sub);
                      }}
                    >
                      <BookOpen size={14} />
                      <span>Curriculum Outline</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
