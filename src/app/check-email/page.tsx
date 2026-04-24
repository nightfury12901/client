'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function CheckEmailPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.iconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h1 className={styles.title}>Check your email</h1>
        <p className={styles.subtitle}>
          We sent you a confirmation link. Please check your inbox and click the link to verify your account.
        </p>
        <Link href="/signin" className={styles.btn}>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
