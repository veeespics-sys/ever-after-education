import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertCircle, HelpCircle, Lightbulb, 
  ArrowLeft, ArrowRight, RotateCcw, Sparkles, Award, 
  BookOpen, ChevronRight, Check, Send, ShieldCheck,
  Printer, Download, Trophy, Flame, Star, FileText
} from 'lucide-react';
import { PrintableResourceHub } from './PrintableResourceHub';

export function LessonPlayer({ learner, initialGrade, onBack, token }) {
  const [selectedGrade, setSelectedGrade] = useState(initialGrade || learner?.grade || 'Grade 8');
  const [activeMainTab, setActiveMainTab] = useState('practice'); // 'practice' | 'resources' | 'achievements'
  
  // Lesson data
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Current problem solving state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState({});
  const [stepStatuses, setStepStatuses] = useState({}); // { 0: 'correct', 1: 'incorrect' }
  const [stepExplanations, setStepExplanations] = useState({});
  const [hintsRevealed, setHintsRevealed] = useState(0); // 0, 1, 2, 3
  const [isCompleted, setIsCompleted] = useState(false);
  const [submittingStep, setSubmittingStep] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [learnerProgress, setLearnerProgress] = useState({});

  // Gamification state
  const [gamification, setGamification] = useState({
    xp: 0,
    level: 1,
    title: 'Math Apprentice',
    current_streak: 1,
    best_streak: 1,
    badges: []
  });

  const highSchoolGrades = ['Grade 8', 'Grade 9', 'Grade 10'];

  useEffect(() => {
    fetchProblems(selectedGrade);
    if (learner?.id) {
      fetchProgress(learner.id);
      fetchGamification(learner.id);
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

  const fetchGamification = async (learnerId) => {
    try {
      const res = await fetch(`/api/lessons/gamification/${learnerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.gamification) {
        setGamification(data.gamification);
      }
    } catch (err) {
      console.warn('Could not load gamification state:', err);
    }
  };

  const resetProblemState = () => {
    setCurrentStepIndex(0);
    setSelectedOptionIds({});
    setStepStatuses({});
    setStepExplanations({});
    setHintsRevealed(0);
    setIsCompleted(false);
    setCompletionData(null);
  };

  const currentProblem = problems[currentIndex] || null;

  // Handle MCQ Option Selection (Misconception-Driven)
  const handleSelectOption = async (stepIdx, option) => {
    if (!currentProblem || submittingStep) return;

    setSelectedOptionIds(prev => ({ ...prev, [stepIdx]: option.id }));
    setStepExplanations(prev => ({ ...prev, [stepIdx]: option.explanation }));

    try {
      setSubmittingStep(true);
      const currentStep = currentProblem.steps[stepIdx];

      const res = await fetch('/api/lessons/validate-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: currentProblem.id,
          stepNumber: currentStep.stepNumber,
          optionId: option.id,
          learnerInput: option.text,
          learnerId: learner?.id
        })
      });

      const data = await res.json();

      if (data.isCorrect) {
        setStepStatuses(prev => ({ ...prev, [stepIdx]: 'correct' }));

        if (stepIdx + 1 < currentProblem.steps.length) {
          setCurrentStepIndex(stepIdx + 1);
        } else {
          setIsCompleted(true);
          handleProblemCompleted();
        }
      } else {
        // Non-punitive: show immediate misconception explanation without wiping prior steps
        setStepStatuses(prev => ({ ...prev, [stepIdx]: 'incorrect' }));
      }
    } catch (err) {
      console.error('Option validation error:', err);
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
        setCompletionData(data);
        if (data.gamification) {
          setGamification(prev => ({
            ...prev,
            xp: data.gamification.totalXp,
            level: data.gamification.level,
            title: data.gamification.title,
            current_streak: data.gamification.current_streak,
            badges: data.gamification.badges || prev.badges
          }));
        }
        fetchProgress(learner.id);
      }
    } catch (err) {
      console.warn('Could not record lesson completion:', err);
    }
  };

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
    <div className="lesson-player-wrap" style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Banner: Navigation, Grade Selector & Gamification Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          id="lesson-back-btn" 
          className="btn btn-secondary btn-sm" 
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Exit to Dashboard</span>
        </button>

        {/* Gamification Tracker Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#FFFFFF', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-bronze-dark)', fontWeight: 700, fontSize: '0.85rem' }}>
            <Star size={16} color="var(--color-bronze-metallic)" fill="var(--color-bronze-metallic)" />
            <span>{gamification.xp} XP</span>
          </div>
          <span style={{ color: 'var(--border-subtle)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#B45309', fontWeight: 700, fontSize: '0.85rem' }}>
            <Flame size={16} color="#F59E0B" fill="#F59E0B" />
            <span>{gamification.current_streak} Day Streak</span>
          </div>
          <span style={{ color: 'var(--border-subtle)' }}>•</span>
          <span className="pill-badge" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-900)', fontSize: '0.75rem' }}>
            Lvl {gamification.level}: {gamification.title}
          </span>
        </div>

        {/* Grade Selector Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-surface-alt)', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
          {highSchoolGrades.map(g => (
            <button
              key={g}
              id={`select-grade-${g.replace(/\s+/g, '-').toLowerCase()}`}
              className={`btn btn-sm ${selectedGrade === g ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
              onClick={() => setSelectedGrade(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tabs Navigation: Practice vs Resources vs Achievements */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          className={`btn btn-sm ${activeMainTab === 'practice' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveMainTab('practice')}
        >
          <BookOpen size={15} />
          <span>Interactive Math Practice</span>
        </button>

        <button
          id="tab-printable-resources"
          className={`btn btn-sm ${activeMainTab === 'resources' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveMainTab('resources')}
        >
          <FileText size={15} />
          <span>Worksheets, Memos &amp; Formulas</span>
        </button>

        <button
          id="tab-achievements"
          className={`btn btn-sm ${activeMainTab === 'achievements' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveMainTab('achievements')}
        >
          <Trophy size={15} />
          <span>Milestones &amp; Badges ({gamification.badges.length})</span>
        </button>
      </div>

      {/* View 1: Printable Resources Hub */}
      {activeMainTab === 'resources' && (
        <PrintableResourceHub
          grade={selectedGrade}
          token={token}
          onBack={() => setActiveMainTab('practice')}
        />
      )}

      {/* View 2: Achievements Trophy Case */}
      {activeMainTab === 'achievements' && (
        <div className="card" style={{ background: '#FFFFFF', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <div>
              <h2 className="font-display" style={{ color: 'var(--color-primary-900)', margin: 0, fontSize: '1.4rem' }}>
                Your Math Journey Milestones
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                Celebrate every step of your learning. Home education is about steady mastery, not high-pressure speed.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-800)' }}>
                {gamification.xp} XP Earned
              </div>
              <span className="pill-badge" style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-800)' }}>
                {gamification.title}
              </span>
            </div>
          </div>

          <div className="grid-3" style={{ gap: '1rem' }}>
            {[
              { id: 'badge_first_step', title: 'First Equation Solved', icon: '🌟', desc: 'Completed your first high school algebra exercise.' },
              { id: 'badge_term_tamer', title: 'Term Tamer', icon: '🛡️', desc: 'Mastered Grade 8 distributive expanding and linear isolating.' },
              { id: 'badge_exponent_explorer', title: 'Exponent Explorer', icon: '⚡', desc: 'Mastered Grade 9 exponent laws and factorisation.' },
              { id: 'badge_parabola_pioneer', title: 'Parabola Pioneer', icon: '📈', desc: 'Mastered Grade 10 quadratic functions and roots.' },
              { id: 'badge_hint_free', title: 'Hint-Free Master', icon: '🧠', desc: 'Solved a multi-step problem with 0 hints used.' },
              { id: 'badge_dedicated', title: 'Dedicated Learner', icon: '🔥', desc: 'Maintained a 3+ active practice streak.' }
            ].map(b => {
              const isUnlocked = gamification.badges.some(ub => ub.id === b.id);
              return (
                <div
                  key={b.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isUnlocked ? '2px solid var(--color-bronze-metallic)' : '1px solid var(--border-subtle)',
                    background: isUnlocked ? '#FFFDF9' : '#FAFAFA',
                    opacity: isUnlocked ? 1 : 0.6,
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {b.icon}
                  </div>
                  <h4 style={{ margin: '0 0 0.25rem', color: isUnlocked ? 'var(--color-primary-900)' : 'var(--text-subtle)' }}>
                    {b.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    {b.desc}
                  </p>
                  <div style={{ marginTop: '0.75rem' }}>
                    {isUnlocked ? (
                      <span className="verification-badge" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                        Unlocked ★
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 3: Interactive Practice Engine (Misconception-Driven MCQ) */}
      {activeMainTab === 'practice' && (
        <div>
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📐</div>
              <h3>Loading CAPS {selectedGrade} Mathematics Module...</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Preparing misconception-driven steps and multi-tier hints.
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
                          padding: '0.35rem 0.75rem',
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

              {/* Multi-Step Solving Work Area (4-Option MCQ per step) */}
              <div className="card" style={{ marginBottom: '1.5rem', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={18} color="var(--color-bronze-dark)" />
                    <span>Line-by-Line Solution Steps</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Step {Math.min(currentStepIndex + 1, currentProblem.steps.length)} of {currentProblem.steps.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {currentProblem.steps.map((step, idx) => {
                    const isStepActive = idx === currentStepIndex && !isCompleted;
                    const isStepFinished = stepStatuses[idx] === 'correct';
                    const hasStepFailed = stepStatuses[idx] === 'incorrect';
                    const isStepLocked = idx > currentStepIndex && !isCompleted;
                    const selectedOptId = selectedOptionIds[idx];

                    return (
                      <div
                        key={step.stepNumber}
                        id={`step-card-${step.stepNumber}`}
                        style={{
                          padding: '1.25rem',
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
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isStepFinished ? 'var(--color-success-800)' : 'var(--color-primary-900)' }}>
                            {step.prompt}
                          </div>
                          {isStepFinished ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-success-700)', fontSize: '0.8rem', fontWeight: 700 }}>
                              <CheckCircle2 size={16} />
                              <span>Verified Correct</span>
                            </span>
                          ) : isStepActive ? (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent-700)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Choose Next Line
                            </span>
                          ) : null}
                        </div>

                        {/* Completed Step Display */}
                        {isStepFinished ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace', fontSize: '1.05rem', color: 'var(--color-success-800)', background: '#FFFFFF', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-success-200)' }}>
                            <Check size={16} color="var(--color-success-600)" />
                            <strong>{step.options?.find(o => o.id === selectedOptId)?.text || step.expectedAnswer}</strong>
                          </div>
                        ) : isStepActive ? (
                          <div>
                            {/* 4-Option MCQ Selector Area */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', marginBottom: '0.75rem' }}>
                              {step.options?.map(opt => {
                                const isSelected = selectedOptId === opt.id;
                                const isWrongSelection = isSelected && hasStepFailed;
                                return (
                                  <button
                                    key={opt.id}
                                    id={`mcq-${opt.id}`}
                                    type="button"
                                    onClick={() => handleSelectOption(idx, opt)}
                                    disabled={submittingStep}
                                    style={{
                                      padding: '0.75rem 1rem',
                                      textAlign: 'left',
                                      borderRadius: 'var(--radius-sm)',
                                      border: isWrongSelection 
                                        ? '2px solid #F59E0B' 
                                        : isSelected 
                                        ? '2px solid var(--color-primary-700)' 
                                        : '1px solid #D6D3D1',
                                      background: isWrongSelection ? '#FFFDF5' : '#FFFFFF',
                                      cursor: 'pointer',
                                      fontFamily: 'monospace',
                                      fontSize: '1rem',
                                      fontWeight: 600,
                                      color: 'var(--color-primary-900)',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', background: 'var(--bg-surface-alt)', padding: '2px 6px', borderRadius: '4px' }}>
                                        {opt.id.slice(-1).toUpperCase()}
                                      </span>
                                      <span>{opt.text}</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Misconception Diagnostic Feedback Card */}
                            {hasStepFailed && stepExplanations[idx] && (
                              <div style={{ background: '#FFFDF5', border: '1px solid #F59E0B', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                  <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                                  <div>
                                    <strong style={{ color: '#B45309', fontSize: '0.85rem' }}>CAPS Algebraic Trap Explained:</strong>
                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                                      {stepExplanations[idx]}
                                    </p>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginTop: '0.35rem' }}>
                                      Tip: No penalty! Review the explanation and choose the correct step above.
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
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

              {/* Problem Completion Celebration Card with Gamification Micro-Interactions */}
              {isCompleted && (
                <div className="card" style={{ background: '#F4F8F5', border: '2px solid var(--color-success-400)', marginBottom: '1.5rem', textAlign: 'center', padding: '2rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-success-100)', color: 'var(--color-success-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Award size={32} />
                  </div>
                  <h2 className="font-display" style={{ color: 'var(--color-success-800)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    Problem Mastered!
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
                    You successfully worked through all algebraic steps for <strong>{currentProblem.title}</strong>!
                  </p>

                  {/* Rewards Breakdown Bar */}
                  <div style={{ display: 'inline-flex', gap: '1.5rem', background: '#FFFFFF', padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success-200)', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>XP Earned</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-bronze-dark)' }}>
                        +{completionData?.gamification?.xpEarned || 65} XP
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Score</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-success-800)' }}>
                        {completionData?.progress?.score ?? 100}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Hints Used</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary-800)' }}>
                        {hintsRevealed} / 3
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Streak</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#B45309' }}>
                        {gamification.current_streak} Days 🔥
                      </div>
                    </div>
                  </div>

                  {/* Unlocked Badges Banner */}
                  {completionData?.gamification?.newBadges && completionData.gamification.newBadges.length > 0 && (
                    <div style={{ background: '#FFFDF9', border: '1px solid var(--color-bronze-metallic)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                      <strong style={{ color: 'var(--color-bronze-dark)', fontSize: '0.85rem' }}>🎉 New Milestone Badge Unlocked!</strong>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{completionData.gamification.newBadges[0].icon}</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary-900)' }}>{completionData.gamification.newBadges[0].title}</span>
                      </div>
                    </div>
                  )}

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
                        onClick={() => setActiveMainTab('resources')}
                      >
                        <Sparkles size={15} />
                        <span>View Worksheets &amp; Memos</span>
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
                    <span>No hints revealed yet for this problem. Review the choices for Step {currentStepIndex + 1}!</span>
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
      )}
    </div>
  );
}
