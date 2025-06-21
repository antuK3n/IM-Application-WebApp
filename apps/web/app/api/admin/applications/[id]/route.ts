import { NextResponse } from "next/server";
import pool from "../../../../../lib/db";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Delete from all related tables
      await connection.execute("DELETE FROM job_info WHERE Applicant_ID = ?", [
        id,
      ]);

      await connection.execute(
        "DELETE FROM education_info WHERE Applicant_ID = ?",
        [id]
      );

      await connection.execute(
        "DELETE FROM application_info WHERE Applicant_ID = ?",
        [id]
      );

      await connection.execute(
        "DELETE FROM applicant_info WHERE Applicant_ID = ?",
        [id]
      );

      await connection.commit();
      return NextResponse.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await request.json();
  const { education = [], jobs = [], ...applicantData } = data;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update applicant_info table
    await connection.execute(
      `UPDATE applicant_info SET 
        Applicant_Name = ?, Applicant_Address = ?, Contact_Number = ?,
        Age = ?, Sex = ?
      WHERE Applicant_ID = ?`,
      [
        applicantData.Applicant_Name,
        applicantData.Applicant_Address,
        applicantData.Contact_Number,
        applicantData.Age,
        applicantData.Sex,
        id,
      ]
    );

    // 2. Update application_info table
    await connection.execute(
      `UPDATE application_info SET 
        Position_Applied = ?, Salary_Desired = ?
      WHERE Applicant_ID = ?`,
      [applicantData.Position_Applied, applicantData.Salary_Desired, id]
    );

    // 3. Delete existing education and job info
    await connection.execute(
      "DELETE FROM education_info WHERE Applicant_ID = ?",
      [id]
    );
    await connection.execute("DELETE FROM job_info WHERE Applicant_ID = ?", [
      id,
    ]);

    // 4. Insert new education info
    if (education.length > 0) {
      const educationValues = education
        .filter(
          (edu: any) => edu.Educational_Attainment && edu.Institution_Name
        )
        .map((edu: any, index: number) => [
          id, // Applicant_ID
          edu.Student_ID && !edu.Student_ID.startsWith("new-")
            ? edu.Student_ID
            : `${id}-${Date.now()}-${index}`,
          edu.Educational_Attainment,
          edu.Institution_Name,
          edu.Year_Graduated,
          edu.Honors,
        ]);

      if (educationValues.length > 0) {
        await connection.query(
          `INSERT INTO education_info (
            Applicant_ID, Student_ID, Educational_Attainment, Institution_Name, 
            Year_Graduated, Honors
          ) VALUES ?`,
          [educationValues]
        );
      }
    }

    // 5. Insert new job info
    if (jobs.length > 0) {
      const jobValues = jobs
        .filter((job: any) => job.Company_Name && job.Position)
        .map((job: any, index: number) => [
          id, // Applicant_ID
          job.Employment_ID && !job.Employment_ID.startsWith("new-")
            ? job.Employment_ID
            : `${id}-${Date.now()}-${index}`,
          job.Company_Name,
          job.Company_Location,
          job.Position,
          job.Salary,
        ]);

      if (jobValues.length > 0) {
        await connection.query(
          `INSERT INTO job_info (
            Applicant_ID, Employment_ID, Company_Name, Company_Location, 
            Position, Salary
          ) VALUES ?`,
          [jobValues]
        );
      }
    }

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
