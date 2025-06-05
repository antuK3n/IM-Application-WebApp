'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formSection}>
            <h1 className={styles.title}>job portal thingy</h1>
            <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
              job portal thingy
            </p>
            <div className={styles.ctas}>
              <Link href="/apply" className={styles.primary}>
                Apply Now
              </Link>
              <Link href="/admin" className={styles.secondary}>
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
