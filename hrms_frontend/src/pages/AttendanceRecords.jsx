import { useEffect, useState } from "react";
import { getEmployees, getEmployeeAttendance } from "../api/employees.api";
import { filterAttendanceByDate } from "../api/attendance.api";

export default function AttendanceRecords() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter state
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAllRecords, setShowAllRecords] = useState(false);

  // Stats
  const [stats, setStats] = useState({ totalPresent: 0, totalAbsent: 0, totalRecords: 0 });

  /* ---------------- Fetch Employees ---------------- */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  /* ---------------- Fetch All Individual Records ---------------- */
  const fetchAllIndividualRecords = async () => {
    const allRecords = [];
    
    for (const emp of employees) {
      try {
        const empRecords = await getEmployeeAttendance(emp.id);
        if (Array.isArray(empRecords)) {
          allRecords.push(...empRecords);
        }
      } catch (err) {
        console.error(`Failed to fetch records for employee ${emp.id}:`, err);
      }
    }
    
    return allRecords;
  };

  /* ---------------- Apply Filter ---------------- */
  const applyFilter = async () => {
    if (!showAllRecords && (!startDate || !endDate)) {
      setError("Please select both start and end date or choose 'All Records'");
      return;
    }

    if (!showAllRecords && new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let data = [];
      
      if (showAllRecords) {
        // Fetch individual records from all employees
        data = await fetchAllIndividualRecords();
      } else {
        // Use the date filter API (returns aggregated data)
        const aggregatedData = await filterAttendanceByDate(startDate, endDate);
        // Convert aggregated to individual-like records for display
        data = aggregatedData.map(emp => ({
          employee_db_id: emp.employee_id,
          employee_business_id: emp.employee_id,
          employee_name: emp.employee_name,
          employee_email: emp.employee_email,
          department: emp.department,
          total_present_days: emp.total_present_days,
          total_records: emp.total_records,
          isAggregated: true
        }));
      }

      // Filter by employee if selected
      const filteredRecords = selectedEmployee === "all" 
        ? data 
        : data.filter(r => r.employee_db_id === parseInt(selectedEmployee));

      setRecords(filteredRecords);

      // Calculate stats
      if (showAllRecords) {
        const present = filteredRecords.filter(r => r.status === "Present").length;
        const absent = filteredRecords.filter(r => r.status === "Absent").length;
        setStats({ totalPresent: present, totalAbsent: absent, totalRecords: present + absent });
      } else {
        const totalPresent = filteredRecords.reduce((sum, r) => sum + (r.total_present_days || 0), 0);
        const totalRecords = filteredRecords.reduce((sum, r) => sum + (r.total_records || 0), 0);
        const totalAbsent = totalRecords - totalPresent;
        setStats({ totalPresent, totalAbsent, totalRecords });
      }

    } catch (err) {
      console.error("Filter error:", err);
      setError("Failed to fetch attendance records");
      setRecords([]);
      setStats({ totalPresent: 0, totalAbsent: 0, totalRecords: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        Attendance Records
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {showAllRecords ? "View all individual attendance records" : "View attendance summary by date range"}
      </p>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee
            </label>
            <select
              className="w-full border px-3 py-2 rounded-lg text-sm"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="all">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              className={`w-full border px-3 py-2 rounded-lg text-sm ${showAllRecords ? 'bg-gray-100' : ''}`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={showAllRecords}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              className={`w-full border px-3 py-2 rounded-lg text-sm ${showAllRecords ? 'bg-gray-100' : ''}`}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={showAllRecords}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="flex items-center h-10">
              <input
                type="checkbox"
                id="allRecords"
                className="mr-2"
                checked={showAllRecords}
                onChange={(e) => {
                  setShowAllRecords(e.target.checked);
                  if (e.target.checked) {
                    setStartDate("");
                    setEndDate("");
                  }
                }}
              />
              <label htmlFor="allRecords" className="text-sm text-gray-700">
                All Records
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={applyFilter}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-4">⚠️ {error}</p>
        )}
      </div>

      {/* Stats Cards */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              {showAllRecords ? "Total Present" : "Total Present Days"}
            </p>
            <p className="text-3xl font-bold text-green-900 mt-1">
              {stats.totalPresent}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              {showAllRecords ? "Total Absent" : "Total Absent Days"}
            </p>
            <p className="text-3xl font-bold text-red-900 mt-1">
              {stats.totalAbsent}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">Total Records</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">
              {stats.totalRecords}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">Loading attendance records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-lg">
              📋 No records found. Please apply filters to view attendance.
            </p>
          </div>
        ) : showAllRecords ? (
          // Individual Records Table
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Employee ID</th>
                <th className="px-6 py-3 text-left">Employee Name</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, idx) => (
                <tr key={`${record.employee_db_id}-${record.attendance_date}-${idx}`} className="border-t">
                  <td className="px-6 py-4">
                    {record.employee_business_id}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {record.employee_name}
                  </td>
                  <td className="px-6 py-4">
                    {record.attendance_date}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Aggregated Summary Table
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Employee ID</th>
                <th className="px-6 py-3 text-left">Employee Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-center">Present Days</th>
                <th className="px-6 py-3 text-center">Total Records</th>
                <th className="px-6 py-3 text-center">Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const attendanceRate = record.total_records > 0 
                  ? ((record.total_present_days / record.total_records) * 100).toFixed(1)
                  : 0;

                return (
                  <tr key={record.employee_db_id} className="border-t">
                    <td className="px-6 py-4">
                      {record.employee_business_id}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {record.employee_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {record.employee_email}
                    </td>
                    <td className="px-6 py-4">
                      {record.department}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {record.total_present_days}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {record.total_records}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          attendanceRate >= 80
                            ? "bg-green-100 text-green-700"
                            : attendanceRate >= 60
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {attendanceRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
