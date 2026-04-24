'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import styles from './page.module.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    full_name: string;
    skills: string[];
    bio: string;
    location: string;
    joined: string;
  }>({
    full_name: '',
    skills: [],
    bio: '',
    location: 'Remote / Worldwide',
    joined: ''
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        const p = {
          full_name: data.full_name || user.email?.split('@')[0] || 'User',
          skills: data.skills || [],
          bio: data.bio || 'Freelance professional helping clients achieve their goals.',
          location: data.location || 'Remote / Worldwide',
          joined: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
        setProfile(p);
        setEditForm(p);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editForm.full_name,
        bio: editForm.bio,
        location: editForm.location,
        skills: typeof editForm.skills === 'string' ? (editForm.skills as string).split(',').map(s => s.trim()).filter(Boolean) : editForm.skills
      })
      .eq('id', user.id);

    if (!error) {
      setProfile({
        ...editForm,
        skills: typeof editForm.skills === 'string' ? (editForm.skills as string).split(',').map(s => s.trim()).filter(Boolean) : editForm.skills
      });
      setIsEditing(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading profile...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.sidebar}>
          <div className={styles.mainCard}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{profile.full_name.charAt(0).toUpperCase()}</div>
              <div className={styles.statusDot}></div>
            </div>
            <h1 className={styles.userName}>{profile.full_name}</h1>
            <p className={styles.userRole}>{profile.skills[0] || 'Professional Freelancer'}</p>
            
            <button className={styles.previewBtn} onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>

            <div className={styles.metaInfo}>
              <div className={styles.metaRow}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>From: <strong>{profile.location}</strong></span>
              </div>
              <div className={styles.metaRow}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Member since: <strong>{profile.joined}</strong></span>
              </div>
            </div>
          </div>

          <div className={styles.badgesCard}>
            <h3>Account Badges</h3>
            <div className={styles.badge}>
              <div className={styles.badgeIcon}>✓</div>
              <span>Verified Identity</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.content}>
          {isEditing ? (
            <div className={styles.editSection}>
              <h2>Edit Your Profile</h2>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={editForm.full_name} 
                  onChange={e => setEditForm({...editForm, full_name: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Location</label>
                <input 
                  type="text" 
                  value={editForm.location} 
                  onChange={e => setEditForm({...editForm, location: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Bio / Description</label>
                <textarea 
                  value={editForm.bio} 
                  onChange={e => setEditForm({...editForm, bio: e.target.value})} 
                  rows={5}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Skills (Comma separated)</label>
                <input 
                  type="text" 
                  value={Array.isArray(editForm.skills) ? editForm.skills.join(', ') : editForm.skills} 
                  onChange={e => setEditForm({...editForm, skills: e.target.value as any})} 
                />
              </div>
              <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
            </div>
          ) : (
            <>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Description</h2>
                </div>
                <p className={styles.bioText}>{profile.bio}</p>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Skills</h2>
                </div>
                <div className={styles.skillList}>
                  {profile.skills.map((skill, i) => (
                    <span key={i} className={styles.skillTag}>{skill}</span>
                  ))}
                  {profile.skills.length === 0 && <p className={styles.empty}>No skills listed yet.</p>}
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Experience</h2>
                </div>
                <div className={styles.emptyState}>
                  <p>Share your professional background to build trust with clients.</p>
                  <button onClick={() => setIsEditing(true)}>Add Experience</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
