'use client';

import ApplicationForm from '../components/ApplicationForm';
import styles from './apply.module.css';
import Image from 'next/image';

export default function ApplicationPage() {
  return (
    <div className={styles.applicationBg}>
      <header className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <Image
            src="/logo.png"
            alt="DOE Logo"
            width={60}
            height={60}
            className={styles.headerLogo}
            priority
          />
          <div className={styles.headerTextGroup}>
            <div className={styles.headerGov}>REPUBLIC OF THE PHILIPPINES</div>
            <div className={styles.headerAddr}>TAGUIG CITY, PHILIPPINES 1632</div>
            <div className={styles.headerDept}>Department of Energy</div>
          </div>
        </div>
        <div className={styles.headerTitle}>DOE Online Job Application</div>
      </header>
      <main className={styles.applicationMain}>
        <ApplicationForm />
      </main>
    </div>
  );
} 