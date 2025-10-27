import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';

interface UpdatePasswordModalProps {
  onUpdated: () => void;
  onCancel: () => void;
}

export const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ onUpdated, onCancel }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    if (!supabase) {
        setError("Database client not initialized.");
        setLoading(false);
        return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      
      // Sign out to invalidate the recovery session.
      await supabase.auth.signOut();
      
      setMessage('Your password has been updated successfully. Please log in again.');
      
      // Give the user time to read the message before closing the modal.
      setTimeout(() => {
        onUpdated();
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password.');
      setLoading(false); // Only set loading false on error, success will unmount
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <Card className="max-w-md w-full relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors text-2xl"
          aria-label="Close"
          disabled={loading}
        >
          &times;
        </button>
        <div className="w-full p-4">
            <h2 className="text-2xl font-bold text-center mb-1 text-white">Update Your Password</h2>
            <p className="text-gray-400 text-center mb-6">Enter a new password for your account.</p>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                    <label htmlFor="new-password"className="text-sm font-medium text-gray-300 block mb-2">New Password</label>
                    <input
                        id="new-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full p-3 bg-[#0E1117] border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        placeholder="••••••••"
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password"className="text-sm font-medium text-gray-300 block mb-2">Confirm New Password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full p-3 bg-[#0E1117] border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        placeholder="••••••••"
                    />
                </div>
                <Button type="submit" className="w-full !py-3 flex items-center justify-center" disabled={loading}>
                    {loading ? <Spinner /> : 'Update Password'}
                </Button>
            </form>
            
            {message && <p className="text-green-400 text-sm mt-4 text-center">{message}</p>}
            {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        </div>
      </Card>
    </div>
  );
};