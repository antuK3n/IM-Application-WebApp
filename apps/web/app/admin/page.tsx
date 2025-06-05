'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

interface Application {
  Applicant_ID: string;
  Applicant_Name: string;
  Contact_Number: string;
  Age: number;
  Sex: string;
  Control_Number: string;
  Position_Applied: string;
  Salary_Desired: number;
  Educational_Attainment: string;
  Institution_Name: string;
  Year_Graduated: number;
  Honors: string | null;
  Company_Name: string;
  Company_Location: string;
  Position: string;
  Salary: number;
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch applications');
      }

      setApplications(data.applications);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (applicantId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/applications/${applicantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      // Refresh the applications list
      fetchApplications();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete application');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading applications...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Job Application Portal
        </div>
        <nav className={styles.navLinks}>
          <a href="/admin" className={styles.active}>Dashboard</a>
          <a href="/admin/applications">Applications</a>
          <a href="/admin/settings">Settings</a>
        </nav>
      </aside>
      <main className={styles.main}>
        <h1>Applications</h1>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Position</th>
                <th>Education</th>
                <th>Previous Job</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.Applicant_ID}>
                  <td>{app.Control_Number}</td>
                  <td>{app.Applicant_Name}</td>
                  <td>{app.Contact_Number}</td>
                  <td>
                    {app.Position_Applied}
                    <br />
                    <small>Desired: ${app.Salary_Desired}</small>
                  </td>
                  <td>
                    {app.Educational_Attainment}
                    <br />
                    <small>{app.Institution_Name} ({app.Year_Graduated})</small>
                    {app.Honors && <br />}
                    {app.Honors && <small>Honors: {app.Honors}</small>}
                  </td>
                  <td>
                    {app.Position} at {app.Company_Name}
                    <br />
                    <small>{app.Company_Location}</small>
                    <br />
                    <small>Salary: ${app.Salary}</small>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(app.Applicant_ID)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
} 