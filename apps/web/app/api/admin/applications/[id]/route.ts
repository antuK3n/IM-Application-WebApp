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

  try {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Update applicant information
      await connection.execute(
        `UPDATE applicant_info SET 
          Applicant_Name = ?,
          Applicant_Address = ?,
          Contact_Number = ?,
          Age = ?,
          Sex = ?
        WHERE Applicant_ID = ?`,
        [
          data.Applicant_Name,
          data.Applicant_Address,
          data.Contact_Number,
          data.Age,
          data.Sex,
          id,
        ]
      );

      // Update application information
      await connection.execute(
        `UPDATE application_info SET 
          Position_Applied = ?,
          Salary_Desired = ?
        WHERE Applicant_ID = ?`,
        [data.Position_Applied, data.Salary_Desired, id]
      );

      // Update education information
      await connection.execute(
        `UPDATE education_info SET 
          Educational_Attainment = ?,
          Institution_Name = ?,
          Year_Graduated = ?,
          Honors = ?
        WHERE Applicant_ID = ?`,
        [
          data.Educational_Attainment,
          data.Institution_Name,
          data.Year_Graduated,
          data.Honors,
          id,
        ]
      );

      // Update job information
      await connection.execute(
        `UPDATE job_info SET 
          Company_Name = ?,
          Company_Location = ?,
          Position = ?,
          Salary = ?
        WHERE Applicant_ID = ?`,
        [
          data.Company_Name,
          data.Company_Location,
          data.Position,
          data.Salary,
          id,
        ]
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
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
