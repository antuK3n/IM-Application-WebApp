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

      // Handle education information - insert if doesn't exist, update if it does
      if (
        data.Educational_Attainment ||
        data.Institution_Name ||
        data.Year_Graduated
      ) {
        await connection.execute(
          `INSERT INTO education_info (
            Student_ID, Applicant_ID, Educational_Attainment, Institution_Name, 
            Year_Graduated, Honors
          ) VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            Educational_Attainment = VALUES(Educational_Attainment),
            Institution_Name = VALUES(Institution_Name),
            Year_Graduated = VALUES(Year_Graduated),
            Honors = VALUES(Honors)`,
          [
            id, // Use Applicant_ID as Student_ID for simplicity
            id,
            data.Educational_Attainment || null,
            data.Institution_Name || null,
            data.Year_Graduated || null,
            data.Honors || null,
          ]
        );
      }

      // Handle job information - insert if doesn't exist, update if it does
      if (
        data.Company_Name ||
        data.Position ||
        data.Company_Location ||
        data.Salary
      ) {
        await connection.execute(
          `INSERT INTO job_info (
            Employment_ID, Applicant_ID, Company_Name, Company_Location, 
            Position, Salary
          ) VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            Company_Name = VALUES(Company_Name),
            Company_Location = VALUES(Company_Location),
            Position = VALUES(Position),
            Salary = VALUES(Salary)`,
          [
            id, // Use Applicant_ID as Employment_ID for simplicity
            id,
            data.Company_Name || null,
            data.Company_Location || null,
            data.Position || null,
            data.Salary || null,
          ]
        );
      }

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
