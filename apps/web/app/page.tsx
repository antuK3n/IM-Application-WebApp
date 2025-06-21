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
            <div className={styles.location}>REPUBLIC OF THE PHILIPPINES<br />TAGUIG CITY, PHILIPPINES 1632</div>
            <h1 className={styles.title}>Department of Energy</h1>
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
          <div className={styles.footerText} style={{ textAlign: 'center' }}>
            By using this service, you understood and agree to the<br />
            <a href="https://example.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>
              Department of Energy Services Terms of Use and Privacy Statement
            </a>
            <br /><br />
            <span style={{ fontSize: '0.95rem', color: '#fff' }}>
              This project is open source. View the codebase on <a href="https://github.com/antuK3n/IM-Application-WebApp" target="_blank" rel="noopener noreferrer" style={{ color: '#ffd43b', textDecoration: 'underline' }}>GitHub</a>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
