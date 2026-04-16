'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserScores, getUserProfile } from '@/lib/firebase/firestore';
import { Trophy, Gamepad2, Zap, Target, TrendingUp, X } from 'lucide-react';

interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  favoriteGame?: string;
  totalAchievements: number;
  currentStreak: number;
  bestScore: number;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalGamesPlayed: 0,
    totalScore: 0,
    totalAchievements: 0,
    currentStreak: 0,
    bestScore: 0,
  });
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      loadStats();
    }
  }, [user, isOpen]);

  const loadStats = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Load user profile
      const profile = await getUserProfile(user.uid);
      
      // Load user scores
      const userScores = await getUserScores(user.uid);
      
      let bestScore = 0;
      let totalScore = 0;
      
      if (userScores && userScores.length > 0) {
        bestScore = Math.max(...userScores.map(s => s.highScore || 0));
        totalScore = userScores.reduce((sum, s) => sum + (s.highScore || 0), 0);
      }
      
      setScores(userScores || []);
      setStats({
        totalGamesPlayed: profile?.totalGamesPlayed || userScores?.length || 0,
        totalScore,
        totalAchievements: Math.min(userScores?.length || 0, 25), // Max 25 achievements
        currentStreak: Math.floor((userScores?.length || 0) / 3), // Simple streak calculation
        bestScore,
        favoriteGame: userScores?.[0]?.gameTitle,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Dashboard Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-yellow-400 hover:bg-white/10 transition-all"
        title="View achievements & stats"
      >
        <Trophy size={20} className="text-yellow-500" />
        <span className="hidden sm:inline text-sm font-semibold">{stats.totalAchievements}</span>
      </button>

      {/* Dashboard Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              border: '1px solid rgba(118, 75, 162, 0.3)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #764ba2, #f5576c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trophy size={28} color="#fff" />
                </div>
                <div>
                  <h2 style={{ color: '#fff', margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
                    My Achievements
                  </h2>
                  <p style={{ color: '#9ca3af', margin: '4px 0 0 0', fontSize: '14px' }}>
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div
                  style={{
                    display: 'inline-block',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '4px solid #764ba2',
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <p style={{ color: '#9ca3af', marginTop: '16px' }}>Loading stats...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '16px',
                    marginBottom: '28px',
                  }}
                >
                  {[
                    { icon: Gamepad2, label: 'Games Played', value: stats.totalGamesPlayed, color: '#60a5fa' },
                    { icon: Trophy, label: 'Achievements', value: stats.totalAchievements, color: '#fbbf24' },
                    { icon: TrendingUp, label: 'Best Score', value: stats.bestScore.toLocaleString(), color: '#34d399' },
                    { icon: Zap, label: 'Current Streak', value: stats.currentStreak, color: '#f472b6' },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(31, 41, 55, 0.5)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(118, 75, 162, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                        <stat.icon size={28} color={stat.color} />
                      </div>
                      <p style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', margin: '0' }}>
                        {stat.value}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '12px', margin: '4px 0 0 0' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* High Scores List */}
                <div>
                  <h3 style={{ color: '#c084fc', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', margin: 0, marginBottom: '12px' }}>
                    🎮 Recent High Scores
                  </h3>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {scores.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '32px',
                          background: 'rgba(31, 41, 55, 0.3)',
                          borderRadius: '12px',
                        }}
                      >
                        <Gamepad2 size={40} color='#6b7280' style={{ marginBottom: '12px' }} />
                        <p style={{ color: '#9ca3af', margin: 0 }}>No scores yet. Play a game to get started!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {scores.slice(0, 10).map((score, index) => (
                          <div
                            key={score.id || index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              background: 'rgba(31, 41, 55, 0.5)',
                              borderRadius: '10px',
                              border: '1px solid rgba(118, 75, 162, 0.2)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: index === 0 ? '#fbbf24' : index === 1 ? '#d1d5db' : index === 2 ? '#d97706' : '#764ba2',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#1a1a2e',
                                  fontWeight: 'bold',
                                }}
                              >
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                              </div>
                              <div>
                                <p style={{ color: '#d1d5db', margin: 0, fontWeight: '500' }}>{score.gameTitle}</p>
                                <p style={{ color: '#9ca3af', margin: '2px 0 0 0', fontSize: '12px' }}>
                                  {score.playedAt?.toDate ? new Date(score.playedAt.toDate()).toLocaleDateString() : 'Recently'}
                                </p>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p
                                style={{
                                  background: 'linear-gradient(135deg, #764ba2, #f5576c)',
                                  backgroundClip: 'text',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  margin: 0,
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {score.highScore.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Stats */}
                <div
                  style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(118, 75, 162, 0.15)',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ color: '#c084fc', margin: 0, fontSize: '14px' }}>
                    Total Score Earned: <strong style={{ color: '#fff' }}>{stats.totalScore.toLocaleString()}</strong> points
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
