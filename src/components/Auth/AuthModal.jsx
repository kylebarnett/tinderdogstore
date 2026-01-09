import { useState } from 'react';
import { useUser } from '../../context/UserContext';

export function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup, referredBy } = useUser();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (username.length < 3) {
          throw new Error('Username must be at least 3 characters');
        }
        if (password.length < 4) {
          throw new Error('Password must be at least 4 characters');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        signup(username, password);
      } else {
        login(username, password);
      }
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] p-5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 border-none bg-gray-100 rounded-full text-2xl cursor-pointer flex items-center justify-center text-gray-500 transition-colors hover:bg-gray-200"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="m-0 mb-6 text-gray-800 text-center text-2xl font-bold">
          {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
        </h2>

        {referredBy && mode === 'signup' && (
          <div className="bg-gradient-to-r from-green-100 to-green-50 text-green-800 p-3 rounded-lg text-center mb-5 font-medium">
            You were invited by a friend!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1.5 text-gray-700 font-medium text-sm" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1.5 text-gray-700 font-medium text-sm" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          {mode === 'signup' && (
            <div className="mb-4">
              <label className="block mb-1.5 text-gray-700 font-medium text-sm" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 border-none rounded-xl bg-purple-600 text-white text-base font-semibold cursor-pointer transition-colors hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-5 text-center text-gray-500 text-sm">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="bg-transparent border-none text-purple-600 font-semibold cursor-pointer p-0 text-sm hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="bg-transparent border-none text-purple-600 font-semibold cursor-pointer p-0 text-sm hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
