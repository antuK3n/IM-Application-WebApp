'use client';

import Link from 'next/link';
import styles from '../page.module.css';

export default function SuccessPage() {
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formSection}>
            <h1 className={styles.title}>Application Submitted!</h1>
            <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
              Thank you for submitting your application. We will review it and get back to you soon.
            </p>
            <div className={styles.ctas}>
              <Link href="/apply" className={styles.primary}>
                Submit Another Application
              </Link>
              <Link href="/" className={styles.secondary}>
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 