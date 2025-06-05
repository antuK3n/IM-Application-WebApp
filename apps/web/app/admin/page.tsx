'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

interface Application {
  Applicant_ID: string;
  Applicant_Name: string;
  Applicant_Address: string;
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
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [sortField, setSortField] = useState<'Applicant_ID' | 'Applicant_Name'>('Applicant_ID');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

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

      console.log('Fetched applications:', data.applications);
      setApplications(data.applications);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (application: Application) => {
    console.log('Original application data:', application);
    // Initialize all fields with default values if they're undefined
    const initializedApplication = {
      ...application,
      Applicant_Name: application.Applicant_Name || '',
      Applicant_Address: application.Applicant_Address || '',
      Contact_Number: application.Contact_Number || '',
      Position_Applied: application.Position_Applied || '',
      Salary_Desired: application.Salary_Desired || 0,
      Educational_Attainment: application.Educational_Attainment || '',
      Institution_Name: application.Institution_Name || '',
      Year_Graduated: application.Year_Graduated || 0,
      Honors: application.Honors || null,
      Company_Name: application.Company_Name || '',
      Company_Location: application.Company_Location || '',
      Position: application.Position || '',
      Salary: application.Salary || 0
    };
    console.log('Initialized application data:', initializedApplication);
    setEditingApplication(initializedApplication);
  };

  const handleSave = async (updatedData: Application) => {
    try {
      const response = await fetch(`/api/admin/applications/${updatedData.Applicant_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      // Refresh the applications list
      await fetchApplications();
      setEditingApplication(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update application');
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

  const handleSort = (field: 'Applicant_ID' | 'Applicant_Name') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedApplications = applications
    .filter(app => 
      app.Applicant_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.Applicant_Name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

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
        <div className={styles.headerRow}>
          <h1>Applications</h1>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('Applicant_ID')}
                className={styles.sortableHeader}
              >
                ID {sortField === 'Applicant_ID' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('Applicant_Name')}
                className={styles.sortableHeader}
              >
                Name {sortField === 'Applicant_Name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Contact</th>
              <th>Position</th>
              <th>Education</th>
              <th>Previous Job</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedApplications.map((app) => (
              <tr key={app.Applicant_ID}>
                <td>{app.Applicant_ID}</td>
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
                    onClick={() => handleEdit(app)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
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
      </main>

      {editingApplication && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Application</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Ensure all required fields have values
              const updatedData = {
                ...editingApplication,
                Applicant_Name: editingApplication.Applicant_Name || '',
                Applicant_Address: editingApplication.Applicant_Address || '',
                Contact_Number: editingApplication.Contact_Number || '',
                Position_Applied: editingApplication.Position_Applied || '',
                Salary_Desired: editingApplication.Salary_Desired || 0,
                Educational_Attainment: editingApplication.Educational_Attainment || '',
                Institution_Name: editingApplication.Institution_Name || '',
                Year_Graduated: editingApplication.Year_Graduated || 0,
                Honors: editingApplication.Honors || null,
                Company_Name: editingApplication.Company_Name || '',
                Company_Location: editingApplication.Company_Location || '',
                Position: editingApplication.Position || '',
                Salary: editingApplication.Salary || 0
              };
              handleSave(updatedData);
            }}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={editingApplication.Applicant_Name || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Applicant_Name: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  value={editingApplication.Applicant_Address || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Applicant_Address: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Contact Number</label>
                <input
                  type="text"
                  value={editingApplication.Contact_Number || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Contact_Number: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Position Applied</label>
                <input
                  type="text"
                  value={editingApplication.Position_Applied || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Position_Applied: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Salary Desired</label>
                <input
                  type="number"
                  value={editingApplication.Salary_Desired || 0}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Salary_Desired: Number(e.target.value) || 0
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Education</label>
                <input
                  type="text"
                  value={editingApplication.Educational_Attainment || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Educational_Attainment: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Institution</label>
                <input
                  type="text"
                  value={editingApplication.Institution_Name || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Institution_Name: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Year Graduated</label>
                <input
                  type="number"
                  value={editingApplication.Year_Graduated || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Year_Graduated: Number(e.target.value) || 0
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Honors (Optional)</label>
                <input
                  type="text"
                  value={editingApplication.Honors || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Honors: e.target.value || null
                  })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Company Name</label>
                <input
                  type="text"
                  value={editingApplication.Company_Name || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Company_Name: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Company Location</label>
                <input
                  type="text"
                  value={editingApplication.Company_Location || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Company_Location: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Position</label>
                <input
                  type="text"
                  value={editingApplication.Position || ''}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Position: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Salary</label>
                <input
                  type="number"
                  value={editingApplication.Salary || 0}
                  onChange={(e) => setEditingApplication({
                    ...editingApplication,
                    Salary: Number(e.target.value) || 0
                  })}
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingApplication(null)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 