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
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formSection}>
            <h1 className={styles.title}>Application Submitted!</h1>
            <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
              Thank you for submitting your application. Reviewhin ko bukas trust
            </p>
            {applicantId && controlNumber && (
              <div style={{
                textAlign: 'center',
                marginBottom: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                backgroundColor: '#222',
                borderRadius: '4px'
              }}>
                <p style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <strong>Applicant ID:</strong> {applicantId}
                </p>
                <p>
                  <strong>Control Number:</strong> {controlNumber}
                </p>
              </div>
            )}
            <div className={styles.ctas}>
              {applicantId && (
                <a
                  onClick={handleDownloadPDF}
                  className={styles.primary}
                  style={{ cursor: 'pointer' }}
                >
                  {downloading ? 'Generating...' : 'Download PDF Copy'}
                </a>
              )}
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