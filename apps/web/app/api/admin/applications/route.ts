import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET() {
  try {
    const connection = await pool.getConnection();

    try {
      const [applications] = await connection.execute(`
        SELECT 
          a.Applicant_ID,
          a.Applicant_Name,
          a.Contact_Number,
          a.Age,
          a.Sex,
          app.Control_Number,
          app.Position_Applied,
          app.Salary_Desired,
          e.Educational_Attainment,
          e.Institution_Name,
          e.Year_Graduated,
          e.Honors,
          j.Company_Name,
          j.Company_Location,
          j.Position,
          j.Salary
        FROM applicant_info a
        JOIN application_info app ON a.Applicant_ID = app.Applicant_ID
        JOIN education_info e ON a.Applicant_ID = e.Applicant_ID
        JOIN job_info j ON a.Applicant_ID = j.Applicant_ID
        ORDER BY a.Applicant_ID DESC
      `);

      return NextResponse.json({ applications });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
