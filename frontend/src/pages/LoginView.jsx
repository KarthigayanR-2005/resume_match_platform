import React, { useState } from 'react';
import { Sparkles, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { loginUser, signupUser } from '../services/api';

export default function LoginView({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all details.');
      return;
    }

    setIsLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await loginUser(email, password);
      } else {
        data = await signupUser(email, password);
      }
      onAuthSuccess(data.user, data.access_token);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      {/* Container Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-accent" />
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25 mb-4">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-normal">
            {isLogin 
              ? 'Access tactical resume evaluations and store matching metrics history' 
              : 'Register to unlock persistent analysis matching history and reports'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-medium text-slate-200"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-medium text-slate-200"
              required
            />
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-400 font-medium leading-normal">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-blue-600 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/10 transition-all duration-150 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isLogin ? 'Signing In...' : 'Registering Account...'}
              </>
            ) : (
              isLogin ? 'Sign In to Workspace' : 'Create Secure Account'
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs font-medium text-primary hover:text-blue-400 transition-colors"
          >
            {isLogin 
              ? "Don't have an account? Sign Up" 
              : 'Already have an account? Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
}
