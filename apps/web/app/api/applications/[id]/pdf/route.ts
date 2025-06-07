import { NextResponse } from "next/server";
import pool from "../../../../../lib/db";
import PDFDocument from "pdfkit";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function executeWithRetry(query: string, params: any[]) {
  let lastError;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const connection = await pool.getConnection();
      try {
        const [results] = await connection.execute(query, params);
        return results;
      } finally {
        connection.release();
      }
    } catch (error) {
      lastError = error;
      if (i < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  throw lastError;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const applications = await executeWithRetry(`
      SELECT 
        a.Applicant_ID,
        a.Applicant_Name,
        a.Applicant_Address,
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
      WHERE a.Applicant_ID = ?
    `, [id]);

    if (!applications || (applications as any[]).length === 0) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const application = (applications as any[])[0];

    // Create a PDF document
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    
    // Add content to the PDF
    doc.fontSize(20).text('Application Form', { align: 'center' });
    doc.moveDown();

    // Personal Information
    doc.fontSize(16).text('Personal Information');
    doc.fontSize(12);
    doc.text(`Name: ${application.Applicant_Name}`);
    doc.text(`Address: ${application.Applicant_Address}`);
    doc.text(`Contact Number: ${application.Contact_Number}`);
    doc.text(`Age: ${application.Age}`);
    doc.text(`Sex: ${application.Sex === 'M' ? 'Male' : 'Female'}`);
    doc.moveDown();

    // Application Details
    doc.fontSize(16).text('Application Details');
    doc.fontSize(12);
    doc.text(`Position Applied: ${application.Position_Applied}`);
    doc.text(`Salary Desired: $${application.Salary_Desired}`);
    doc.moveDown();

    // Educational Background
    doc.fontSize(16).text('Educational Background');
    doc.fontSize(12);
    doc.text(`Educational Attainment: ${application.Educational_Attainment}`);
    doc.text(`Institution: ${application.Institution_Name}`);
    doc.text(`Year Graduated: ${application.Year_Graduated}`);
    if (application.Honors) {
      doc.text(`Honors: ${application.Honors}`);
    }
    doc.moveDown();

    // Previous Employment
    doc.fontSize(16).text('Previous Employment');
    doc.fontSize(12);
    doc.text(`Company: ${application.Company_Name}`);
    doc.text(`Location: ${application.Company_Location}`);
    doc.text(`Position: ${application.Position}`);
    doc.text(`Salary: $${application.Salary}`);
    doc.moveDown();

    // Application Reference
    doc.fontSize(14).text('Application Reference', { align: 'center' });
    doc.fontSize(12);
    doc.text(`Applicant ID: ${application.Applicant_ID}`, { align: 'center' });
    doc.text(`Control Number: ${application.Control_Number}`, { align: 'center' });

    // Finalize the PDF
    doc.end();

    // Wait for the PDF to be generated
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="application-${application.Applicant_ID}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    );
  }
} 