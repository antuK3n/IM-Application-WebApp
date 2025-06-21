import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET() {
  try {
    const connection = await pool.getConnection();

    try {
      // Fetch all applicants with their application info
      const [applicants] = await connection.execute(`
        SELECT 
          a.Applicant_ID,
          a.Applicant_Name,
          a.Applicant_Address,
          a.Contact_Number,
          a.Age,
          a.Sex,
          app.Control_Number,
          app.Position_Applied,
          app.Salary_Desired
        FROM applicant_info a
        JOIN application_info app ON a.Applicant_ID = app.Applicant_ID
        ORDER BY a.Applicant_ID DESC
      `);

      // For each applicant, fetch their education and job info as arrays
      const applications = await Promise.all((applicants as any[]).map(async (applicant) => {
        // Fetch education
        const [education] = await connection.execute(
          `SELECT Educational_Attainment, Institution_Name, Year_Graduated, Honors FROM education_info WHERE Applicant_ID = ?`,
          [applicant.Applicant_ID]
        );
        // Fetch jobs
        const [jobs] = await connection.execute(
          `SELECT Company_Name, Company_Location, Position, Salary FROM job_info WHERE Applicant_ID = ?`,
          [applicant.Applicant_ID]
        );
        return {
          ...applicant,
          education: education as any[],
          jobs: jobs as any[],
        };
      }));

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
