# HRMS Frontend

A modern Human Resource Management System frontend built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard** - Overview of HR operations with summary statistics
- **Employee Management** - Add, view, delete employees and view their attendance
- **Attendance Marking** - Mark daily attendance for employees
- **Attendance Records** - View and filter attendance history with date ranges
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **React 19** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hrms_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Configure API endpoint**
   
   Update the backend URL in `src/api/axios.js`:
   ```javascript
   const api = axios.create({
     baseURL: "https://hrms-lite-backend-o8u0.onrender.com", // Replace with your backend URL
     headers: {
       "Content-Type": "application/json",
     },
   });
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

Create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── api/                    # API functions and axios configuration
│   ├── axios.js           # Axios instance with base URL
│   ├── attendance.api.js  # Attendance-related API calls
│   ├── dashboard.api.js   # Dashboard API calls
│   └── employees.api.js   # Employee management API calls
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   │   ├── MainLayout.jsx
│   │   └── Sidebar.jsx
│   └── ui/               # UI components
│       └── StatCard.jsx
├── pages/                # Page components
│   ├── Attendance.jsx    # Attendance marking page
│   ├── AttendanceRecords.jsx # Attendance history page
│   ├── Dashboard.jsx     # Dashboard page
│   └── Employees.jsx     # Employee management page
├── routes/               # Routing configuration
│   └── AppRoutes.jsx
├── utils/                # Utility functions
│   └── constants.js
├── App.jsx              # Main app component
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

The frontend expects the following API endpoints:

### Dashboard
- `GET /dashboard/summary` - Get dashboard statistics
- `GET /dashboard/present-days` - Get employee present days summary

### Employees
- `GET /employees` - Get all employees
- `POST /employees` - Create new employee
- `DELETE /employees/{id}` - Delete employee
- `GET /attendance/{employee_id}` - Get attendance for specific employee

### Attendance
- `POST /attendance/` - Mark attendance
- `GET /attendance/filter/` - Filter attendance by date range

## Environment Variables

You can create a `.env` file in the root directory for environment-specific configurations:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

Then update `src/api/axios.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Features Overview

### 1. Dashboard
- View total employees, present/absent counts
- Employee attendance summary table
- Clean statistics cards

### 2. Employee Management
- Add new employees with ID, name, email, department
- View all employees in a table
- Click on employee rows to view their attendance details
- Delete employees with confirmation modal

### 3. Attendance Marking
- Select date to mark attendance
- Mark employees as Present/Absent
- Real-time status updates
- Color-coded status indicators

### 4. Attendance Records
- Filter by employee and date range
- View aggregated attendance summary
- Option to view all records without date filtering
- Statistics showing total present/absent days
- Attendance rate calculation

