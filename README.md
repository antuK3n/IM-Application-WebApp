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
  Applicant_ID CHAR(3) NOT NULL,
  Applicant_Name VARCHAR(30) DEFAULT NULL,
  Applicant_Address VARCHAR(100) DEFAULT NULL,
  Contact_Number VARCHAR(13) DEFAULT NULL,
  Age INT DEFAULT NULL,
  Sex CHAR(1) DEFAULT NULL,
  PRIMARY KEY (Applicant_ID),
  CONSTRAINT chk_sex CHECK (Sex IN ('M','F'))
);

CREATE TABLE application_info (
  ApplicantForm_ID CHAR(3) NOT NULL,
  Applicant_ID CHAR(3) NOT NULL,
  Control_Number CHAR(6) NOT NULL,
  Position_Applied VARCHAR(100) DEFAULT NULL,
  Salary_Desired DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (ApplicantForm_ID),
  FOREIGN KEY (Applicant_ID) REFERENCES applicant_info(Applicant_ID)
);

CREATE TABLE education_info (
  Student_ID VARCHAR(25) NOT NULL,
  Applicant_ID CHAR(3) NOT NULL,
  Educational_Attainment VARCHAR(15) DEFAULT NULL,
  Institution_Name VARCHAR(50) DEFAULT NULL,
  Year_Graduated INT DEFAULT NULL,
  Honors VARCHAR(30) DEFAULT NULL,
  PRIMARY KEY (Student_ID),
  FOREIGN KEY (Applicant_ID) REFERENCES applicant_info(Applicant_ID)
);

CREATE TABLE job_info (
  Employment_ID VARCHAR(12) NOT NULL,
  Applicant_ID CHAR(3) NOT NULL,
  Company_Name VARCHAR(50) DEFAULT NULL,
  Company_Location VARCHAR(25) DEFAULT NULL,
  Position VARCHAR(50) DEFAULT NULL,
  Salary DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (Employment_ID),
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

## Nae Nae Lyrics

Now watch me whip (kill it!)
Now watch me nae nae (okay!)
Now watch me whip whip
Watch me nae nae (want me do it?)
Now watch me whip (kill it!)
Watch me nae nae (okay!)
Now watch me whip whip
Watch me nae nae (can you do it?)
Now watch me

Ooh, watch me, watch me
Ooh, watch me, watch me
Ooh, watch me, watch me
Ooh, ooh, ooh, ooh
Ooh, watch me, watch me
Ooh, watch me, watch me
Ooh, watch me, watch me
Ooh, ooh, ooh, ooh

Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg

Now break your legs
Break your legs
Break your legs
Break your legs
Break your legs
Break your legs
Break your legs
Break your legs

Now watch me (bop bop bop bop bop bop bop bop)
Now watch me (bop bop bop bop bop bop bop bop)
Now watch me (bop bop bop bop bop bop bop bop)
Now watch me (bop bop bop bop bop bop bop bop)

Now watch me whip (kill it!)
Now watch me nae nae (okay!)
Now watch me whip whip
Watch me nae nae (want me do it?)
Now watch me whip (kill it!)
Watch me nae nae (okay!)
Now watch me whip whip
Watch me nae nae (can you do it?)
Now watch me

Ooh, watch me, watch me
Ooh, watch me, watch me
Ooh, watch me, watch me
Ooh, ooh, ooh, ooh
Ooh, watch me, watch me
Ooh, watch me, watch me
Ooh, watch me, watch me
Ooh, ooh, ooh, ooh

Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg
Do the stanky leg

Now break your legs
Break your legs
Break your legs
Break your legs
Break your legs
Break your legs
Break your legs
Break your legs

Now watch me (bop bop bop bop bop bop bop bop)
Now watch me (bop bop bop bop bop bop bop bop)
Now watch me (bop bop bop bop bop bop bop bop)
Now watch me (bop bop bop bop bop bop bop bop)
