
import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';

interface AdvancedSettingsModalProps {
  onClose: () => void;
}

export const AdvancedSettingsModal: React.FC<AdvancedSettingsModalProps> = ({ onClose }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      
      setMessage('Password updated successfully. You will be signed out shortly.');
      
      // Stop loading spinner to show message, then sign out.
      setLoading(false);
      setShowPasswordForm(false);
      setPassword('');
      setConfirmPassword('');

      setTimeout(async () => {
        await supabase.auth.signOut();
        // The onAuthStateChange listener will handle the UI update to the landing page.
        // No need to call onClose explicitly.
      }, 2500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password.');
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError('');
    
    if (!supabase) {
        setError("Database client not initialized.");
        setDeleteLoading(false);
        return;
    }

    try {
        const { error: rpcError } = await supabase.rpc('delete_user_account');
        if (rpcError) throw rpcError;
        
        // Explicitly sign out to ensure the AuthProvider detects the change
        // and redirects the user to the landing page.
        await supabase.auth.signOut();

    } catch (err) {
        let friendlyError = 'An unknown error occurred while deleting the account.';
        if (err instanceof Error) {
            if (err.message.includes('function public.delete_user_account() does not exist')) {
                friendlyError = 'Account deletion is not configured on the backend. The required database function is missing.';
            } else {
                friendlyError = `Failed to delete account: ${err.message}`;
            }
        }
        setError(friendlyError);
        setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      {/* Fix: Wrapped Card in a div with stopPropagation to prevent type error on Card's onClick prop. */}
      <div onClick={(e) => e.stopPropagation()}>
        <Card className="max-w-lg w-full relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-2xl"
            aria-label="Close"
            disabled={loading || deleteLoading}
          >
            &times;
          </button>
          <div className="w-full p-4">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Advanced Settings</h2>

              {/* Change Password Section */}
              <section className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Change Password</h3>
                  {showPasswordForm ? (
                    <form onSubmit={handleUpdatePassword} className="space-y-4 animate-fade-in">
                        <div>
                            <label htmlFor="new-password-adv"className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">New Password</label>
                            <input
                                id="new-password-adv" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                required minLength={6}
                                className="w-full p-3 bg-gray-50 dark:bg-[#0E1117] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password-adv"className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Confirm New Password</label>
                            <input
                                id="confirm-password-adv" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                required minLength={6}
                                className="w-full p-3 bg-gray-50 dark:bg-[#0E1117] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button variant="secondary" type="button" onClick={() => { setShowPasswordForm(false); setError(''); setMessage(''); }} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" className="!py-2 !px-4" disabled={loading}>
                                {loading ? <Spinner /> : 'Update Password'}
                            </Button>
                        </div>
                    </form>
                  ) : (
                    <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Update the password for your account.</p>
                        <Button onClick={() => setShowPasswordForm(true)} className="!py-2 !px-4">
                            Change
                        </Button>
                    </div>
                  )}
              </section>

              {/* Delete Account Section */}
              <section>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-500 border-b border-red-500/30 pb-2 mb-4">Danger Zone</h3>
                  <div className="p-4 bg-red-500/10 rounded-lg flex items-center justify-between">
                      <div>
                          <p className="font-semibold text-red-700 dark:text-red-400">Delete Account</p>
                          <p className="text-sm text-red-600 dark:text-red-500">Permanently delete your account and all data.</p>
                      </div>
                      <Button variant="danger" className="!py-2 !px-4" onClick={() => setShowDeleteConfirm(true)}>Delete</Button>
                  </div>
              </section>
              
              {message && <p className="text-green-500 text-sm mt-4 text-center">{message}</p>}
              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowDeleteConfirm(false)}>
            {/* Fix: Wrapped Card in a div with stopPropagation to prevent type error on Card's onClick prop. */}
            <div onClick={(e) => e.stopPropagation()}>
              <Card className="max-w-md w-full">
                  <h3 className="text-xl font-bold text-center text-red-600 dark:text-red-400">Are you sure?</h3>
                  <p className="text-center text-gray-600 dark:text-gray-300 mt-2">This will permanently delete your account, your scripts, and your generated audio. This action cannot be undone.</p>
                  <div className="flex justify-center gap-4 mt-6">
                      <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={deleteLoading}>Cancel</Button>
                      <Button variant="danger" onClick={handleDeleteAccount} disabled={deleteLoading} className="w-32 flex justify-center">
                          {deleteLoading ? <Spinner/> : 'Yes, Delete'}
                      </Button>
                  </div>
              </Card>
            </div>
        </div>
      )}
    </div>
  );
};
