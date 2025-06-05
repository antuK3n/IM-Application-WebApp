'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  contactNumber: Yup.string().required('Contact number is required'),
  age: Yup.number().required('Age is required').min(18, 'Must be at least 18 years old'),
  sex: Yup.string().required('Sex is required'),
  positionApplied: Yup.string().required('Position applied is required'),
  salaryDesired: Yup.number().required('Salary desired is required'),
  educationalAttainment: Yup.string().required('Educational attainment is required'),
  institutionName: Yup.string().required('Institution name is required'),
  yearGraduated: Yup.number().required('Year graduated is required'),
  honors: Yup.string(),
  companyName: Yup.string().required('Company name is required'),
  companyLocation: Yup.string().required('Company location is required'),
  position: Yup.string().required('Position is required'),
  salary: Yup.number().required('Salary is required'),
});

export default function ApplicationForm() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className={styles.formContainer}>
      <Formik
        initialValues={{
          name: '',
          address: '',
          contactNumber: '',
          age: '',
          sex: '',
          positionApplied: '',
          salaryDesired: '',
          educationalAttainment: '',
          institutionName: '',
          yearGraduated: '',
          honors: '',
          companyName: '',
          companyLocation: '',
          position: '',
          salary: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          setIsSubmitting(true);
          setMessage(null);
          try {
            const response = await fetch('/api/applications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || 'Failed to submit application');
            }

            // Store the applicant ID and control number in session storage
            sessionStorage.setItem('applicantId', data.applicantId);
            sessionStorage.setItem('controlNumber', data.controlNumber);

            router.push('/success');
          } catch (error) {
            setMessage({
              type: 'error',
              text: error instanceof Error ? error.message : 'Failed to submit application',
            });
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({ values }) => (
          <Form className={styles.form}>
            {message && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <div className={styles.formSection}>
              <h2>Personal Information</h2>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <Field type="text" id="address" name="address" />
                <ErrorMessage name="address" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contactNumber">Contact Number</label>
                <Field type="text" id="contactNumber" name="contactNumber" />
                <ErrorMessage name="contactNumber" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="age">Age</label>
                <Field type="number" id="age" name="age" />
                <ErrorMessage name="age" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sex">Sex</label>
                <Field as="select" id="sex" name="sex">
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </Field>
                <ErrorMessage name="sex" component="div" className={styles.error} />
              </div>
            </div>

            <div className={styles.formSection}>
              <h2>Application Details</h2>
              <div className={styles.formGroup}>
                <label htmlFor="positionApplied">Position Applied</label>
                <Field type="text" id="positionApplied" name="positionApplied" />
                <ErrorMessage name="positionApplied" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="salaryDesired">Salary Desired</label>
                <Field type="number" id="salaryDesired" name="salaryDesired" />
                <ErrorMessage name="salaryDesired" component="div" className={styles.error} />
              </div>
            </div>

            <div className={styles.formSection}>
              <h2>Educational Background</h2>
              <div className={styles.formGroup}>
                <label htmlFor="educationalAttainment">Educational Attainment</label>
                <Field type="text" id="educationalAttainment" name="educationalAttainment" />
                <ErrorMessage name="educationalAttainment" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="institutionName">Institution Name</label>
                <Field type="text" id="institutionName" name="institutionName" />
                <ErrorMessage name="institutionName" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="yearGraduated">Year Graduated</label>
                <Field type="number" id="yearGraduated" name="yearGraduated" />
                <ErrorMessage name="yearGraduated" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="honors">Honors/Awards</label>
                <Field type="text" id="honors" name="honors" />
                <ErrorMessage name="honors" component="div" className={styles.error} />
              </div>
            </div>

            <div className={styles.formSection}>
              <h2>Previous Employment</h2>
              <div className={styles.formGroup}>
                <label htmlFor="companyName">Company Name</label>
                <Field type="text" id="companyName" name="companyName" />
                <ErrorMessage name="companyName" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="companyLocation">Company Location</label>
                <Field type="text" id="companyLocation" name="companyLocation" />
                <ErrorMessage name="companyLocation" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="position">Position</label>
                <Field type="text" id="position" name="position" />
                <ErrorMessage name="position" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="salary">Salary</label>
                <Field type="number" id="salary" name="salary" />
                <ErrorMessage name="salary" component="div" className={styles.error} />
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
