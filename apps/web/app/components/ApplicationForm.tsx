import { Formik, Form, Field } from 'formik';
import styles from '../page.module.css';

export default function ApplicationForm() {
  return (
    <div className={styles.formContainer}>
      <Formik
        initialValues={{
          source: '',
          position1: '',
          position2: '',
          salary: '',
          surname: '',
          firstName: '',
          middleName: '',
          nickname: '',
          presentAddress: '',
          provincialAddress: '',
          contactTel: '',
          contactCell: '',
          contactEmail: '',
          age: '',
          birthdate: '',
          birthplace: '',
          sex: '',
          height: '',
          weight: '',
          sss: '',
          pagibig: '',
          tin: '',
          gsis: '',
          philhealth: '',
          civilStatus: '',
          residence: '',
          languages: '',
          hobbies: '',
          skills: '',
          qualifications: '',
          willingToAssign: '',
          preferredLocation: '',
        }}
        onSubmit={(values) => {
          console.log('Form submitted:', values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Application Information</h2>
              <div className={styles.formGroup}>
                <label>Source</label>
                <Field name="source" placeholder="Website / Walk-in / Jobfair / Referral" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Position Applied For (1st Choice)</label>
                  <Field name="position1" placeholder="1st Choice" />
                </div>
                <div className={styles.formGroup}>
                  <label>Position Applied For (2nd Choice)</label>
                  <Field name="position2" placeholder="2nd Choice" />
                </div>
                <div className={styles.formGroup}>
                  <label>Salary Desired</label>
                  <Field name="salary" placeholder="Salary Desired" />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Surname</label>
                  <Field name="surname" placeholder="Surname" />
                </div>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <Field name="firstName" placeholder="First Name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Middle Name</label>
                  <Field name="middleName" placeholder="Middle Name" />
                </div>
                <div className={styles.formGroup}>
                  <label>Nickname</label>
                  <Field name="nickname" placeholder="Nickname" />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              <div className={styles.formGroup}>
                <label>Present Address</label>
                <Field name="presentAddress" placeholder="Full Address" />
              </div>
              <div className={styles.formGroup}>
                <label>Provincial Address</label>
                <Field name="provincialAddress" placeholder="Full Address" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Telephone</label>
                  <Field name="contactTel" placeholder="Telephone" />
                </div>
                <div className={styles.formGroup}>
                  <label>Cellphone</label>
                  <Field name="contactCell" placeholder="Cellphone" />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <Field name="contactEmail" placeholder="Email" />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Personal Details</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Age</label>
                  <Field name="age" placeholder="Age" />
                </div>
                <div className={styles.formGroup}>
                  <label>Birthdate</label>
                  <Field name="birthdate" placeholder="Birthdate" />
                </div>
                <div className={styles.formGroup}>
                  <label>Birthplace</label>
                  <Field name="birthplace" placeholder="Birthplace" />
                </div>
                <div className={styles.formGroup}>
                  <label>Sex</label>
                  <Field name="sex" placeholder="Sex" />
                </div>
                <div className={styles.formGroup}>
                  <label>Height</label>
                  <Field name="height" placeholder="Height" />
                </div>
                <div className={styles.formGroup}>
                  <label>Weight</label>
                  <Field name="weight" placeholder="Weight" />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Government IDs</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>SSS No.</label>
                  <Field name="sss" placeholder="SSS No." />
                </div>
                <div className={styles.formGroup}>
                  <label>Pag-ibig No.</label>
                  <Field name="pagibig" placeholder="Pag-ibig No." />
                </div>
                <div className={styles.formGroup}>
                  <label>TIN</label>
                  <Field name="tin" placeholder="TIN" />
                </div>
                <div className={styles.formGroup}>
                  <label>GSIS No.</label>
                  <Field name="gsis" placeholder="GSIS No." />
                </div>
                <div className={styles.formGroup}>
                  <label>Philhealth No.</label>
                  <Field name="philhealth" placeholder="Philhealth No." />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Additional Information</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Civil Status</label>
                  <Field as="select" name="civilStatus">
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Annulled">Annulled</option>
                    <option value="Separated">Separated</option>
                    <option value="Widowed">Widowed</option>
                  </Field>
                </div>
                <div className={styles.formGroup}>
                  <label>Residence Type</label>
                  <Field as="select" name="residence">
                    <option value="">Select</option>
                    <option value="Own">Staying at own house</option>
                    <option value="Renting">Renting</option>
                    <option value="Relatives">Staying with Relatives</option>
                  </Field>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Languages / Dialects Spoken</label>
                <Field name="languages" />
              </div>
              <div className={styles.formGroup}>
                <label>Interests / Hobbies</label>
                <Field name="hobbies" />
              </div>
              <div className={styles.formGroup}>
                <label>Other Skills</label>
                <Field name="skills" placeholder="Can operate/use machines/software/etc." />
              </div>
              <div className={styles.formGroup}>
                <label>Qualifications / Articles / Books</label>
                <Field name="qualifications" />
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Assignment Preferences</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Willing to be assigned in province?</label>
                  <Field as="select" name="willingToAssign">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Field>
                </div>
                <div className={styles.formGroup}>
                  <label>Preferred Location</label>
                  <Field name="preferredLocation" placeholder="If yes, preferred location" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}>Submit Application</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
