# Job Application Site - Backend Architecture Overview

## 🏗️ System Architecture

This job application system is built using **Next.js 15** with the App Router, featuring a modern full-stack architecture that combines frontend and backend functionality in a single application. The system follows a **monorepo structure** using Turborepo for efficient development and deployment.

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MySQL 8.0+
- **Database Driver**: mysql2 (Promise-based)
- **PDF Generation**: PDFKit
- **Form Handling**: Formik + Yup validation
- **Authentication**: Cookie-based session management
- **Deployment**: Vercel-ready configuration

## 🗄️ Database Design

The system uses a **relational MySQL database** with four interconnected tables:

### Core Tables Structure

1. **`applicant_info`** - Personal Information

   - `Applicant_ID` (Primary Key, VARCHAR)
   - `Applicant_Name`
   - `Applicant_Address`
   - `Contact_Number`
   - `Age`
   - `Sex`

2. **`application_info`** - Application Details

   - `ApplicantForm_ID`
   - `Applicant_ID` (Foreign Key)
   - `Control_Number` (Auto-generated)
   - `Position_Applied`
   - `Salary_Desired`

3. **`education_info`** - Educational Background

   - `Student_ID`
   - `Applicant_ID` (Foreign Key)
   - `Educational_Attainment`
   - `Institution_Name`
   - `Year_Graduated`
   - `Honors`

4. **`job_info`** - Previous Employment
   - `Employment_ID`
   - `Applicant_ID` (Foreign Key)
   - `Company_Name`
   - `Company_Location`
   - `Position`
   - `Salary`

### Database Connection

```typescript
// lib/db.ts
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
```

## 🔌 API Endpoints

### Public Endpoints

#### 1. Application Submission

**POST** `/api/applications`

- **Purpose**: Submit new job applications
- **Features**:
  - Auto-generates unique Applicant_ID (3-digit format)
  - Creates control number with timestamp
  - Handles optional education and employment data
  - Uses database transactions for data integrity
  - Returns control number for tracking

```typescript
// Key Implementation Details:
- Transaction-based operations
- Auto-incrementing ID generation
- Conditional data insertion
- Comprehensive error handling
```

#### 2. PDF Generation

**GET** `/api/applications/[id]/pdf`

- **Purpose**: Generate downloadable PDF of application
- **Features**:
  - Retry mechanism for database operations
  - Professional PDF formatting
  - Complete application data compilation
  - Proper HTTP headers for download

### Admin Endpoints

#### 1. Admin Authentication

**POST** `/api/admin/login`

- **Purpose**: Authenticate admin users
- **Security Features**:
  - Environment variable-based credentials
  - HTTP-only cookies
  - Secure token generation
  - 24-hour session duration

#### 2. Application Management

**GET** `/api/admin/applications`

- **Purpose**: Retrieve all applications for admin dashboard
- **Features**:
  - Joins multiple tables for complete data
  - Nested education and job history
  - Ordered by newest applications first

**PUT** `/api/admin/applications/[id]`

- **Purpose**: Update application details
- **Features**:
  - Transaction-based updates
  - Comprehensive data validation
  - Rollback on errors

**DELETE** `/api/admin/applications/[id]`

- **Purpose**: Remove applications
- **Features**:
  - Cascading deletes across all related tables
  - Transaction safety
  - Proper cleanup

## 🔒 Security Implementation

### Authentication & Authorization

1. **Cookie-based Sessions**: Uses HTTP-only cookies for admin authentication
2. **Middleware Protection**: Route-level authentication for admin pages
3. **Environment Variables**: Secure credential storage
4. **Input Validation**: Formik + Yup schema validation

### Database Security

1. **Connection Pooling**: Efficient resource management
2. **Parameterized Queries**: SQL injection prevention
3. **Transaction Management**: Data integrity protection
4. **Error Handling**: Graceful failure management

### Middleware Implementation

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get("adminToken");
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return NextResponse.next();
}
```

## 📊 Data Flow Architecture

### Application Submission Flow

1. **Form Validation** → Formik + Yup client-side validation
2. **API Processing** → Transaction-based database operations
3. **ID Generation** → Auto-incrementing with custom formatting
4. **Data Storage** → Multi-table insertion with foreign keys
5. **Response** → Control number and confirmation

### Admin Management Flow

1. **Authentication** → Cookie-based session verification
2. **Data Retrieval** → Complex JOIN queries for complete data
3. **CRUD Operations** → Transaction-safe database modifications
4. **PDF Generation** → Server-side PDF creation with retry logic

## 🚀 Performance Optimizations

### Database Optimizations

- **Connection Pooling**: Efficient database connection management
- **Retry Logic**: Automatic retry for transient database failures
- **Indexed Queries**: Optimized JOIN operations
- **Transaction Management**: Batch operations for consistency

### API Optimizations

- **Error Boundaries**: Comprehensive error handling
- **Response Caching**: Efficient data retrieval
- **Streaming**: PDF generation with memory efficiency
- **Validation**: Multi-layer input validation

## 🔧 Development & Deployment

### Environment Configuration

```bash
# Required Environment Variables
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
ADMIN_USERNAME=admin-username
ADMIN_PASSWORD=admin-password
```

### Build & Deployment

- **Development**: `yarn dev` with Turbopack for fast refresh
- **Production**: `yarn build` optimized for Vercel deployment
- **Type Safety**: TypeScript configuration with strict checking
- **Linting**: ESLint with custom configurations

## 📈 Scalability Considerations

### Current Architecture Strengths

1. **Modular Design**: Separated concerns with clear API boundaries
2. **Database Efficiency**: Optimized queries and connection management
3. **Error Resilience**: Comprehensive error handling and retry logic
4. **Security**: Multi-layer authentication and validation

### Future Enhancement Opportunities

1. **Caching Layer**: Redis for frequently accessed data
2. **File Storage**: Cloud storage for PDFs and attachments
3. **Email Notifications**: Automated application confirmations
4. **Analytics**: Application tracking and reporting
5. **API Rate Limiting**: Protection against abuse
6. **Database Migrations**: Version-controlled schema changes

## 🛠️ Maintenance & Monitoring

### Logging Strategy

- **Error Logging**: Comprehensive error tracking
- **Performance Monitoring**: Database query optimization
- **Security Auditing**: Authentication and access logs

### Backup Strategy

- **Database Backups**: Regular MySQL backups
- **Code Versioning**: Git-based deployment tracking
- **Environment Management**: Separate dev/staging/production configs

---

This backend architecture provides a robust, scalable foundation for the job application system with strong security measures, efficient data handling, and comprehensive error management. The modular design allows for easy maintenance and future enhancements while maintaining high performance and reliability standards.
