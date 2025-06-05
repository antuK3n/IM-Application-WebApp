'use client';

import ApplicationForm from '../components/ApplicationForm';
import styles from '../page.module.css';

export default function ApplicationPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          boo jumpscare 
        </h1>
        <ApplicationForm />
      </main>
    </div>
  );
} 