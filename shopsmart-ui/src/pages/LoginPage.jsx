import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { validateEmail, validatePassword } from '../utils/validators.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';

const DEMO_ACCOUNTS = [
  {
    label: 'Basic Demo',
    email: 'basic@demo.com',
    password: 'Demo@123',
    tier: 'BASIC',
    role: 'CUSTOMER',
    desc: 'Standard shopping',
  },
  {
    label: 'Prime Demo',
    email: 'prime@demo.com',
    password: 'Demo@123',
    tier: 'PRIME',
    role: 'CUSTOMER',
    desc: 'Free delivery, fast refunds',
  },
  {
    label: 'Premium Demo',
    email: 'premium@demo.com',
    password: 'Demo@123',
    tier: 'PREMIUM',
    role: 'CUSTOMER',
    desc: 'Express delivery, extended warranty',
  },
  {
    label: 'Admin',
    email: 'admin@shopsmart.ai',
    password: 'Admin@123',
    tier: 'PREMIUM',
    role: 'ADMIN',
    desc: 'Knowledge ingestion & logs',
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setApiError(null);

    // Validate
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({
        email: emailErr,
        password: passErr,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.message || err?.error || 'Invalid email or password';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setErrors({});
    setApiError(null);

    // Auto submit
    setLoading(true);
    login(demo.email, demo.password)
      .then(() => {
        toast.success(`Logged in as ${demo.label}`);
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setApiError(err?.message || 'Quick login failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left: Brand Panel */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#0A4F8F] via-[#0F6CBD] to-[#1E293B] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <span className="text-2xl font-black tracking-tight text-white">ShopSmart</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--color-ai)] text-white">AI</span>
          </Link>

          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Shop smarter.<br />Ask anything.
          </h1>
          <p className="text-blue-100 text-sm lg:text-base leading-relaxed max-w-sm mb-8">
            Experience next-generation e-commerce powered by verified grounding, real-time specifications, and explainable AI recommendations.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10 text-xs text-blue-100">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">✓</span>
              <span><strong>Policy-grounded RAG:</strong> Transparent return & warranty answers.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">✓</span>
              <span><strong>Auditable AI:</strong> Full citations and confidence metrics.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">✓</span>
              <span><strong>Smart discovery:</strong> Personalized specs within your budget.</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 text-xs text-blue-200/70 border-t border-white/10 mt-8">
          HCLTech Hackathon Prototype • ShopSmart AI
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-slate-900)]">
              Sign in to your account
            </h2>
            <p className="text-sm text-[var(--color-slate-500)] mt-1">
              Enter your credentials or choose a pre-configured demo account below.
            </p>
          </div>

          {/* Inline API Error Alert */}
          {apiError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-3" role="alert">
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold">{apiError}</p>
                <p className="text-xs text-red-600 mt-0.5">Please check your email and password, or use one of the one-click demo logins below.</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Email address"
              id="login-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              id="login-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={errors.password}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Login Section */}
          <div className="pt-6 border-t border-[var(--color-slate-200)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-slate-500)]">
                One-Click Quick Logins
              </span>
              <span className="text-xs text-[var(--color-slate-400)]">Preloaded profiles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin(acc)}
                  className="flex flex-col text-left p-3 rounded-xl border border-[var(--color-slate-200)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/30 transition-all text-xs focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] group cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-[var(--color-slate-800)] group-hover:text-[var(--color-primary)]">
                      {acc.label}
                    </span>
                    <Badge type="tier" size="sm">{acc.tier}</Badge>
                  </div>
                  <span className="text-[var(--color-slate-500)] text-[11px] font-mono truncate mb-1">
                    {acc.email}
                  </span>
                  <span className="text-[11px] text-[var(--color-slate-400)]">
                    {acc.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
