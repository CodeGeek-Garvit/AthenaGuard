import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Shield, Mail, Lock, ArrowRight, Loader2, Info, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginView() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This account already exists. Switching to Sign In...");
        setTimeout(() => {
          setIsLogin(true);
          setError('');
        }, 2000);
      } else if (err.code === 'auth/wrong-password') {
        setError("Invalid credentials. Please verify your password.");
      } else if (err.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to receive a reset link.");
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A password reset link has been dispatched to your email.");
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError("No account detected with this email address.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-4 shadow-xl shadow-emerald-500/10">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">ATHENA<span className="text-emerald-400">GUARD</span></h1>
          <p className="text-slate-400 text-sm">Professional Sports Media Protection Platform</p>
        </div>

        <div className="bg-[#0D0D0E] border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                  placeholder="admin@athenaguard.ai"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Password</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase transition-colors"
                  >
                    Forgot Access?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  required={isLogin}
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium"
                >
                  {error}
                </motion.div>
              )}
              {message && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium flex gap-2 items-center"
                >
                  <Info className="w-4 h-4" />
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#0A0A0B] font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative px-4 bg-[#0D0D0E] text-[10px] font-black text-slate-600 uppercase tracking-widest">or</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <Chrome className="w-5 h-5 text-emerald-400" />
              GOOGLE ACCESS
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-slate-500 hover:text-emerald-400 transition-colors font-medium"
            >
              {isLogin ? "DON'T HAVE AN ACCOUNT? REGISTER" : "ALREADY ENROLLED? SIGN IN"}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          Secured by Athena Fingerprinting Technology
        </p>
      </motion.div>
    </div>
  );
}
