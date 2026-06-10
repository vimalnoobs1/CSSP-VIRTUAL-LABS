import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertCircle, ArrowRight, BookOpen, AlertTriangle, Skull } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginViewProps {
  onLoginSuccess: (username: string, email: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [password, setPassword] = useState('EV2026');
  const [username, setUsername] = useState('Vimal R');
  const [email, setEmail] = useState('vimalthenoob@gmail.com');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Validation
    if (!username.trim()) {
      setError('Please enter your full name to proceed with your enrollment record.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please supply a valid corporate or student email address.');
      return;
    }

    if (password === 'EV2026') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(username.trim(), email.trim());
      }, 1000); // realistic load states
    } else {
      setError('Invalid Access Token/Password. Please check the Cyber Security Starter Program guidelines.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] px-4 relative overflow-hidden" id="login-container">
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-[#111218] rounded-2xl border border-slate-800/80 mb-4" id="shield-logo-wrap">
            <Shield className="w-8 h-8 text-brand-blue" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2" id="brand-title">
            EV Cyber Academy
          </h1>
          <p className="text-slate-400 font-medium" id="program-title">
            Cyber Security Starter Program 2026
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-800/80 shadow-2xl relative" id="login-card">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent"></div>
          
          <div className="mb-6 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0a0b10] rounded-full text-xs font-semibold text-brand-cyan border border-[#ea0606]">
              <BookOpen className="w-3.5 h-3.5" /> Cyber Training Program (Verified)
            </span>

            {/* SYSTEM RESTRICTED INTEL NOTICE */}
            <div className="bg-[#1c080a] border-2 border-[#ea0606] rounded-2xl p-4 text-left relative overflow-hidden" id="admin-security-alert">
              <div className="absolute -bottom-2 -right-2 opacity-[0.06] pointer-events-none">
                <Skull className="w-24 h-24 text-[#ea0606]" />
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2.5 bg-[#ea0606]/10 rounded-xl border border-[#ea0606]/35 text-[#ea0606] shrink-0 mt-0.5 animate-bounce">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ea0606] animate-ping shrink-0" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ea0606]">
                      SYSTEM RESTRICTED ACCESS ALERT
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-normal font-mono font-bold">
                    ALL EVERY MOMENTS HAS BEEN WATCHED BY ADMIN <strong className="text-[#ea0606] underline font-extrabold">(VIMAL)</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 font-sans pt-0.5">
                    LABS POWERED BY <strong className="text-brand-cyan font-bold">VIMALTHEHACKER</strong>, FOUNDER OF EV CYBER ACADEMY.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-350 uppercase tracking-wider block">
                Full Name (For Certificate)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Vimal R"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#161720] border border-slate-800/85 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-350 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#161720] border border-slate-800/85 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-350 uppercase tracking-wider">
                <label>Program Passcode</label>
                <span className="text-slate-500 font-normal lowercase">(Hint: EV2026)</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#161720] border border-slate-800/85 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  id="toggle-visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                className="flex items-start gap-2.5 bg-brand-rose/10 border border-brand-rose/20 rounded-xl p-3.5 text-xs text-brand-rose"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                id="login-error"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:bg-brand-blue/50 text-white font-medium rounded-xl py-3 px-4 text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-brand-blue/10 mt-2"
              id="submit-auth-btn"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Authenticate Access <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Trust Footer */}
        <div className="text-center mt-6 text-xs text-slate-500" id="login-footer">
          System Authorized. Secured Training Pipeline 2026.
        </div>
      </motion.div>
    </div>
  );
}
