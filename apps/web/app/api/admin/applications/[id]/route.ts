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
