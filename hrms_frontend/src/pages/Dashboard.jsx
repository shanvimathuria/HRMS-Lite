import { useEffect, useState } from "react";
import StatCard from "../components/ui/StatCard";
import {
  getDashboardSummary,
  getPresentDays,
} from "../api/dashboard.api";
import { filterAttendanceByDate } from "../api/attendance.api";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    total_employees: 0,
    total_attendance_records: 0,
    present_today: 0,
    absent_today: 0,
  });

  const [presentDays, setPresentDays] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- Load dashboard data ---------------- */
  const loadDashboard = async () => {
    try {
      const summaryRes = await getDashboardSummary();
      const presentRes = await getPresentDays();

      setSummary(summaryRes || {});
      setPresentDays(Array.isArray(presentRes) ? presentRes : []);
    } catch (err) {
      console.error("DASHBOARD LOAD ERROR 👉", err);
      alert("Failed to load dashboard");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ---------------- Apply date filter ---------------- */
  const applyFilter = async () => {
    if (!startDate || !endDate) {
      alert("Select start and end date");
      return;
    }

    try {
      setLoading(true);

      const records = await filterAttendanceByDate(
        startDate,
        endDate
      );

      const present = records.filter(
        (r) => r.status === "Present"
      ).length;

      const absent = records.filter(
        (r) => r.status === "Absent"
      ).length;

      setSummary((prev) => ({
        ...prev,
        total_attendance_records: records.length,
        present_today: present,
        absent_today: absent,
      }));
    } catch (err) {
      console.error("FILTER ERROR 👉", err);
      alert("Failed to apply filter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Overview of HR operations
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <input
            type="date"
            className="border px-2 py-1 rounded text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border px-2 py-1 rounded text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={applyFilter}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Employees"
          value={summary.total_employees}
        />
        <StatCard
          title="Present Today"
          value={summary.present_today}
        />
        <StatCard
          title="Absent Today"
          value={summary.absent_today}
        />
        <StatCard
          title="Attendance Records"
          value={summary.total_attendance_records}
        />
      </div>

      {/* Employee Attendance Summary */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Employee Attendance Summary
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">
                Employee Name
              </th>
              <th className="px-6 py-3 text-center">
                Total Present Days
              </th>
            </tr>
          </thead>

          <tbody>
            {presentDays.map((emp) => (
              <tr key={emp.employee_db_id} className="border-t">
                <td className="px-6 py-4">
                  {emp.full_name}
                </td>
                <td className="px-6 py-4 text-center font-medium">
                  {emp.present_days}
                </td>
              </tr>
            ))}

            {presentDays.length === 0 && (
              <tr>
                <td
                  colSpan="2"
                  className="text-center py-6 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <p className="text-center mt-4 text-gray-500">
          Applying filter...
        </p>
      )}
    </div>
  );
}
