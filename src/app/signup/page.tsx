'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ first: '', last: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/app/leads`,
      },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: `${form.first} ${form.last}`.trim() },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/app/leads`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/check-email');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.formPane}>
        <div className={styles.brand}>
          <div className={styles.brandSq}/>
          <span className={styles.brandName}>ClientGravity<span className={styles.brandAi}>AI</span></span>
        </div>

        <form className={styles.formCard} onSubmit={handleEmailSignup}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Already have an account?{' '}
            <Link href="/signin" className={styles.link}>Sign in</Link>
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button type="button" className={styles.googleBtn} onClick={handleGoogleSignup} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.618 14.013 17.64 11.816 17.64 9.2z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {loading ? 'Redirecting...' : 'Sign up with Google'}
          </button>

          <div className={styles.divider}>
            <div className={styles.dividerLine}/><span className={styles.dividerOr}>or</span><div className={styles.dividerLine}/>
          </div>

          <div className={styles.nameRow}>
            <input className={styles.input} type="text" name="first" placeholder="First name" value={form.first} onChange={handleChange} autoComplete="given-name" required/>
            <input className={styles.input} type="text" name="last"  placeholder="Last name"  value={form.last}  onChange={handleChange} autoComplete="family-name" required/>
          </div>

          <input className={styles.input} type="email"    name="email"    placeholder="name@work-email.com" value={form.email}    onChange={handleChange} autoComplete="email"        required/>

          <div className={styles.passWrap}>
            <input className={styles.input} type={showPass ? 'text' : 'password'} name="password" placeholder="Password (8+ chars)" value={form.password} onChange={handleChange} autoComplete="new-password" required minLength={8}/>
            <button type="button" className={styles.passToggle} onClick={() => setShowPass(s => !s)} tabIndex={-1}>
              {showPass ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          <p className={styles.terms}>
            By creating an account you agree to our{' '}
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link> and{' '}
            <Link href="/terms" className={styles.link}>Terms of Service</Link>.
          </p>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>

      {/* Right decorative pane */}
      <div className={styles.decoPane}>
        <div className={styles.decoArt}>
          <div className={`${styles.floatCard} ${styles.floatCard1}`}>
            <div className={styles.floatCardDot}/>
            <div><p className={styles.floatCardVal}>3.2×</p><p className={styles.floatCardLbl}>reply rate increase</p></div>
          </div>
          <div className={`${styles.floatCard} ${styles.floatCard2}`}>
            <div className={styles.floatCardDot} style={{ background: 'rgba(240,240,240,0.3)' }}/>
            <div><p className={styles.floatCardVal}>12 min</p><p className={styles.floatCardLbl}>first proposal</p></div>
          </div>
          <div className={styles.decoCenterIll}>
            <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.decoSvg}>
              <circle cx="100" cy="44" r="20" stroke="rgba(240,240,240,0.1)" strokeWidth="1"/>
              <path d="M80 66 L72 104 L128 104 L120 66 Z" stroke="rgba(240,240,240,0.08)" strokeWidth="1" fill="none"/>
              <path d="M80 72 Q60 88 44 108" stroke="rgba(240,240,240,0.07)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M120 72 Q140 86 156 96" stroke="rgba(240,240,240,0.07)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M88 104 Q80 134 70 162 L54 178" stroke="rgba(240,240,240,0.07)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M112 104 Q118 130 126 158 L142 178" stroke="rgba(240,240,240,0.07)" strokeWidth="1.2" strokeLinecap="round"/>
              {Array.from({ length: 18 }).map((_, i) => (
                <rect key={i} x="72" y={30 + i * 11} width={56} height={3} rx="1" fill="rgba(240,240,240,0.05)" className={styles.scanline} style={{ animationDelay: `${i * 80}ms` }}/>
              ))}
              <rect x="38" y="28" width="6" height="6" rx="1" fill="rgba(240,240,240,0.15)"/>
              <rect x="156" y="28" width="6" height="6" rx="1" fill="rgba(240,240,240,0.15)"/>
              <rect x="38" y="186" width="6" height="6" rx="1" fill="rgba(240,240,240,0.15)"/>
              <rect x="156" y="186" width="6" height="6" rx="1" fill="rgba(240,240,240,0.15)"/>
              <rect x="40" y="30" width="120" height="160" rx="2" stroke="rgba(240,240,240,0.05)" strokeWidth="0.8" fill="none"/>
            </svg>
          </div>
          <div className={`${styles.floatCard} ${styles.floatCard3}`}>
            <div className={styles.floatCardDot} style={{ background: 'rgba(240,240,240,0.2)' }}/>
            <div><p className={styles.floatCardVal}>8,400+</p><p className={styles.floatCardLbl}>freelancers</p></div>
          </div>
        </div>
        <p className={styles.decoTagline}>Stop applying.<br/><em>Start getting clients.</em></p>
      </div>
    </div>
  );
}
