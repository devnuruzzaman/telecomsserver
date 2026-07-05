import React, { useState } from 'react';
import { 
  Lock, Phone, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, 
  UserCheck, KeyRound, Radio, RefreshCw, ChevronLeft, Globe2, Eye, EyeOff 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [phone, setPhone] = useState('01712345678');
  const [password, setPassword] = useState('Secret123!');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'RETAILER' | 'CUSTOMER' | 'ADMIN' | 'SUPPORT'>('RETAILER');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      // Simulate MFA trigger for Admin and Retailer for safety showcase
      if (role === 'ADMIN' || role === 'RETAILER') {
        setMfaRequired(true);
        setSuccessMessage('Credential check passed! Multi-Factor Authentication code is required.');
      } else {
        // Direct route for others
        setSuccessMessage('Authentication successful! Routing to merchant console...');
        setTimeout(() => {
          // Go to home/sandbox dashboard
          window.location.href = '/';
        }, 1200);
      }
    }, 1500);
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      if (mfaCode === '123456') {
        setSuccessMessage('2FA code verified. Secure token handshake established!');
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      } else {
        setErrorMessage('Invalid 2FA verification code. (Hint: Use default 123456 in simulation)');
      }
    }, 1500);
  };

  const applyPreset = (presetRole: typeof role, presetPhone: string) => {
    setRole(presetRole);
    setPhone(presetPhone);
    setErrorMessage('');
    setMfaRequired(false);
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)] shrink-0">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white uppercase">RechargeSaaS</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-900/40 text-indigo-400">BLUEPRINT</span>
              </div>
              <span className="block text-[9px] font-mono text-slate-500">GLOBAL AIRTIME HUB</span>
            </div>
          </div>

          <button 
            onClick={() => window.location.href = '/'}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Sandbox
          </button>
        </div>
      </header>

      {/* Main Form Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:py-24 relative z-10">
        
        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 p-8 rounded-2xl shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-sm"
        >
          
          {/* Top Gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-xl bg-slate-950 border border-slate-850 text-indigo-400 mb-1">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white font-display">Secure Merchant Portal</h2>
            <p className="text-xs text-slate-400">Enterprise Telecom Recharge Multi-Tenant Node</p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-400"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl flex items-start gap-2.5 text-xs text-emerald-400"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Dynamic Mode: Password Login or MFA */}
          {!mfaRequired ? (
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Role Toggle Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold block">Select Mock Identity Preset</label>
                <div className="grid grid-cols-4 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-850">
                  {(['RETAILER', 'CUSTOMER', 'ADMIN', 'SUPPORT'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        const mapping = {
                          RETAILER: '01712345678',
                          CUSTOMER: '01811122233',
                          ADMIN: '01999998888',
                          SUPPORT: '01511223344'
                        };
                        applyPreset(r, mapping[r]);
                      }}
                      className={`py-1.5 rounded-lg text-[9px] font-mono uppercase font-bold transition-all ${
                        role === r 
                          ? 'bg-indigo-600 text-white shadow' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +8801712345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Access Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(99,102,241,0.25)] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Ledger Keys...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Securely</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyMfa} className="space-y-4">
              {/* MFA OTP Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">MFA OTP Code</label>
                  <span className="text-[9px] font-mono text-slate-500">Code is: <code className="bg-slate-950 px-1 text-teal-400 font-bold rounded">123456</code></span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-center tracking-[0.5em] text-sm"
                  />
                </div>
              </div>

              {/* Verify OTP Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(99,102,241,0.25)] active:scale-95 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Decrypting Handshake...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-teal-400" />
                    <span>Verify and Handshake</span>
                  </>
                )}
              </button>

              {/* Back to normal Credentials */}
              <button
                type="button"
                onClick={() => {
                  setMfaRequired(false);
                  setSuccessMessage('');
                }}
                className="w-full py-2 text-center text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors block cursor-pointer"
              >
                Back to Credentials
              </button>
            </form>
          )}
        </motion.div>

        <p className="mt-6 text-[10px] font-mono text-slate-500 text-center">
          Unauthorized access attempts logged by <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-400 font-bold">idx_audit_logs_user_action</code>.
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-slate-500 font-mono text-[11px]">
        <p>© 2026 RechargeSaaS Technical Engineering. Compliant with PCI-DSS, ISO-27001 and GDPR directives.</p>
      </footer>
    </div>
  );
}
