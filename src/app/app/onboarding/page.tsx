'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import styles from './page.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const [profession, setProfession] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: profession, // store profession in display_name or a new field, let's just use skills string representation for now
          skills: [profession, ...skills.split(',').map(s => s.trim()).filter(Boolean)],
        });

      if (updateError) throw updateError;

      router.push(`/app/leads?q=${encodeURIComponent(profession)}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const skip = () => {
    router.push('/app/leads');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1 className={styles.title}>Set up your profile</h1>
          <p className={styles.subtitle}>Help us find the perfect freelance leads for your specific niche.</p>
        </div>

        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.group}>
            <label className={styles.label}>Your Profession</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. UI/UX Designer, SDR, Copywriter"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
            />
            <span className={styles.hint}>This will be your default search for finding new leads.</span>
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Key Skills (Optional)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Figma, Cold Calling, SEO Writing"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <span className={styles.hint}>Used by our AI to tailor your proposals. Comma separated.</span>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.skipBtn} onClick={skip} disabled={loading}>
              Skip for now
            </button>
            <button type="submit" className={styles.saveBtn} disabled={loading || !profession.trim()}>
              {loading ? 'Saving...' : 'Save & Find Leads'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
