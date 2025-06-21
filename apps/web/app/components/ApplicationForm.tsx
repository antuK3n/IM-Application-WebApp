'use client';

import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import styles from '../apply/apply.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const validationSchema = Yup.object({
  lastName: Yup.string().required('Last name is required'),
  firstName: Yup.string().required('First name is required'),
  middleInitial: Yup.string(),
  contactNumber: Yup.string().required('Contact number is required'),
  age: Yup.number().required('Age is required').min(18, 'Must be at least 18 years old'),
  sex: Yup.string().required('Sex is required'),
  address: Yup.string().required('Address is required'),
  positionApplied: Yup.string().required('Position applied is required'),
  salaryDesired: Yup.number().required('Salary desired is required'),
  education: Yup.object({
    elementary: Yup.object({
      studentId: Yup.string(),
      institution: Yup.string().when('$educationLevel', {
        is: 'elementary',
        then: schema => schema.required('Required'),
        otherwise: schema => schema,
      }),
      yearGraduated: Yup.string().when('$educationLevel', {
        is: 'elementary',
        then: schema => schema.required('Required'),
        otherwise: schema => schema,
      }),
      honors: Yup.string(),
    }),
    secondary: Yup.object({
      studentId: Yup.string(),
      institution: Yup.string().when('$educationLevel', {
        is: (val: string) => val === 'secondary' || val === 'tertiary',
        then: schema => schema.required('Required'),
        otherwise: schema => schema,
      }),
      yearGraduated: Yup.string().when('$educationLevel', {
        is: (val: string) => val === 'secondary' || val === 'tertiary',
        then: schema => schema.required('Required'),
        otherwise: schema => schema,
      }),
      honors: Yup.string(),
    }),
    tertiary: Yup.object({
      studentId: Yup.string(),
      institution: Yup.string().when('$educationLevel', {
        is: 'tertiary',
        then: schema => schema.required('Required'),
        otherwise: schema => schema,
      }),
      yearGraduated: Yup.string().when('$educationLevel', {
        is: 'tertiary',
        then: schema => schema.required('Required'),
        otherwise: schema => schema,
      }),
      honors: Yup.string(),
    }),
  }),
  employmentType: Yup.string().required('Employment type is required'),
  employments: Yup.array().when('employmentType', (employmentType, schema) => {
    const type = Array.isArray(employmentType) ? employmentType[0] : employmentType;
    if (type === 'previous') {
      return schema.of(
        Yup.object({
          companyName: Yup.string().required('Required'),
          companyLocation: Yup.string().required('Required'),
          position: Yup.string().required('Required'),
          salary: Yup.number().typeError('Required').required('Required'),
        })
      ).min(1, 'At least one previous employment is required');
    }
    return schema.of(
      Yup.object({
        companyName: Yup.string(),
        companyLocation: Yup.string(),
        position: Yup.string(),
        salary: Yup.string(),
      })
    );
  }),
});

export default function ApplicationForm() {
  const router = useRouter();
  const [message, setMessage] = useState<{ text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [educationLevel, setEducationLevel] = useState<'none' | 'elementary' | 'secondary' | 'tertiary'>('none');
  const [employmentType, setEmploymentType] = useState<'none' | 'fresh' | 'previous'>('none');
  const [showLoading, setShowLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleEducationChange = (level: 'elementary' | 'secondary' | 'tertiary') => {
    if (educationLevel === level) {
      setEducationLevel('none');
    } else {
      setEducationLevel(level);
    }
  };

  const handleEmploymentChange = (type: 'fresh' | 'previous') => {
    setEmploymentType(type);
  };

  useEffect(() => {
    if (isSubmitting) {
      setShowLoading(true);
      setFadeOut(false);
    } else if (showLoading) {
      setFadeOut(true);
      loadingTimeout.current = setTimeout(() => {
        setShowLoading(false);
      }, 500); // match fadeOut duration
    }
    return () => {
      if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    };
  }, [isSubmitting, showLoading]);

  return (
    <div className={styles.formContainer}>
      <Formik
        initialValues={{
          lastName: '',
          firstName: '',
          middleInitial: '',
          contactNumber: '',
          age: '',
          sex: '',
          address: '',
          positionApplied: '',
          salaryDesired: '',
          education: {
            elementary: { studentId: '', institution: '', yearGraduated: '', honors: '' },
            secondary: { studentId: '', institution: '', yearGraduated: '', honors: '' },
            tertiary: { studentId: '', institution: '', yearGraduated: '', honors: '' },
          },
          employmentType: 'fresh',
          employments: [
            { employmentId: '', companyName: '', companyLocation: '', position: '', salary: '' },
          ],
        }}
        validationSchema={validationSchema}
        validateOnBlur={true}
        validateOnChange={true}
        context={{ educationLevel }}
        onSubmit={async (values, { setSubmitting, setErrors, validateForm }) => {
          setIsSubmitting(true);
          setMessage(null);
          const errors = await validateForm();
          if (Object.keys(errors).length > 0) {
            console.log('Formik validation errors:', errors);
            setIsSubmitting(false);
            return;
          }
          try {
            // Construct name from first, middle, last
            const name = `${values.firstName} ${values.middleInitial} ${values.lastName}`.trim();

            // Flatten only the selected education level
            const education = values.education;
            let educationPayload: any = {};
            if (education.elementary.institution || education.elementary.yearGraduated) {
              educationPayload = {
                educationalAttainment: 'Elementary',
                studentId: education.elementary.studentId,
                institutionName: education.elementary.institution,
                yearGraduated: education.elementary.yearGraduated,
                honors: education.elementary.honors,
              };
            } else if (education.secondary.institution || education.secondary.yearGraduated) {
              educationPayload = {
                educationalAttainment: 'Secondary',
                studentId: education.secondary.studentId,
                institutionName: education.secondary.institution,
                yearGraduated: education.secondary.yearGraduated,
                honors: education.secondary.honors,
              };
            } else if (education.tertiary.institution || education.tertiary.yearGraduated) {
              educationPayload = {
                educationalAttainment: 'Tertiary',
                studentId: education.tertiary.studentId,
                institutionName: education.tertiary.institution,
                yearGraduated: education.tertiary.yearGraduated,
                honors: education.tertiary.honors,
              };
            }

            // Only send employment if employmentType is 'previous' and not empty
            let employmentPayload: any = {};
            if (values.employmentType === 'previous' && values.employments && values.employments.length > 0) {
              const firstEmployment = values.employments[0];
              if (firstEmployment && (firstEmployment.companyName || firstEmployment.companyLocation || firstEmployment.position || firstEmployment.salary)) {
                employmentPayload = {
                  employmentId: firstEmployment.employmentId,
                  companyName: firstEmployment.companyName,
                  companyLocation: firstEmployment.companyLocation,
                  position: firstEmployment.position,
                  salary: firstEmployment.salary,
                };
              }
            }

            const payload = {
              name,
              address: values.address,
              contactNumber: values.contactNumber,
              age: values.age,
              sex: values.sex,
              positionApplied: values.positionApplied,
              salaryDesired: values.salaryDesired,
              ...educationPayload,
              ...employmentPayload,
            };
            const response = await fetch('/api/applications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to submit application');
            sessionStorage.setItem('applicantId', data.applicantId);
            sessionStorage.setItem('controlNumber', data.controlNumber);
            router.push('/success');
          } catch (error) {
            setMessage({ text: error instanceof Error ? error.message : 'Failed to submit application' });
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({ values, errors, isValid, dirty }) => {
          console.log('DEBUG: values', values);
          console.log('DEBUG: errors', errors);
          console.log('DEBUG: isSubmitting', isSubmitting, 'isValid', isValid, 'dirty', dirty);
          if (showLoading) {
            return (
              <div className={styles.customLoadingScreen + (fadeOut ? ' ' + styles.fadeOut : '')}>
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
                <div className={styles.loadingText}>Submitting...</div>
              </div>
            );
          }
          return (
            <Form className={styles.form}>
              {/* Personal Information */}
              <div className={styles.formSection}>
                <div className={styles.formSectionTitle}>Personal Information</div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <Field name="lastName" type="text" />
                    <ErrorMessage name="lastName" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
                    <Field name="firstName" type="text" />
                    <ErrorMessage name="firstName" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Middle Initial</label>
                    <Field name="middleInitial" type="text" />
                    <ErrorMessage name="middleInitial" component="div" className={styles.error} />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Contact Number</label>
                    <Field name="contactNumber" type="text" />
                    <ErrorMessage name="contactNumber" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Age</label>
                    <Field name="age" type="number" />
                    <ErrorMessage name="age" component="div" className={styles.error} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Sex</label>
                    <Field as="select" name="sex">
                      <option value="">Select</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </Field>
                    <ErrorMessage name="sex" component="div" className={styles.error} />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{ flex: 3 }}>
                    <label>Address</label>
                    <Field name="address" type="text" />
                    <ErrorMessage name="address" component="div" className={styles.error} />
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className={styles.formSection}>
                <div className={styles.formSectionTitle}>Application Details</div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Position Applied</label>
                    <Field name="positionApplied" type="text" />
                    <ErrorMessage name="positionApplied" component="div" className={styles.error} />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{ flex: 3 }}>
                    <label>Salary Desired</label>
                    <Field name="salaryDesired" type="number" />
                    <ErrorMessage name="salaryDesired" component="div" className={styles.error} />
                  </div>
                </div>
              </div>

              {/* Educational Background */}
              <div className={styles.formSection}>
                <div className={styles.formSectionTitle}>Educational Background</div>

                <div className={styles.educationCheckboxes}>
                  <button
                    type="button"
                    className={`${styles.educationButton} ${educationLevel !== 'none' ? styles.active : ''}`}
                    onClick={() => handleEducationChange('elementary')}
                  >
                    Elementary
                  </button>
                  <button
                    type="button"
                    className={`${styles.educationButton} ${educationLevel === 'secondary' || educationLevel === 'tertiary' ? styles.active : ''}`}
                    onClick={() => handleEducationChange('secondary')}
                  >
                    Secondary
                  </button>
                  <button
                    type="button"
                    className={`${styles.educationButton} ${educationLevel === 'tertiary' ? styles.active : ''}`}
                    onClick={() => handleEducationChange('tertiary')}
                  >
                    Tertiary
                  </button>
                </div>

                {/* Elementary */}
                {(educationLevel === 'elementary' || educationLevel === 'secondary' || educationLevel === 'tertiary') && (
                  <>
                    <div className={styles.formGroup} style={{ marginBottom: 8 }}>
                      <label style={{ color: '#fff', fontWeight: 700 }}>Elementary</label>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Student ID</label>
                        <Field name="education.elementary.studentId" type="text" />
                        <ErrorMessage name="education.elementary.studentId" component="div" className={styles.error} />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Year Graduated</label>
                        <Field name="education.elementary.yearGraduated" type="text" />
                        <ErrorMessage name="education.elementary.yearGraduated" component="div" className={styles.error} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Institution Name</label>
                        <Field name="education.elementary.institution" type="text" />
                        <ErrorMessage name="education.elementary.institution" component="div" className={styles.error} />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Honors/Awards</label>
                        <Field name="education.elementary.honors" type="text" />
                        <ErrorMessage name="education.elementary.honors" component="div" className={styles.error} />
                      </div>
                    </div>
                  </>
                )}

                {/* Secondary */}
                {(educationLevel === 'secondary' || educationLevel === 'tertiary') && (
                  <>
                    <div className={styles.formGroup} style={{ marginBottom: 8, marginTop: 12 }}>
                      <label style={{ color: '#fff', fontWeight: 700 }}>Secondary</label>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Student ID</label>
                        <Field name="education.secondary.studentId" type="text" />
                        <ErrorMessage name="education.secondary.studentId" component="div" className={styles.error} />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Year Graduated</label>
                        <Field name="education.secondary.yearGraduated" type="text" />
                        <ErrorMessage name="education.secondary.yearGraduated" component="div" className={styles.error} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Institution Name</label>
                        <Field name="education.secondary.institution" type="text" />
                        <ErrorMessage name="education.secondary.institution" component="div" className={styles.error} />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Honors/Awards</label>
                        <Field name="education.secondary.honors" type="text" />
                        <ErrorMessage name="education.secondary.honors" component="div" className={styles.error} />
                      </div>
                    </div>
                  </>
                )}

                {/* Tertiary */}
                {educationLevel === 'tertiary' && (
                  <>
                    <div className={styles.formGroup} style={{ marginBottom: 8, marginTop: 12 }}>
                      <label style={{ color: '#fff', fontWeight: 700 }}>Tertiary</label>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Student ID</label>
                        <Field name="education.tertiary.studentId" type="text" />
                        <ErrorMessage name="education.tertiary.studentId" component="div" className={styles.error} />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Year Graduated</label>
                        <Field name="education.tertiary.yearGraduated" type="text" />
                        <ErrorMessage name="education.tertiary.yearGraduated" component="div" className={styles.error} />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Institution Name</label>
                        <Field name="education.tertiary.institution" type="text" />
                        <ErrorMessage name="education.tertiary.institution" component="div" className={styles.error} />
                      </div>
                      <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Honors/Awards</label>
                        <Field name="education.tertiary.honors" type="text" />
                        <ErrorMessage name="education.tertiary.honors" component="div" className={styles.error} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Previous Employment */}
              <div className={styles.formSection}>
                <div className={styles.formSectionTitle}>Previous Employment</div>

                <div className={styles.educationCheckboxes}>
                  <button
                    type="button"
                    className={`${styles.educationButton} ${styles.employmentButton} ${employmentType === 'fresh' ? styles.active : ''}`}
                    onClick={() => handleEmploymentChange('fresh')}
                  >
                    Fresh Graduate
                  </button>
                  <button
                    type="button"
                    className={`${styles.educationButton} ${styles.employmentButton} ${employmentType === 'previous' ? styles.active : ''}`}
                    onClick={() => handleEmploymentChange('previous')}
                  >
                    Has Work History
                  </button>
                </div>

                {employmentType === 'previous' && (
                  <>
                    <FieldArray name="employments">
                      {({ push, remove }) => (
                        <>
                          {values.employments.map((_, index) => (
                            <div key={index}>
                              <div className={styles.formRow}>
                                <div className={styles.formGroup} style={{ flex: 1, margin: '0 auto' }}>
                                  <label>Employment ID</label>
                                  <Field name={`employments.${index}.employmentId`} type="text" />
                                  <ErrorMessage name={`employments.${index}.employmentId`} component="div" className={styles.error} />
                                </div>
                                <div className={styles.formGroup} style={{ flex: 1 }}></div>
                              </div>
                              <div className={styles.formRow}>
                                <div className={styles.formGroup} style={{ flex: 1 }}>
                                  <label>Company Name</label>
                                  <Field name={`employments.${index}.companyName`} type="text" />
                                  <ErrorMessage name={`employments.${index}.companyName`} component="div" className={styles.error} />
                                </div>
                                <div className={styles.formGroup} style={{ flex: 1 }}>
                                  <label>Company Location</label>
                                  <Field name={`employments.${index}.companyLocation`} type="text" />
                                  <ErrorMessage name={`employments.${index}.companyLocation`} component="div" className={styles.error} />
                                </div>
                              </div>
                              <div className={styles.formRow}>
                                <div className={styles.formGroup} style={{ flex: 1 }}>
                                  <label>Position</label>
                                  <Field name={`employments.${index}.position`} type="text" />
                                  <ErrorMessage name={`employments.${index}.position`} component="div" className={styles.error} />
                                </div>
                                <div className={styles.formGroup} style={{ flex: 1 }}>
                                  <label>Salary</label>
                                  <Field name={`employments.${index}.salary`} type="text" />
                                  <ErrorMessage name={`employments.${index}.salary`} component="div" className={styles.error} />
                                </div>
                              </div>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className={styles.removeButton}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <div className={styles.addEmploymentContainer}>
                            <button
                              type="button"
                              onClick={() => push({ employmentId: '', companyName: '', companyLocation: '', position: '', salary: '' })}
                              className={styles.addButton}
                            >
                              <span className={styles.plusIcon}>+</span>
                            </button>
                            <span className={styles.addEmploymentText}>Add Previous Employment</span>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className={styles.buttonRow}>
                <button type="button" className={styles.backBtn} onClick={() => router.back()}>Back</button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
              {message && (
                <div className={styles.error} style={{ marginTop: 16 }}>{message.text}</div>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
