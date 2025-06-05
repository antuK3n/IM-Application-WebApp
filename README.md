# Job Application Portal

A full-stack job application management system built with Next.js and MySQL, using Turborepo for monorepo management.

## Tech Stack

- **Frontend**:

  - Next.js 15
  - React 19
  - TypeScript
  - Formik & Yup for form handling
  - CSS Modules for styling

- **Backend**:

  - Next.js API Routes
  - MySQL Database
  - mysql2 for database connection

- **Authentication**:

  - Custom admin authentication
  - HTTP-only cookies for session management

- **Build Tools**:
  - Turborepo for monorepo management
  - Yarn for package management

## Features

- Job application submission form
- Admin dashboard for managing applications
- Secure admin authentication
- Application sorting and filtering
- Responsive design with dark theme
- Form validation
- Real-time application status updates

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Set up your environment variables in `apps/web/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=jobapplication

# Application Configuration
NEXT_PUBLIC_APP_NAME="Job Application Portal"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

4. Set up the MySQL database:

```sql
CREATE DATABASE jobapplication;
USE jobapplication;

CREATE TABLE applicant_info (
  Applicant_ID VARCHAR(3) PRIMARY KEY,
  Applicant_Name VARCHAR(100) NOT NULL,
  Applicant_Address TEXT NOT NULL,
  Contact_Number VARCHAR(20) NOT NULL,
  Age INT NOT NULL,
  Sex CHAR(1) NOT NULL
);

CREATE TABLE application_info (
  ApplicantForm_ID VARCHAR(3) PRIMARY KEY,
  Applicant_ID VARCHAR(3) NOT NULL,
  Control_Number VARCHAR(6) NOT NULL,
  Position_Applied VARCHAR(100) NOT NULL,
  Salary_Desired DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (Applicant_ID) REFERENCES applicant_info(Applicant_ID)
);

CREATE TABLE education_info (
  Student_ID VARCHAR(3) PRIMARY KEY,
  Applicant_ID VARCHAR(3) NOT NULL,
  Educational_Attainment VARCHAR(100) NOT NULL,
  Institution_Name VARCHAR(100) NOT NULL,
  Year_Graduated INT NOT NULL,
  Honors VARCHAR(100),
  FOREIGN KEY (Applicant_ID) REFERENCES applicant_info(Applicant_ID)
);

CREATE TABLE job_info (
  Employment_ID VARCHAR(3) PRIMARY KEY,
  Applicant_ID VARCHAR(3) NOT NULL,
  Company_Name VARCHAR(100) NOT NULL,
  Company_Location VARCHAR(100) NOT NULL,
  Position VARCHAR(100) NOT NULL,
  Salary DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (Applicant_ID) REFERENCES applicant_info(Applicant_ID)
);
```

5. Run the development server:

```bash
yarn dev
```

## Project Structure

```
apps/web/
├── app/
│   ├── admin/           # Admin dashboard
│   ├── api/             # API routes
│   ├── apply/           # Application form
│   └── success/         # Success page
├── components/          # Shared components
├── lib/                 # Database and utilities
└── styles/             # Global styles
```

## Security Considerations

- Admin credentials are stored in environment variables
- HTTP-only cookies for session management
- Form validation on both client and server
- SQL injection prevention using parameterized queries
- XSS protection through proper input sanitization

## Development

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn check-types` - Run TypeScript type checking

## Turborepo Features

This project uses Turborepo for efficient monorepo management:

- Shared TypeScript configurations
- Shared ESLint configurations
- Optimized build caching
- Parallel task execution
- Workspace management

## Deployment

1. Set up your production environment variables
2. Build the application:

```bash
yarn build
```

3. Start the production server:

```bash
yarn start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
