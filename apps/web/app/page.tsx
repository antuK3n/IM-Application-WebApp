'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<'applicant' | 'admin'>('applicant');
  // Admin login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      sessionStorage.setItem('adminToken', data.token);
      router.push('/admin');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bgWrapper}>
      <Image
        src="/doeui.jpg"
        alt="DOE Background"
        fill
        className={styles.bgImage}
        priority
      />
      <div className={styles.overlay}>
        <div className={styles.centerCard}>
          <Image
            src="/logo.png"
            alt="DOE Logo"
            width={120}
            height={120}
            className={styles.logo}
            priority
          />
          <div className={styles.headerText}>
            <div className={styles.location}>REPUBLIC OF THE sorry nalulupitan ako first time frontend hawhdawd<br />TAGUIG CITY, PHILIPPINES 1632</div>
            <h1 className={styles.title}>Department of inaayos pa wait</h1>
          </div>
          <div className={styles.tabToggle}>
            <button
              className={selectedTab === 'applicant' ? styles.tabActive : styles.tab}
              onClick={() => setSelectedTab('applicant')}
              type="button"
            >
              Applicant
            </button>
            <button
              className={selectedTab === 'admin' ? styles.tabActive : styles.tab}
              onClick={() => setSelectedTab('admin')}
              type="button"
            >
              Admin
            </button>
            <div
              className={styles.tabIndicator}
              style={{ left: selectedTab === 'applicant' ? 0 : '50%' }}
            />
          </div>
          <div className={styles.animatedFormSection}>
            <Link
              href="/apply"
              className={styles.submitBtn + ' ' + (selectedTab === 'applicant' ? styles.visible : styles.hidden)}
              tabIndex={selectedTab === 'applicant' ? 0 : -1}
            >
              Submit an Application
            </Link>
            <form
              className={styles.loginForm + ' ' + (selectedTab === 'admin' ? styles.visible : styles.hidden)}
              onSubmit={handleAdminLogin}
              autoComplete="off"
              tabIndex={selectedTab === 'admin' ? 0 : -1}
            >
              {error && <div className={styles.error}>{error}</div>}
              <input
                type="text"
                id="admin-username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Username"
              />
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Password"
              />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
          <div className={styles.footerText}>
            Pasa mo...
            God is giving u 600 million angel to take care of u.
            Share them to 9 close to ur heart except sken.
            You wil hav gud news in 10 mins.
            Ngtry ako totoo...
          </div>
        </div>
      </div>
    </div>
  );
}
