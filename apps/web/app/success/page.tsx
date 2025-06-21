'use client';

import Link from 'next/link';
import styles from '../page.module.css';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [controlNumber, setControlNumber] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Get the stored values from session storage
    const storedApplicantId = sessionStorage.getItem('applicantId');
    const storedControlNumber = sessionStorage.getItem('controlNumber');

    if (storedApplicantId) setApplicantId(storedApplicantId);
    if (storedControlNumber) setControlNumber(storedControlNumber);
  }, []);

  const handleDownloadPDF = async () => {
    if (!applicantId) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/applications/${applicantId}/pdf`);
      if (!res.ok) throw new Error('Failed to download PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `application-${applicantId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        background: '#062C41',
      }}>
        <img
          src="/bg/blurredBG.jpg"
          alt="Background"
          style={{ width: '100vw', height: '100vh', objectFit: 'cover', filter: 'blur(0px)', display: 'block' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; console.warn('Background image failed to load: /bg/blurredBG.jpg'); }}
        />
      </div>
      <div className={styles.page} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
        <div className={styles.main} style={{ width: '100%', maxWidth: 520, margin: '0 auto', background: 'rgba(6,44,65,0.92)', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.18)', padding: '48px 32px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/logo.png" alt="DOE Logo" style={{ width: 80, height: 80, marginBottom: 24 }} />
          <h1 className={styles.title} style={{ color: '#ffd43b', marginBottom: 8, textAlign: 'center' }}>Application Submitted!</h1>
          <p style={{ textAlign: 'center', color: '#e0e6ed', marginBottom: 24, fontSize: '1.1rem' }}>
            Thank you for submitting your application.<br />You will receive updates via your provided contact information.
          </p>
          {applicantId && controlNumber && (
            <div style={{
              textAlign: 'center',
              marginBottom: 24,
              padding: '18px 0',
              background: 'rgba(27,77,126,0.85)',
              borderRadius: 8,
              color: '#fff',
              width: '100%',
              fontSize: '1.08rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: '#ffd43b' }}>Applicant ID:</span> {applicantId}
              </div>
              <div>
                <span style={{ color: '#ffd43b' }}>Control Number:</span> {controlNumber}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', marginTop: 8 }}>
            {applicantId && (
              <a
                onClick={handleDownloadPDF}
                className={styles.primary}
                style={{ cursor: 'pointer', width: '100%', textAlign: 'center', background: '#ffd43b', color: '#062C41', fontWeight: 700, fontSize: '1.08rem', borderRadius: 8, padding: '14px 0', marginBottom: 0 }}
              >
                {downloading ? 'Generating...' : 'Download PDF Copy'}
              </a>
            )}
            <Link href="/apply" className={styles.primary} style={{ width: '100%', textAlign: 'center', background: '#e5eaf1', color: '#062C41', fontWeight: 700, fontSize: '1.08rem', borderRadius: 8, padding: '14px 0' }}>
              Submit Another Application
            </Link>
            <Link href="/" className={styles.secondary} style={{ width: '100%', textAlign: 'center', background: 'transparent', color: '#ffd43b', fontWeight: 700, fontSize: '1.08rem', borderRadius: 8, padding: '14px 0', border: '1.5px solid #ffd43b' }}>
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 