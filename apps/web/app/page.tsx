'use client';

import ApplicationForm from './components/ApplicationForm';
import ThemeToggle from './components/ThemeToggle';
import styles from './page.module.css';

export default function ApplicationPage() {
  return (
    <div className={styles.page}>
      <ThemeToggle />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Application for Employment
        </h1>
        <ApplicationForm />
      </main>
    </div>
  );
}
