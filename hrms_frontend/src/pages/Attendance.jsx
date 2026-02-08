import { useEffect, useState } from "react";
import { getEmployees } from "../api/employees.api";
import {
  getAttendanceByEmployee,
  markAttendance,
} from "../api/attendance.api";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch Employees ---------------- */
  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("Failed to load employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ---------------- Fetch Attendance for Date ---------------- */
  const fetchAttendanceForDate = async () => {
    if (!selectedDate || employees.length === 0) return;

    try {
      setLoading(true);
      const map = {};

      for (const emp of employees) {
        const records = await getAttendanceByEmployee(emp.id);

        const recordForDate = records.find(
          (r) => r.attendance_date === selectedDate
        );

        map[emp.id] = recordForDate
          ? recordForDate.status
          : "Not Marked";
      }

      setAttendanceMap(map);
    } catch (err) {
      console.error("FETCH ATTENDANCE ERROR 👉", err);
      alert("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceForDate();
  }, [selectedDate, employees]);

  /* ---------------- Mark Attendance ---------------- */
  const handleMarkAttendance = async (employeeDbId, status) => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    const payload = {
      employee_db_id: employeeDbId,
      attendance_date: selectedDate,
      status,
    };

    try {
      await markAttendance(payload);

      // Update UI instantly
      setAttendanceMap((prev) => ({
        ...prev,
        [employeeDbId]: status,
      }));
    } catch (err) {
      console.error("MARK ATTENDANCE ERROR 👉", err);
      alert("Failed to mark attendance");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Attendance
          </h1>
          <p className="text-sm text-gray-500">
            Mark daily attendance for employees
          </p>
        </div>

        <input
          type="date"
          className="border px-3 py-2 rounded-lg text-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Employee ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => {
              const status =
                attendanceMap[emp.id] || "Not Marked";

              return (
                <tr key={emp.id} className="border-t">
                  <td className="px-6 py-4">
                    {emp.employee_id}
                  </td>

                  <td className="px-6 py-4">
                    {emp.full_name}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === "Present"
                          ? "bg-green-100 text-green-700"
                          : status === "Absent"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() =>
                        handleMarkAttendance(emp.id, "Present")
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Present
                    </button>

                    <button
                      onClick={() =>
                        handleMarkAttendance(emp.id, "Absent")
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              );
            })}

            {employees.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500"
                >
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && (
          <p className="text-center py-4 text-gray-500">
            Loading attendance...
          </p>
        )}
      </div>
    </div>
  );
}
