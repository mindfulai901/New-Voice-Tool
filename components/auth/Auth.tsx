import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';

type AuthView = 'signIn' | 'signUp' | 'forgotPassword';

export const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      if (view === 'signUp') {
        const { data, error: signUpError } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                }
            }
        });
        if (signUpError) throw signUpError;
        
        // If the user object is returned and the email is already confirmed,
        // it signifies that the account already exists.
        if (data.user && data.user.email_confirmed_at) {
            setError('An account with this email already exists. Please log in instead.');
        } else {
            setMessage('Success! Please check your email for a confirmation link.');
        }

      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        // The onAuthStateChange listener in AuthProvider will handle the successful login.
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
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
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (resetError) throw resetError;
        setMessage('Password reset link sent! Please check your email.');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send reset link.');
    } finally {
        setLoading(false);
    }
  };

  if (view === 'forgotPassword') {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-center mb-1 text-gray-900 dark:text-white">Reset Password</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Enter your email to receive a reset link.</p>
            <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 bg-gray-50 dark:bg-[#0E1117] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none" placeholder="you@example.com" />
                </div>
                <Button type="submit" className="w-full !py-3 flex items-center justify-center" disabled={loading}>
                    {loading ? <Spinner /> : 'Send Reset Link'}
                </Button>
            </form>
            <div className="text-center mt-4">
                <button onClick={() => { setView('signIn'); setMessage(''); setError(''); }} className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
                    Back to Sign In
                </button>
            </div>
            {message && <p className="text-green-500 text-sm mt-4 text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => { setView('signIn'); setMessage(''); setError(''); setFirstName(''); setLastName(''); }}
          className={`px-4 py-2 w-1/2 font-semibold transition-colors ${view === 'signIn' ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Sign In
        </button>
        <button
          onClick={() => { setView('signUp'); setMessage(''); setError(''); }}
          className={`px-4 py-2 w-1/2 font-semibold transition-colors ${view === 'signUp' ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Sign Up
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center mb-1 text-gray-900 dark:text-white">{view === 'signUp' ? 'Create an Account' : 'Welcome Back'}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{view === 'signUp' ? 'Get started with your free account.' : 'Sign in to continue.'}</p>
      
      <form onSubmit={handleAuth} className="space-y-4">
        {view === 'signUp' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-3 bg-gray-50 dark:bg-[#0E1117] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="Jane"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-3 bg-gray-50 dark:bg-[#0E1117] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="Doe"
              />
            </div>
          </div>
        )}
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-gray-50 dark:bg-[#0E1117] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password"className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 bg-gray-50 dark:bg-[#0E1117] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        {view === 'signIn' && (
            <div className="text-right">
                <button type="button" onClick={() => setView('forgotPassword')} className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
                    Forgot your password?
                </button>
            </div>
        )}
        <Button type="submit" className="w-full !py-3 flex items-center justify-center" disabled={loading}>
          {loading ? <Spinner /> : (view === 'signUp' ? 'Sign Up' : 'Sign In')}
        </Button>
      </form>
      
      {message && <p className="text-green-500 text-sm mt-4 text-center">{message}</p>}
      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
    </div>
  );
};