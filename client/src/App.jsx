import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ParentDashboard } from './components/ParentDashboard';
import { LearnerDashboard } from './components/LearnerDashboard';
import { LearnerModal } from './components/LearnerModal';
import { SubjectEnrolmentModal } from './components/SubjectEnrolmentModal';
import { AuthModal } from './components/AuthModal';
import { InvitationModal } from './components/InvitationModal';
import { LearnerInviteAccept } from './components/LearnerInviteAccept';
import { APP_CONFIG } from './config/appConfig';
import { Shield, BookOpen, Heart, Info } from 'lucide-react';

function AppContent() {
  const { user, family, token, activeLearner, setActiveLearner, refreshProfile } = useAuth();

  const [isLearnerMode, setIsLearnerMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLearnerModalOpen, setIsLearnerModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitingLearner, setInvitingLearner] = useState(null);
  const [editingLearner, setEditingLearner] = useState(null);
  const [managingSubjectLearner, setManagingSubjectLearner] = useState(null);
  const [learnersList, setLearnersList] = useState([]);

  // Check if browser loaded with an invitation URL path (e.g. /invite/:token)
  const [inviteToken, setInviteToken] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/invite/')) {
        return path.replace('/invite/', '').trim();
      }
    }
    return null;
  });

  // If user role is learner, force learner mode
  React.useEffect(() => {
    if (user?.role === 'learner') {
      setIsLearnerMode(true);
    }
  }, [user]);

  // Fetch learners list for navigation dropdown
  React.useEffect(() => {
    if (!token) {
      setLearnersList([]);
      return;
    }
    fetch('/api/learners', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLearnersList(data.learners || []);
        if (data.learners && data.learners.length > 0 && !activeLearner) {
          setActiveLearner(data.learners[0]);
        }
      })
      .catch(err => console.error('Failed to load learners for nav:', err));
  }, [token, activeLearner]);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenAddLearner = () => {
    setEditingLearner(null);
    setIsLearnerModalOpen(true);
  };

  const handleOpenEditLearner = (learner) => {
    setEditingLearner(learner);
    setIsLearnerModalOpen(true);
  };

  const handleOpenInviteLearner = (learner) => {
    setInvitingLearner(learner);
    setIsInviteModalOpen(true);
  };

  const handleOpenManageSubjects = (learner) => {
    setManagingSubjectLearner(learner);
  };

  const handleSwitchToLearnerView = (learner) => {
    setActiveLearner(learner);
    setIsLearnerMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLearnerSaved = (savedLearner) => {
    refreshProfile();
    setRefreshKey(k => k + 1);
    // Update local learners list
    setLearnersList(prev => {
      const idx = prev.findIndex(l => l.id === savedLearner.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedLearner;
        return next;
      }
      return [...prev, savedLearner];
    });
    if (activeLearner && activeLearner.id === savedLearner.id) {
      setActiveLearner(savedLearner);
    }
  };

  const handleEnrolmentUpdated = () => {
    refreshProfile();
    setRefreshKey(k => k + 1);
    // trigger state update
    if (activeLearner) {
      setActiveLearner({ ...activeLearner });
    }
  };

  return (
    <div className="app-container">
      <Navbar
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isLearnerMode={isLearnerMode}
        onToggleMode={(mode) => setIsLearnerMode(mode)}
        learners={learnersList}
      />

      <main className="main-content">
        {inviteToken ? (
          <LearnerInviteAccept
            token={inviteToken}
            onAcceptSuccess={(data) => {
              window.history.pushState({}, '', '/');
              setInviteToken(null);
              refreshProfile();
              if (data.learner) setActiveLearner(data.learner);
              setIsLearnerMode(true);
            }}
            onGoToLogin={() => {
              window.history.pushState({}, '', '/');
              setInviteToken(null);
              setIsAuthModalOpen(true);
            }}
          />
        ) : isLearnerMode ? (
          <LearnerDashboard
            learner={activeLearner || learnersList[0]}
            onBackToParent={() => setIsLearnerMode(false)}
          />
        ) : (
          <ParentDashboard
            onAddLearner={handleOpenAddLearner}
            onEditLearner={handleOpenEditLearner}
            onInviteLearner={handleOpenInviteLearner}
            onManageSubjects={handleOpenManageSubjects}
            onSwitchToLearnerView={handleSwitchToLearnerView}
            refreshKey={refreshKey}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid var(--border-subtle)', padding: '2rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <img
                src="/brand/everafter-emblem.png"
                alt="Ever After Education"
                style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
              />
              <span className="brand-font-serif" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-bronze-dark)' }}>
                {APP_CONFIG.brandName}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                — {APP_CONFIG.descriptor}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Published by <strong style={{ color: 'var(--color-bronze-dark)' }}>{APP_CONFIG.publisherBrand}</strong> • Built for South African homeschool families • {APP_CONFIG.stageName}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={14} color="var(--color-forest-800)" />
              POPIA Data Minimisation
            </span>
            <span>•</span>
            <span>Zero Commercial Advertising</span>
            <span>•</span>
            <span>DBE CAPS Verified</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LearnerModal
        isOpen={isLearnerModalOpen}
        onClose={() => setIsLearnerModalOpen(false)}
        initialLearner={editingLearner}
        token={token}
        onSaved={handleLearnerSaved}
      />

      <SubjectEnrolmentModal
        isOpen={Boolean(managingSubjectLearner)}
        onClose={() => setManagingSubjectLearner(null)}
        learner={managingSubjectLearner}
        token={token}
        onEnrolmentUpdated={handleEnrolmentUpdated}
      />

      <InvitationModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        learners={learnersList}
        initialLearner={invitingLearner}
        token={token}
        onInvitationChanged={() => setRefreshKey(k => k + 1)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLearnerLoginSuccess={(learner) => {
          refreshProfile();
          if (learner) setActiveLearner(learner);
          setIsLearnerMode(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
