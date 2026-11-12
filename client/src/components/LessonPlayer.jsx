import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertCircle, HelpCircle, Lightbulb, 
  ArrowLeft, ArrowRight, RotateCcw, Sparkles, Award, 
  BookOpen, Check, Trophy, Flame, Star, FileText, Lock
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
  const [stepStatuses, setStepStatuses] = useState({});
  const [stepExplanations, setStepExplanations] = useState({});
  const [hintsRevealed, setHintsRevealed] = useState(0);
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
        setStepStatuses(prev => ({ ...prev, [stepIdx]: 'incorrect' }));
      }
    } catch (err) {
      console.error('Option validation error:', err);
    } finally {
      setSubmittingStep(false);
    }
  };

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
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3.5rem' }}>
      
      {/* Top Bar: Back, Gamification & Grade Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button 
          id="lesson-back-btn" 
          className="btn btn-secondary btn-sm" 
          onClick={onBack}
        >
          <ArrowLeft size={15} />
          <span>Exit Dashboard</span>
        </button>

        {/* Gamification Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#FFFFFF', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D97706', fontWeight: 700, fontSize: '0.85rem' }}>
            <Star size={15} fill="#D97706" />
            <span>{gamification.xp} XP</span>
          </div>
          <span style={{ color: 'var(--border-medium)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#B45309', fontWeight: 700, fontSize: '0.85rem' }}>
            <Flame size={15} fill="#F59E0B" color="#F59E0B" />
            <span>{gamification.current_streak} Day Streak</span>
          </div>
          <span style={{ color: 'var(--border-medium)' }}>•</span>
          <span className="verification-badge" style={{ fontSize: '0.75rem' }}>
            Lvl {gamification.level}: {gamification.title}
          </span>
        </div>

        {/* Grade Segmented Control */}
        <div style={{ display: 'flex', background: 'var(--bg-surface-alt)', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
          {highSchoolGrades.map(g => (
            <button
              key={g}
              id={`select-grade-${g.replace(/\s+/g, '-').toLowerCase()}`}
              className={`btn btn-sm ${selectedGrade === g ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
              onClick={() => setSelectedGrade(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="tabs-bar">
        <button
          className={`tab-btn ${activeMainTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('practice')}
        >
          <BookOpen size={16} />
          <span>Interactive Math Practice</span>
        </button>

        <button
          id="tab-printable-resources"
          className={`tab-btn ${activeMainTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('resources')}
        >
          <FileText size={16} />
          <span>Printable Worksheets &amp; Memos</span>
        </button>

        <button
          id="tab-achievements"
          className={`tab-btn ${activeMainTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('achievements')}
        >
          <Trophy size={16} />
          <span>Milestones &amp; Badges ({gamification.badges.length})</span>
        </button>
      </div>

      {/* VIEW 1: Printable Resources Hub */}
      {activeMainTab === 'resources' && (
        <PrintableResourceHub
          grade={selectedGrade}
          token={token}
          onBack={() => setActiveMainTab('practice')}
        />
      )}

      {/* VIEW 2: Achievements Showcase */}
      {activeMainTab === 'achievements' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
                Mathematical Mastery Milestones
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                Track your progress through South African CAPS high school algebra milestones.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {gamification.xp} XP Earned
              </div>
              <span className="role-tag" style={{ background: '#ECFDF5', color: '#065F46' }}>
                {gamification.title}
              </span>
            </div>
          </div>

          <div className="grid-3">
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
                    padding: '1.5rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isUnlocked ? '2px solid #059669' : '1px solid var(--border-subtle)',
                    background: isUnlocked ? '#F0FDF4' : '#FAFAFA',
                    opacity: isUnlocked ? 1 : 0.65,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ fontSize: '2.5rem' }}>{b.icon}</div>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem', color: isUnlocked ? '#065F46' : 'var(--text-subtle)' }}>
                      {b.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      {b.desc}
                    </p>
                  </div>
                  <div>
                    {isUnlocked ? (
                      <span className="verification-badge" style={{ background: '#D1FAE5', color: '#065F46' }}>
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

      {/* VIEW 3: Interactive Practice Engine */}
      {activeMainTab === 'practice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📐</div>
              <h3>Loading CAPS {selectedGrade} Mathematics Module...</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Preparing step-by-step questions and misconception-driven hints.
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
            <>
              {/* Problem Header Card */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span className="role-tag" style={{ background: '#F1F5F9', color: '#1E293B' }}>
                        {currentProblem?.grade}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>
                        {currentProblem?.topic}
                      </span>
                      <span className="verification-badge">DBE CAPS Verified</span>
                    </div>

                    <h1 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: '0.2rem 0' }}>
                      {currentProblem?.title}
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      {currentProblem?.subtopic} • {currentProblem?.capsRef}
                    </p>
                  </div>

                  {/* Problem Prev/Next Pagination */}
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
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 0.5rem', color: 'var(--text-main)' }}>
                      {currentIndex + 1} of {problems.length}
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

                {/* Problem Dots Navigation */}
                <div style={{ display: 'flex', gap: '0.4rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
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
                          fontWeight: 700,
                          borderRadius: 'var(--radius-sm)',
                          border: isCurrent ? '2px solid #0F172A' : '1px solid var(--border-medium)',
                          background: prog?.status === 'mastered' 
                            ? '#D1FAE5' 
                            : isCurrent 
                            ? '#F8FAFC' 
                            : '#FFFFFF',
                          color: prog?.status === 'mastered' 
                            ? '#065F46' 
                            : 'var(--text-main)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>#{idx + 1}</span>
                        {prog?.status === 'mastered' && <Check size={12} color="#059669" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problem Statement Card */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Problem Question
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>
                  {currentProblem?.questionText}
                </div>
                {currentProblem?.latexExpression && (
                  <div style={{
                    background: '#F8FAFC',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: '1.25rem',
                    color: '#0F172A',
                    fontWeight: 700,
                    display: 'inline-block',
                    border: '1px solid var(--border-medium)',
                    borderLeft: '4px solid #D97706'
                  }}>
                    {currentProblem.latexExpression}
                  </div>
                )}
              </div>

              {/* Step-by-Step Solving Card */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={18} color="#D97706" />
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
                            ? '1px solid #A7F3D0' 
                            : isStepActive 
                            ? '2px solid #0F172A' 
                            : '1px solid var(--border-subtle)',
                          background: isStepFinished 
                            ? '#F0FDF4' 
                            : isStepActive 
                            ? '#FFFFFF' 
                            : '#F8FAFC',
                          opacity: isStepLocked ? 0.5 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isStepFinished ? '#065F46' : 'var(--text-main)' }}>
                            Step {step.stepNumber}: {step.prompt}
                          </div>
                          {isStepFinished ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontSize: '0.8rem', fontWeight: 700 }}>
                              <CheckCircle2 size={16} />
                              <span>Verified Correct</span>
                            </span>
                          ) : isStepActive ? (
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase' }}>
                              Choose Correct Line
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                              <Lock size={12} /> Locked
                            </span>
                          )}
                        </div>

                        {/* Completed Step View */}
                        {isStepFinished ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontFamily: 'var(--font-family-mono)', fontSize: '1.1rem', color: '#065F46', background: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #A7F3D0' }}>
                            <Check size={16} color="#059669" />
                            <strong>{step.options?.find(o => o.id === selectedOptId)?.text || step.expectedAnswer}</strong>
                          </div>
                        ) : isStepActive ? (
                          <div>
                            {/* 4-Option MCQ Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
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
                                      padding: '0.85rem 1rem',
                                      textAlign: 'left',
                                      borderRadius: 'var(--radius-sm)',
                                      border: isWrongSelection 
                                        ? '2px solid #F59E0B' 
                                        : isSelected 
                                        ? '2px solid #0F172A' 
                                        : '1px solid var(--border-medium)',
                                      background: isWrongSelection ? '#FFFBEB' : '#FFFFFF',
                                      cursor: 'pointer',
                                      fontFamily: 'var(--font-family-mono)',
                                      fontSize: '1.05rem',
                                      fontWeight: 600,
                                      color: 'var(--text-main)',
                                      transition: 'all 0.15s ease',
                                      boxShadow: 'var(--shadow-sm)'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', background: 'var(--bg-surface-alt)', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
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
                              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', marginTop: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                                  <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                                  <div>
                                    <strong style={{ color: '#B45309', fontSize: '0.85rem' }}>CAPS Algebraic Trap Diagnostic:</strong>
                                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                                      {stepExplanations[idx]}
                                    </p>
                                    <span style={{ fontSize: '0.75rem', color: '#B45309', display: 'block', marginTop: '0.4rem', fontWeight: 600 }}>
                                      No penalty! Review the explanation and select the correct step above.
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.825rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                            Solve Step {idx} above to unlock this row.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Completion Celebration Card */}
              {isCompleted && (
                <div className="card" style={{ background: '#ECFDF5', border: '2px solid #A7F3D0', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Award size={32} />
                  </div>
                  <h2 style={{ color: '#065F46', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                    Problem Mastered!
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
                    You successfully worked through all algebraic steps for <strong>{currentProblem.title}</strong>!
                  </p>

                  {/* Rewards Breakdown Bar */}
                  <div style={{ display: 'inline-flex', gap: '1.75rem', background: '#FFFFFF', padding: '0.85rem 2rem', borderRadius: 'var(--radius-md)', border: '1px solid #A7F3D0', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>XP Earned</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#D97706' }}>
                        +{completionData?.gamification?.xpEarned || 65} XP
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Score</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669' }}>
                        {completionData?.progress?.score ?? 100}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Hints Used</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                        {hintsRevealed} / 3
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Streak</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#B45309' }}>
                        {gamification.current_streak} Days 🔥
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
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                      <HelpCircle size={18} color="#D97706" />
                      <span>Multi-Tier Guided Hint System</span>
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                      Try to solve independently first. Reveal hints progressively from conceptual rules to a worked step.
                    </p>
                  </div>

                  <button
                    id="need-a-hint-btn"
                    className={`btn btn-sm ${hintsRevealed >= 3 ? 'btn-ghost' : 'btn-secondary'}`}
                    onClick={handleRequestHint}
                    disabled={hintsRevealed >= 3}
                  >
                    <Lightbulb size={15} color="#D97706" />
                    <span>
                      {hintsRevealed === 0 
                        ? 'Need a Hint? (Tier 1)' 
                        : hintsRevealed === 1 
                        ? 'Deeper Hint (Tier 2)' 
                        : hintsRevealed === 2 
                        ? 'Reveal Solution (Tier 3)' 
                        : 'All 3 Hints Unlocked'}
                    </span>
                  </button>
                </div>

                {hintsRevealed === 0 ? (
                  <div style={{ background: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px dashed var(--border-medium)' }}>
                    <span>💡 No hints revealed yet for this problem. Review your choices for Step {currentStepIndex + 1}!</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {currentProblem.hints.slice(0, hintsRevealed).map((hint) => (
                      <div
                        key={hint.tier}
                        id={`hint-tier-${hint.tier}`}
                        style={{
                          padding: '0.9rem 1.15rem',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: `4px solid ${
                            hint.tier === 1 ? '#F59E0B' : 
                            hint.tier === 2 ? '#D97706' : 
                            '#0F172A'
                          }`,
                          background: '#F8FAFC',
                          border: '1px solid var(--border-subtle)',
                          borderLeftWidth: '4px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-main)' }}>
                            Tier {hint.tier}: {hint.type}
                          </span>
                          <span className="role-tag" style={{ fontSize: '0.7rem' }}>
                            Level {hint.tier}
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
