import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertCircle, HelpCircle, Lightbulb, 
  ArrowLeft, ArrowRight, RotateCcw, Sparkles, Award, 
  BookOpen, ChevronRight, Check, Send, ShieldCheck
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export function LessonPlayer({ learner, initialGrade, onBack, token }) {
  const [selectedGrade, setSelectedGrade] = useState(initialGrade || learner?.grade || 'Grade 8');
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Current problem solving state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputs, setInputs] = useState({});
  const [stepStatuses, setStepStatuses] = useState({}); // { 0: 'correct', 1: 'incorrect' }
  const [stepFeedback, setStepFeedback] = useState({});
  const [hintsRevealed, setHintsRevealed] = useState(0); // 0, 1, 2, 3
  const [isCompleted, setIsCompleted] = useState(false);
  const [submittingStep, setSubmittingStep] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [learnerProgress, setLearnerProgress] = useState({});

  // Available high school grades for the lesson engine
  const highSchoolGrades = ['Grade 8', 'Grade 9', 'Grade 10'];

  // Fetch problems when selectedGrade changes
  useEffect(() => {
    fetchProblems(selectedGrade);
    if (learner?.id) {
      fetchProgress(learner.id);
    }
  }, [selectedGrade, learner?.id]);

  const fetchProblems = async (grade) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/lessons?grade=${encodeURIComponent(grade)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load mathematics lessons');
      const data = await res.json();
      setProblems(data.problems || []);
      setCurrentIndex(0);
      resetProblemState();
    } catch (err) {
      console.error('Fetch lessons error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async (learnerId) => {
    try {
      const res = await fetch(`/api/lessons/progress/${learnerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      const map = {};
      (data.records || []).forEach(r => {
        map[r.problem_id] = r;
      });
      setLearnerProgress(map);
    } catch (err) {
      console.warn('Could not load learner progress:', err);
    }
  };

  const resetProblemState = () => {
    setCurrentStepIndex(0);
    setInputs({});
    setStepStatuses({});
    setStepFeedback({});
    setHintsRevealed(0);
    setIsCompleted(false);
    setCompletionData(null);
  };

  const currentProblem = problems[currentIndex] || null;

  // Handle step input change
  const handleInputChange = (stepIdx, value) => {
    setInputs(prev => ({ ...prev, [stepIdx]: value }));
  };

  // Submit and validate current step
  const handleValidateStep = async (e) => {
    if (e) e.preventDefault();
    if (!currentProblem) return;

    const currentStep = currentProblem.steps[currentStepIndex];
    const learnerAnswer = inputs[currentStepIndex] || '';

    if (!learnerAnswer.trim()) return;

    try {
      setSubmittingStep(true);
      const res = await fetch('/api/lessons/validate-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: currentProblem.id,
          stepNumber: currentStep.stepNumber,
          learnerInput: learnerAnswer,
          learnerId: learner?.id
        })
      });

      const data = await res.json();

      if (data.isCorrect) {
        setStepStatuses(prev => ({ ...prev, [currentStepIndex]: 'correct' }));
        setStepFeedback(prev => ({ ...prev, [currentStepIndex]: data.message || 'Correct!' }));

        // Check if there are more steps
        if (currentStepIndex + 1 < currentProblem.steps.length) {
          setCurrentStepIndex(currentStepIndex + 1);
        } else {
          // Problem fully completed!
          setIsCompleted(true);
          handleProblemCompleted();
        }
      } else {
        setStepStatuses(prev => ({ ...prev, [currentStepIndex]: 'incorrect' }));
        setStepFeedback(prev => ({ 
          ...prev, 
          [currentStepIndex]: data.message || 'Check your signs or coefficients and try again.' 
        }));
      }
    } catch (err) {
      console.error('Step validation error:', err);
    } finally {
      setSubmittingStep(false);
    }
  };

  // Final submission of problem completion
  const handleProblemCompleted = async () => {
    if (!learner?.id || !currentProblem) return;

    try {
      const res = await fetch('/api/lessons/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          learner_id: learner.id,
          problem_id: currentProblem.id,
          hints_used: hintsRevealed,
          attempts_count: 1
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCompletionData(data.progress);
        fetchProgress(learner.id);
      }
    } catch (err) {
      console.warn('Could not record lesson completion:', err);
    }
  };

  // Progressive Multi-Tier Hint Revealer
  const handleRequestHint = () => {
    if (hintsRevealed < 3) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  const handleNextProblem = () => {
    if (currentIndex + 1 < problems.length) {
      setCurrentIndex(currentIndex + 1);
      resetProblemState();
    }
  };

  const handlePrevProblem = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetProblemState();
    }
  };

  return (
    <div className="lesson-player-wrap" style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Navigation & Grade Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          id="lesson-back-btn" 
          className="btn btn-secondary btn-sm" 
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Subjects</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface-alt)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.5rem', color: 'var(--text-subtle)' }}>
            CAPS Curriculum Level:
          </span>
          {highSchoolGrades.map(g => (
            <button
              key={g}
              id={`select-grade-${g.replace(/\s+/g, '-').toLowerCase()}`}
              className={`btn btn-sm ${selectedGrade === g ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
              onClick={() => {
                setSelectedGrade(g);
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📐</div>
          <h3>Loading CAPS {selectedGrade} Mathematics Module...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Preparing step-by-step problem sets and multi-tier hints.
          </p>
        </div>
      ) : error ? (
        <div className="notice-box notice-warning">
          <AlertCircle size={20} />
          <div>
            <strong>Unable to load lesson:</strong> {error}
          </div>
        </div>
      ) : problems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3 className="empty-state-title">No problems found for {selectedGrade}</h3>
          <p className="empty-state-desc">Please choose Grade 8, Grade 9, or Grade 10 above.</p>
        </div>
      ) : (
        <div>
          {/* Module Header Card */}
          <div className="card" style={{ background: 'var(--bg-surface)', borderTop: '4px solid var(--color-bronze-metallic)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="pill-badge" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-800)' }}>
                    {currentProblem?.grade}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-accent-700)', textTransform: 'uppercase' }}>
                    {currentProblem?.topic}
                  </span>
                  <span className="verification-badge">DBE CAPS Verified</span>
                </div>
                <h1 className="font-display" style={{ fontSize: '1.5rem', color: 'var(--color-primary-900)', margin: '0.2rem 0' }}>
                  {currentProblem?.title}
                </h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {currentProblem?.subtopic} • {currentProblem?.capsRef}
                </p>
              </div>

              {/* Problem Counter & Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  id="prev-problem-btn"
                  className="btn btn-secondary btn-sm"
                  onClick={handlePrevProblem}
                  disabled={currentIndex === 0}
                  title="Previous Problem"
                >
                  <ArrowLeft size={14} />
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 0.5rem', color: 'var(--color-primary-800)' }}>
                  Problem {currentIndex + 1} of {problems.length}
                </span>
                <button
                  id="next-problem-btn"
                  className="btn btn-secondary btn-sm"
                  onClick={handleNextProblem}
                  disabled={currentIndex === problems.length - 1}
                  title="Next Problem"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Problem Navigation Dots */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              {problems.map((p, idx) => {
                const prog = learnerProgress[p.id];
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={p.id}
                    id={`problem-tab-${idx + 1}`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      resetProblemState();
                    }}
                    style={{
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      border: isCurrent ? '2px solid var(--color-primary-700)' : '1px solid var(--border-subtle)',
                      background: prog?.status === 'mastered' 
                        ? 'var(--color-success-100)' 
                        : prog?.status === 'completed' 
                        ? 'var(--color-primary-50)' 
                        : isCurrent 
                        ? 'var(--bg-surface-alt)' 
                        : '#ffffff',
                      color: prog?.status === 'mastered' 
                        ? 'var(--color-success-800)' 
                        : 'var(--color-primary-900)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>#{idx + 1}</span>
                    {prog?.status === 'mastered' && <Check size={12} color="var(--color-success-700)" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Statement Card */}
          <div className="card" style={{ marginBottom: '1.5rem', border: '1px solid var(--border-subtle)', background: '#FFFFFF' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Problem Statement
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary-900)', marginBottom: '0.75rem' }}>
              {currentProblem?.questionText}
            </div>
            {currentProblem?.latexExpression && (
              <div style={{
                background: 'var(--bg-surface-alt)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: '1.15rem',
                color: 'var(--color-bronze-dark)',
                fontWeight: 700,
                display: 'inline-block',
                borderLeft: '4px solid var(--color-bronze-metallic)'
              }}>
                {currentProblem.latexExpression}
              </div>
            )}
          </div>

          {/* Multi-Step Solving Work Area */}
          <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="var(--color-bronze-dark)" />
                <span>Line-by-Line Solution Progression</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Step {Math.min(currentStepIndex + 1, currentProblem.steps.length)} of {currentProblem.steps.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentProblem.steps.map((step, idx) => {
                const isStepActive = idx === currentStepIndex && !isCompleted;
                const isStepFinished = stepStatuses[idx] === 'correct';
                const hasStepFailed = stepStatuses[idx] === 'incorrect';
                const isStepLocked = idx > currentStepIndex && !isCompleted;

                return (
                  <div
                    key={step.stepNumber}
                    id={`step-card-${step.stepNumber}`}
                    style={{
                      padding: '1.1rem',
                      borderRadius: 'var(--radius-md)',
                      border: isStepFinished 
                        ? '1px solid var(--color-success-300)' 
                        : isStepActive 
                        ? '2px solid var(--color-primary-600)' 
                        : '1px solid var(--border-subtle)',
                      background: isStepFinished 
                        ? '#F6FAF7' 
                        : isStepActive 
                        ? '#FCFBF8' 
                        : '#FAFAFA',
                      opacity: isStepLocked ? 0.6 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isStepFinished ? 'var(--color-success-800)' : 'var(--color-primary-900)' }}>
                        {step.prompt}
                      </div>
                      {isStepFinished ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-success-700)', fontSize: '0.8rem', fontWeight: 700 }}>
                          <CheckCircle2 size={16} />
                          <span>Verified</span>
                        </span>
                      ) : isStepActive ? (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Active Step
                        </span>
                      ) : null}
                    </div>

                    {/* Step Input Area */}
                    {isStepFinished ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace', fontSize: '1rem', color: 'var(--color-success-800)', background: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-success-200)' }}>
                        <Check size={15} color="var(--color-success-600)" />
                        <strong>{inputs[idx]}</strong>
                      </div>
                    ) : isStepActive ? (
                      <form onSubmit={handleValidateStep}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            id={`step-input-${step.stepNumber}`}
                            type="text"
                            className="form-input"
                            style={{ flex: 1, minWidth: '220px', fontFamily: 'monospace', fontSize: '1.05rem', borderColor: hasStepFailed ? 'var(--color-danger-500)' : undefined }}
                            placeholder="Type your algebraic step here (e.g. 6x - 12 = 18)..."
                            value={inputs[idx] || ''}
                            onChange={(e) => handleInputChange(idx, e.target.value)}
                            autoFocus
                            disabled={submittingStep}
                          />
                          <button
                            id={`submit-step-btn-${step.stepNumber}`}
                            type="submit"
                            className="btn btn-primary"
                            disabled={submittingStep || !(inputs[idx] || '').trim()}
                          >
                            <Send size={15} />
                            <span>{submittingStep ? 'Checking...' : 'Check Step'}</span>
                          </button>
                        </div>

                        {/* Step Feedback Message */}
                        {stepFeedback[idx] && (
                          <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: hasStepFailed ? 'var(--color-danger-700)' : 'var(--color-success-700)' }}>
                            {hasStepFailed ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                            <span>{stepFeedback[idx]}</span>
                          </div>
                        )}
                      </form>
                    ) : (
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                        Complete the step above to unlock this row.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Problem Completion Celebration Card */}
          {isCompleted && (
            <div className="card" style={{ background: '#F4F8F5', border: '2px solid var(--color-success-400)', marginBottom: '1.5rem', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-success-100)', color: 'var(--color-success-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Award size={32} />
              </div>
              <h2 className="font-display" style={{ color: 'var(--color-success-800)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Problem Mastered!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.25rem' }}>
                You worked through all steps of <strong>{currentProblem.title}</strong> using correct CAPS algebraic reasoning.
              </p>

              <div style={{ display: 'inline-flex', gap: '1.5rem', background: '#FFFFFF', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success-200)', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Score</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-success-800)' }}>
                    {completionData?.score ?? 100}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Hints Used</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary-800)' }}>
                    {hintsRevealed} / 3
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Mastery Status</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-accent-700)' }}>
                    {completionData?.status === 'mastered' ? 'Mastered ★' : 'Completed'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  id="try-again-btn"
                  className="btn btn-secondary"
                  onClick={resetProblemState}
                >
                  <RotateCcw size={15} />
                  <span>Practice Again</span>
                </button>
                {currentIndex + 1 < problems.length ? (
                  <button
                    id="next-problem-after-complete-btn"
                    className="btn btn-primary"
                    onClick={handleNextProblem}
                  >
                    <span>Next Problem</span>
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    id="finish-module-btn"
                    className="btn btn-accent"
                    onClick={onBack}
                  >
                    <Sparkles size={15} />
                    <span>Module Completed — Back to Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Multi-Tier Hint Progressive System */}
          <div className="card" style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-900)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={18} color="var(--color-accent-700)" />
                  <span>Multi-Tier Guided Hint System</span>
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Work independently first. Reveal hints progressively from broad conceptual rules to a full worked solution if stuck.
                </p>
              </div>

              <button
                id="need-a-hint-btn"
                className={`btn btn-sm ${hintsRevealed >= 3 ? 'btn-ghost' : 'btn-secondary'}`}
                onClick={handleRequestHint}
                disabled={hintsRevealed >= 3}
              >
                <Lightbulb size={15} color="var(--color-bronze-dark)" />
                <span>
                  {hintsRevealed === 0 
                    ? 'Need a Hint? (Tier 1)' 
                    : hintsRevealed === 1 
                    ? 'Deeper Hint (Tier 2)' 
                    : hintsRevealed === 2 
                    ? 'Reveal Worked Solution (Tier 3)' 
                    : 'All 3 Hints Unlocked'}
                </span>
              </button>
            </div>

            {hintsRevealed === 0 ? (
              <div style={{ background: 'var(--bg-surface-alt)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} />
                <span>No hints revealed yet for this problem. Try solving Step {currentStepIndex + 1} first!</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentProblem.hints.slice(0, hintsRevealed).map((hint, idx) => (
                  <div
                    key={hint.tier}
                    id={`hint-tier-${hint.tier}`}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: `4px solid ${
                        hint.tier === 1 ? 'var(--color-accent-500)' : 
                        hint.tier === 2 ? 'var(--color-bronze-metallic)' : 
                        'var(--color-primary-700)'
                      }`,
                      background: 'var(--bg-surface-alt)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary-900)' }}>
                        Tier {hint.tier}: {hint.type}
                      </span>
                      <span className="pill-badge" style={{ fontSize: '0.7rem' }}>
                        Hint Level {hint.tier}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                      {hint.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
