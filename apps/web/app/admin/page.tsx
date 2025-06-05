'use client';

import { useState } from 'react';
import styles from './admin.module.css';

interface Application {
  id: number;
  position: string;
  name: string;
  email: string;
  submittedAt: string;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      position: 'Software Engineer',
      name: 'John Doe',
      email: 'john@example.com',
      submittedAt: '2024-03-20'
    },
    {
      id: 2,
      position: 'Product Manager',
      name: 'Jane Smith',
      email: 'jane@example.com',
      submittedAt: '2024-03-19'
    }
  ]);

  const handleEdit = (id: number) => {
    // TODO: Implement edit functionality
    console.log('Edit application:', id);
  };

  const handleDelete = (id: number) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

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
        <h1>Applications Dashboard</h1>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Position</th>
                <th>Name</th>
                <th>Email</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.position}</td>
                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td>{app.submittedAt}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(app.id)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
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