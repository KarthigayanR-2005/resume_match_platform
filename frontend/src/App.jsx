import React, { useState, useEffect } from 'react';
import { Sparkles, LogIn, LogOut, FileText, User, Loader2, RefreshCw } from 'lucide-react';
import LoginView from './pages/LoginView';
import InputFormView from './pages/InputFormView';
import ResultsDashboard from './pages/ResultsDashboard';
import { 
  getMe, 
  logoutUser, 
  analyzeResume, 
  getHistory, 
  getHistoryDetail, 
  deleteHistoryItem 
} from './services/api';

export default function App() {
  // --- USER AUTHENTICATION STATE ---
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // --- HISTORY STATE ---
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // --- OPERATION FLOW STATE ---
  const [view, setView] = useState('form'); // 'form', 'results', 'login'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // --- INITIAL CHECK FOR AUTH TOKEN ---
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const profile = await getMe();
          setUser(profile);
          // Load history for authenticated user
          await fetchUserHistory();
        } catch (err) {
          console.error('Session restore failed:', err.message);
        }
      }
      setIsInitializing(false);
    };

    checkAuth();
  }, []);

  // --- HELPERS ---

  const fetchUserHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const historyList = await getHistory();
      setHistory(historyList);
    } catch (err) {
      console.error('Failed to load history:', err.message);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleAuthSuccess = async (authenticatedUser, token) => {
    setUser(authenticatedUser);
    setView('form');
    setIsLoading(true);
    try {
      const historyList = await getHistory();
      setHistory(historyList);
    } catch (err) {
      console.error('Failed to load history on login:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setHistory([]);
    setView('form');
    setAnalysisResult(null);
  };

  const handleFormSubmit = async ({ file, targetCompany, jobDescription }) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const resultData = await analyzeResume(file, jobDescription, targetCompany);
      setAnalysisResult(resultData);
      setView('results');
      
      // Reload history if user is authenticated
      if (user) {
        await fetchUserHistory();
      }
    } catch (err) {
      setError(err.message || 'An unexpected failure occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = async (analysisId) => {
    setIsLoading(true);
    setError(null);
    try {
      const detail = await getHistoryDetail(analysisId);
      setAnalysisResult(detail);
      setView('results');
    } catch (err) {
      setError(err.message || 'Failed to retrieve history item detail.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryDelete = async (analysisId) => {
    try {
      await deleteHistoryItem(analysisId);
      setHistory(prev => prev.filter(item => item.id !== analysisId));
      
      // If we are viewing the deleted analysis, reset to form view
      if (analysisResult && analysisResult.id === analysisId) {
        setAnalysisResult(null);
        setView('form');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete history item.');
    }
  };

  // --- RENDERING ---

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background text-slate-100 flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading Secure Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-100 selection:bg-primary/30 selection:text-white pb-16 relative">
      
      {/* GLOWING AMBIENT BACKGROUND BLURS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* CORE NAVBAR LAYER */}
      <nav className="border-b border-border/60 bg-surface/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => {
              setAnalysisResult(null);
              setView('form');
              setError(null);
            }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-md shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text">
                Tactical AI Resume Platform
              </span>
              <span className="text-[10px] font-mono font-bold text-primary block tracking-wider uppercase -mt-0.5">Gemini Engine V1.0.0</span>
            </div>
          </div>

          {/* User Section / Navigation Actions */}
          <div className="flex items-center gap-4">
            
            {user ? (
              // Authenticated Actions
              <div className="flex items-center gap-4">
                {view !== 'form' && (
                  <button
                    onClick={() => {
                      setView('form');
                      setAnalysisResult(null);
                      setError(null);
                    }}
                    className="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
                  >
                    New Evaluation
                  </button>
                )}

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-slate-300 max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 py-2 px-3 rounded-lg hover:bg-rose-500/10 transition-all"
                  title="Sign out of platform"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              // Guest Actions
              <div className="flex items-center gap-3">
                {view === 'login' ? (
                  <button
                    onClick={() => setView('form')}
                    className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-slate-900 border border-slate-800"
                  >
                    Back to Guest Matcher
                  </button>
                ) : (
                  <button
                    onClick={() => setView('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-4.5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 shadow-md shadow-primary/10 transition-all"
                  >
                    <LogIn className="w-4 h-4" /> Sign In / Create Account
                  </button>
                )}
              </div>
            )}

          </div>

        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Banner Motto Header (only shown in form and login view) */}
        {view !== 'results' && (
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Optimize for Technical Engineering Placement
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Upload your PDF resume profile and map it against target corporate structures. Our engine leverages Gemini parsed models to identify stack gaps, rewrite work achievements, and generate tailored interview blueprints.
            </p>
          </div>
        )}

        {/* LOADING SCREEN OVERLAY (Global matching execution state) */}
        {isLoading && (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-sm shadow-xl max-w-lg mx-auto">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-base font-bold text-slate-200">Processing Document Streams...</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-normal">
              Reading raw PDF content, executing structural diagnostics, and generating structured blueprints via Gemini. This will take a few seconds.
            </p>
          </div>
        )}

        {/* VIEW CONDITIONAL ROUTER */}
        {!isLoading && (
          <>
            {view === 'login' && (
              <LoginView onAuthSuccess={handleAuthSuccess} />
            )}

            {view === 'form' && (
              <InputFormView 
                user={user}
                history={history}
                onHistorySelect={handleHistorySelect}
                onHistoryDelete={handleHistoryDelete}
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                error={error}
              />
            )}

            {view === 'results' && (
              <ResultsDashboard 
                data={analysisResult} 
                onBack={() => {
                  setView('form');
                  setAnalysisResult(null);
                  setError(null);
                }} 
              />
            )}
          </>
        )}

      </main>

    </div>
  );
}