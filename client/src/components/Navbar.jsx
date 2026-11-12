import React from 'react';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import { BrandLogo } from './BrandLogo';
import { Shield, BookOpen, User, LogOut, Users, Key, GraduationCap } from 'lucide-react';

export function Navbar({ onOpenAuthModal, isLearnerMode, onToggleMode, learners = [] }) {
  const { user, family, activeLearner, setActiveLearner, logout, switchDemoFamily } = useAuth();

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Pilot Demo / Testing Bar */}
      {user?.role === 'learner' ? (
        <div className="demo-banner" style={{ background: '#064E3B' }}>
          <div className="demo-banner-group">
            <span className="demo-badge" style={{ background: '#059669' }}>LEARNER ACTIVE</span>
            <span style={{ fontSize: '0.85rem' }}>Active Profile: <strong>{user.display_name}</strong></span>
          </div>
          <div className="demo-banner-group">
            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              Family: <strong>{family ? family.name : 'Enrolled Family'}</strong>
            </span>
          </div>
        </div>
      ) : (
        <div className="demo-banner">
          <div className="demo-banner-group">
            <span className="demo-badge">PILOT TEST HELPER</span>
            <span style={{ opacity: 0.85, fontSize: '0.775rem' }}>Switch Family Workspace:</span>
            {APP_CONFIG.demoAccounts.map(acc => (
              <button
                key={acc.key}
                id={`switch-family-${acc.key}`}
                className={`demo-btn ${family?.name === acc.familyName ? 'active' : ''}`}
                onClick={() => switchDemoFamily(acc.key)}
                title={`Switch to ${acc.familyName} (${acc.learnersSummary})`}
              >
                <Users size={12} />
                <span>{acc.familyName}</span>
              </button>
            ))}
          </div>

          <div className="demo-banner-group">
            <span style={{ fontSize: '0.775rem', opacity: 0.85 }}>
              Active: <strong style={{ color: '#FCD34D' }}>{family ? family.name : 'Not Signed In'}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="#"
              className="brand-link"
              onClick={(e) => { e.preventDefault(); if (user?.role !== 'learner') onToggleMode(false); }}
              title={`${APP_CONFIG.brandName} - Return to Overview`}
            >
              <BrandLogo variant="full" size="md" />
              <span className="brand-badge">
                DBE CAPS Verified
              </span>
            </a>
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                {/* View Switcher: Parent vs Learner */}
                {user.role !== 'learner' && (
                  <div style={{ display: 'flex', background: 'var(--bg-surface-alt)', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
                    <button
                      id="nav-parent-mode-btn"
                      className={`btn btn-sm ${!isLearnerMode ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => onToggleMode(false)}
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                    >
                      <Shield size={14} />
                      <span>Parent / Tutor</span>
                    </button>

                    <button
                      id="nav-learner-mode-btn"
                      className={`btn btn-sm ${isLearnerMode ? 'btn-accent' : 'btn-ghost'}`}
                      onClick={() => {
                        if (learners.length > 0 && !activeLearner) {
                          setActiveLearner(learners[0]);
                        }
                        onToggleMode(true);
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                      disabled={learners.length === 0}
                      title={learners.length === 0 ? 'Add a learner first' : 'Switch to Learner View'}
                    >
                      <GraduationCap size={14} />
                      <span>Learner View</span>
                    </button>
                  </div>
                )}

                {/* If multiple learners in learner mode, selector */}
                {isLearnerMode && learners.length > 1 && (
                  <select
                    id="nav-learner-select"
                    className="form-select"
                    style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.825rem' }}
                    value={activeLearner?.id || ''}
                    onChange={(e) => {
                      const selected = learners.find(l => l.id === e.target.value);
                      if (selected) setActiveLearner(selected);
                    }}
                  >
                    {learners.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.first_name} ({l.grade})
                      </option>
                    ))}
                  </select>
                )}

                {/* User Info Pill */}
                <div className="user-pill">
                  <User size={13} color="var(--color-primary-600)" />
                  <span style={{ fontWeight: 600 }}>{user.display_name}</span>
                  <span className={`role-tag ${isLearnerMode ? 'learner' : ''}`}>
                    {isLearnerMode ? 'Learner' : user.role}
                  </span>
                </div>

                {/* Sign Out */}
                <button
                  id="nav-logout-btn"
                  className="btn btn-ghost btn-sm"
                  onClick={logout}
                  title="Sign out of platform"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                id="nav-signin-btn"
                className="btn btn-primary btn-sm"
                onClick={onOpenAuthModal}
              >
                <Key size={14} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
