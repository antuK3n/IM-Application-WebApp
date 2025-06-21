'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import Link from 'next/link';
import Image from 'next/image';

interface Education {
  Student_ID: string;
  Educational_Attainment: string;
  Institution_Name: string;
  Year_Graduated: number;
  Honors: string | null;
}

interface Job {
  Employment_ID: string;
  Company_Name: string;
  Company_Location: string;
  Position: string;
  Salary: number;
}

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
  education: Education[];
  jobs: Job[];
}

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [sortField, setSortField] = useState<'Applicant_ID' | 'Applicant_Name'>('Applicant_ID');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const loadingTexts = ['Loading.', 'Loading..', 'Loading...'];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

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
    // Use a deep copy to prevent modifying the original state directly
    const applicationCopy = JSON.parse(JSON.stringify(application));
    setEditingApplication(applicationCopy);
  };

  const handleFieldChange = (field: keyof Application, value: any) => {
    if (!editingApplication) return;
    setEditingApplication({
      ...editingApplication,
      [field]: value,
    });
  };

  const handleNestedChange = (
    listName: 'education' | 'jobs',
    index: number,
    field: keyof Education | keyof Job,
    value: any
  ) => {
    if (!editingApplication) return;

    const updatedList = [...(editingApplication[listName] as any[])];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };

    setEditingApplication({
      ...editingApplication,
      [listName]: updatedList,
    });
  };

  const addListItem = (listName: 'education' | 'jobs') => {
    if (!editingApplication) return;

    const newItem =
      listName === 'education'
        ? {
            Student_ID: `new-${Date.now()}`,
            Educational_Attainment: '',
            Institution_Name: '',
            Year_Graduated: 0,
            Honors: '',
          }
        : {
            Employment_ID: `new-${Date.now()}`,
            Company_Name: '',
            Company_Location: '',
            Position: '',
            Salary: 0,
          };

    setEditingApplication({
      ...editingApplication,
      [listName]: [...(editingApplication[listName] as any[]), newItem],
    });
  };

  const removeListItem = (listName: 'education' | 'jobs', index: number) => {
    if (!editingApplication) return;

    const updatedList = (editingApplication[listName] as any[]).filter(
      (_, i) => i !== index
    );

    setEditingApplication({
      ...editingApplication,
      [listName]: updatedList,
    });
  };

  const handleSave = async () => {
    if (!editingApplication) return;

    setSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/applications/${editingApplication.Applicant_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingApplication),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update application');
      }

      // Refresh the applications list
      await fetchApplications();
      setEditingApplication(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update application');
    } finally {
      setSaving(false);
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
    return (
      <div className={styles.customLoadingScreen}>
        <div className={styles.loadingLogoWrapper}>
          <Image
            src="/logo.png"
            alt="DOE Logo"
            width={100}
            height={100}
            className={styles.spinningLogo}
            priority
          />
        </div>
        <div className={styles.loadingText}>{loadingTexts[loadingTextIndex]}</div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo} style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 0, width: '100%', textAlign: 'center' }}>
          <img src="/logo.png" alt="DOE Logo" style={{ width: 40, height: 40, marginBottom: 6 }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 400, lineHeight: 1.4, color: '#fff', display: 'block', margin: 0, padding: 0 }}>
            REPUBLIC OF THE PHILIPPINES<br />
            TAGUIG CITY, PHILIPPINES 1632<br />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'block', lineHeight: 1.4, margin: '6px 0 0 0', padding: 0 }}>
              Department of Energy
            </span>
          </span>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/admin" className={styles.active}>
            <i className="fi fi-br-document"></i>
            <span>Applications</span>
          </Link>
          <Link href="/">
            <i className="fi fi-br-home"></i>
            <span>Home</span>
          </Link>
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
            {filteredAndSortedApplications.map((app: Application) => (
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
                  {app.education && app.education.length > 0 ? (
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {app.education.map((edu: Education, idx: number) => (
                        <li key={idx}>
                          <strong>{edu.Educational_Attainment}</strong>
                          {edu.Institution_Name && (
                            <> at {edu.Institution_Name}</>
                          )}
                          {edu.Year_Graduated && (
                            <> ({edu.Year_Graduated})</>
                          )}
                          {edu.Honors && edu.Honors.trim() !== '' && (
                            <><br /><small>Honors: {edu.Honors}</small></>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>None</span>
                  )}
                </td>
                <td>
                  {app.jobs && app.jobs.length > 0 ? (
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {app.jobs.map((job: Job, idx: number) => (
                        <li key={idx}>
                          <strong>{job.Position}</strong>
                          {job.Company_Name && (
                            <> at {job.Company_Name}</>
                          )}
                          {job.Company_Location && (
                            <><br /><small>{job.Company_Location}</small></>
                          )}
                          {job.Salary && (
                            <><br /><small>Salary: ${job.Salary}</small></>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>None</span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
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
                  </div>
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
            {error && (
              <div className={styles.errorBanner}>
                {error}
              </div>
            )}
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}>
              {/* Personal Info */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Name *</label>
                  <input
                    type="text"
                    value={editingApplication.Applicant_Name}
                    onChange={(e) => handleFieldChange('Applicant_Name', e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Age *</label>
                  <input
                    type="number"
                    value={editingApplication.Age}
                    onChange={(e) => handleFieldChange('Age', Number(e.target.value))}
                    required
                    min="18"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Sex *</label>
                  <select
                    value={editingApplication.Sex}
                    onChange={(e) => handleFieldChange('Sex', e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Address *</label>
                <input
                  type="text"
                  value={editingApplication.Applicant_Address}
                  onChange={(e) => handleFieldChange('Applicant_Address', e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Contact Number *</label>
                <input
                  type="text"
                  value={editingApplication.Contact_Number}
                  onChange={(e) => handleFieldChange('Contact_Number', e.target.value)}
                  required
                />
              </div>

              {/* Application Details */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Position Applied *</label>
                  <input
                    type="text"
                    value={editingApplication.Position_Applied}
                    onChange={(e) => handleFieldChange('Position_Applied', e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Salary Desired *</label>
                  <input
                    type="number"
                    value={editingApplication.Salary_Desired}
                    onChange={(e) => handleFieldChange('Salary_Desired', Number(e.target.value))}
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Educational Background */}
              <div className={styles.formSection}>
                <div className={styles.formSectionHeader}>
                  <h3>Educational Background</h3>
                  <button type="button" onClick={() => addListItem('education')} className={styles.addButton}>
                    + Add Education
                  </button>
                </div>
                {editingApplication.education.map((edu, index) => (
                  <div key={index} className={styles.formSubSection}>
                    <div className={styles.formSubSectionHeader}>
                      <h4>Education #{index + 1}</h4>
                      <button type="button" onClick={() => removeListItem('education', index)} className={styles.removeButton}>
                        Remove
                      </button>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Educational Attainment</label>
                        <input
                          type="text"
                          value={edu.Educational_Attainment || ''}
                          onChange={(e) => handleNestedChange('education', index, 'Educational_Attainment', e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Institution</label>
                        <input
                          type="text"
                          value={edu.Institution_Name || ''}
                          onChange={(e) => handleNestedChange('education', index, 'Institution_Name', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Year Graduated</label>
                        <input
                          type="number"
                          value={edu.Year_Graduated || ''}
                          onChange={(e) => handleNestedChange('education', index, 'Year_Graduated', Number(e.target.value))}
                          min="1900"
                          max={new Date().getFullYear() + 10}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Honors</label>
                        <input
                          type="text"
                          value={edu.Honors || ''}
                          onChange={(e) => handleNestedChange('education', index, 'Honors', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Previous Employment */}
              <div className={styles.formSection}>
                <div className={styles.formSectionHeader}>
                  <h3>Previous Employment</h3>
                  <button type="button" onClick={() => addListItem('jobs')} className={styles.addButton}>
                    + Add Employment
                  </button>
                </div>
                {editingApplication.jobs.map((job, index) => (
                  <div key={index} className={styles.formSubSection}>
                    <div className={styles.formSubSectionHeader}>
                      <h4>Employment #{index + 1}</h4>
                      <button type="button" onClick={() => removeListItem('jobs', index)} className={styles.removeButton}>
                        Remove
                      </button>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Company Name</label>
                        <input
                          type="text"
                          value={job.Company_Name || ''}
                          onChange={(e) => handleNestedChange('jobs', index, 'Company_Name', e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Company Location</label>
                        <input
                          type="text"
                          value={job.Company_Location || ''}
                          onChange={(e) => handleNestedChange('jobs', index, 'Company_Location', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Position</label>
                        <input
                          type="text"
                          value={job.Position || ''}
                          onChange={(e) => handleNestedChange('jobs', index, 'Position', e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Salary</label>
                        <input
                          type="number"
                          value={job.Salary || ''}
                          onChange={(e) => handleNestedChange('jobs', index, 'Salary', Number(e.target.value))}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingApplication(null);
                    setError(null);
                  }}
                  className={styles.cancelButton}
                  disabled={saving}
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