import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [latestIdResult] = await connection.execute(
        "SELECT MAX(CAST(Applicant_ID AS UNSIGNED)) as maxId FROM applicant_info"
      );
      const latestId = (latestIdResult as any)[0]?.maxId || 0;
      const newApplicantId = (latestId + 1).toString().padStart(3, "0");

      await connection.execute(
        `INSERT INTO applicant_info (
          Applicant_ID, Applicant_Name, Applicant_Address, 
          Contact_Number, Age, Sex
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newApplicantId,
          data.name,
          data.address,
          data.contactNumber,
          data.age,
          data.sex,
        ]
      );

      const controlNumber = `${newApplicantId}${Date.now().toString().slice(-3)}`;

      await connection.execute(
        `INSERT INTO application_info (
          ApplicantForm_ID, Applicant_ID, Control_Number, Position_Applied, Salary_Desired
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          newApplicantId,
          newApplicantId,
          controlNumber,
          data.positionApplied,
          data.salaryDesired,
        ]
      );

      await connection.execute(
        `INSERT INTO education_info (
          Student_ID, Applicant_ID, Educational_Attainment, Institution_Name, 
          Year_Graduated, Honors
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newApplicantId,
          newApplicantId,
          data.educationalAttainment,
          data.institutionName,
          data.yearGraduated,
          data.honors || null,
        ]
      );

      await connection.execute(
        `INSERT INTO job_info (
          Employment_ID, Applicant_ID, Company_Name, Company_Location, 
          Position, Salary
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newApplicantId,
          newApplicantId,
          data.companyName,
          data.companyLocation,
          data.position,
          data.salary,
        ]
      );

      await connection.commit();

      return NextResponse.json({
        success: true,
        controlNumber,
        applicantId: newApplicantId,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
