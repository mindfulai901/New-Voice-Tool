import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!supabase) {
        setError("Database client not initialized.");
        setLoading(false);
        return;
    }

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setMessage('Success! Please check your email for a confirmation link.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        // The onAuthStateChange listener in AuthProvider will handle the redirect.
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => { setIsSignUp(false); setMessage(''); setError(''); }}
          className={`px-4 py-2 w-1/2 font-semibold transition-colors ${!isSignUp ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
        >
          Sign In
        </button>
        <button
          onClick={() => { setIsSignUp(true); setMessage(''); setError(''); }}
          className={`px-4 py-2 w-1/2 font-semibold transition-colors ${isSignUp ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
        >
          Sign Up
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center mb-1 text-white">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
      <p className="text-gray-400 text-center mb-6">{isSignUp ? 'Get started with your free account.' : 'Sign in to continue.'}</p>
      
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-[#0E1117] border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password"className="text-sm font-medium text-gray-300 block mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 bg-[#0E1117] border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full !py-3 flex items-center justify-center" disabled={loading}>
          {loading ? <Spinner /> : (isSignUp ? 'Sign Up' : 'Sign In')}
        </Button>
      </form>
      
      {message && <p className="text-green-400 text-sm mt-4 text-center">{message}</p>}
      {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
    </div>
  );
};
