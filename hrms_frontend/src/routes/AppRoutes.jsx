import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import Attendance from "../pages/Attendance";
import AttendanceRecords from "../pages/AttendanceRecords";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/employees"
        element={
          <MainLayout>
            <Employees />
          </MainLayout>
        }
      />

      <Route
        path="/attendance"
        element={
          <MainLayout>
            <Attendance />
          </MainLayout>
        }
      />

      <Route
        path="/attendance-records"
        element={
          <MainLayout>
            <AttendanceRecords />
          </MainLayout>
        }
      />
    </Routes>
  );
}
