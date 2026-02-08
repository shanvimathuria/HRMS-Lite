import { useMemo, useState } from "react";
import StatCard from "../components/ui/StatCard";

/* ------------------- Dummy data (replace with backend later) ------------------- */

const employees = [
  { empId: "EMP001", name: "Amit Sharma", dept: "Engineering" },
  { empId: "EMP002", name: "Neha Verma", dept: "HR" },
  { empId: "EMP003", name: "Rahul Singh", dept: "Finance" },
];

/*
  attendanceData: list of attendance records across dates.
  date format: YYYY-MM-DD (compatible with <input type="date">)
*/
const attendanceData = [
  { empId: "EMP001", date: "2024-09-01", status: "Present" },
  { empId: "EMP001", date: "2024-09-02", status: "Present" },
  { empId: "EMP001", date: "2024-09-05", status: "Absent" },
  { empId: "EMP002", date: "2024-09-01", status: "Absent" },
  { empId: "EMP002", date: "2024-09-02", status: "Present" },
  { empId: "EMP003", date: "2024-09-01", status: "Present" },
  { empId: "EMP003", date: "2024-09-03", status: "Present" },
  // add more sample records if you want to test
];

/* ------------------------------------------------------------------------------ */

export default function Dashboard() {
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // filteredRecords === null => no filter applied; otherwise holds an array of records
  const [filteredRecords, setFilteredRecords] = useState(null);

  // Decide which dataset to count from: filteredRecords (if applied) else full attendanceData
  const activeRecords = filteredRecords === null ? attendanceData : filteredRecords;

  // compute present count per employee (based on activeRecords)
  const presentCounts = useMemo(() => {
    const map = {};
    employees.forEach((e) => (map[e.empId] = 0));
    activeRecords.forEach((r) => {
      if (r.status === "Present") {
        if (!(r.empId in map)) map[r.empId] = 0;
        map[r.empId] += 1;
      }
    });
    return map; // { EMP001: 2, ... }
  }, [activeRecords]);

  const applyFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    if (startDate > endDate) {
      alert("Start date cannot be after end date.");
      return;
    }

    // inclusive filter
    const filtered = attendanceData.filter(
      (r) => r.date >= startDate && r.date <= endDate
    );

    setFilteredRecords(filtered);
    setShowFilter(false);
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredRecords(null);
    setShowFilter(false);
  };

  return (
    <div>
      {/* ----------------- Dashboard header & stat cards ----------------- */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Employees" value={employees.length} />
        <StatCard title="Present Today" value="—" />
        <StatCard title="Absent Today" value="—" />
        <StatCard title="Attendance Rate" value="—" />
      </div>

      {/* ----------------- Attendance Summary header + filter button ----------------- */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Employee Attendance Summary
        </h2>

        <div className="flex items-center gap-3">
          {/* Visible quick info: which filter range is active */}
          {filteredRecords ? (
            <div className="text-sm text-gray-600">
              Showing records from{" "}
              <span className="font-medium">{startDate}</span> to{" "}
              <span className="font-medium">{endDate}</span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">Showing all records</div>
          )}

          <button
            onClick={() => setShowFilter(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Filter Attendance
          </button>

          <button
            onClick={clearFilter}
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
            title="Clear filters and show all records"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ----------------- Employee present-days summary table ----------------- */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Employee ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-center">Total Present Days</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.empId} className="border-t">
                <td className="px-6 py-4">{emp.empId}</td>
                <td className="px-6 py-4">{emp.name}</td>
                <td className="px-6 py-4">{emp.dept}</td>
                <td className="px-6 py-4 text-center font-medium">
                  {presentCounts[emp.empId] ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ----------------- Records (shown only when a filter is applied or optionally always) ----------------- */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {filteredRecords ? "Filtered Attendance Records" : "Recent Attendance Records"}
        </h3>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Employee ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {(filteredRecords ?? attendanceData)
                .sort((a, b) => (a.date < b.date ? 1 : -1)) // newest first
                .map((rec, idx) => {
                  const emp = employees.find((e) => e.empId === rec.empId) || {};
                  return (
                    <tr key={`${rec.empId}-${rec.date}-${idx}`} className="border-t">
                      <td className="px-6 py-4">{rec.empId}</td>
                      <td className="px-6 py-4">{emp.name ?? "—"}</td>
                      <td className="px-6 py-4">{rec.date}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            rec.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

              {(filteredRecords ?? attendanceData).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No attendance records found for the selected range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- Filter Modal ----------------- */}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Filter Attendance by Date</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Start date</label>
                <input
                  type="date"
                  className="border w-full px-3 py-2 rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">End date</label>
                <input
                  type="date"
                  className="border w-full px-3 py-2 rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowFilter(false);
                }}
                className="px-4 py-2 text-sm border rounded"
              >
                Close
              </button>

              <button
                onClick={() => {
                  clearFilter();
                }}
                className="px-4 py-2 text-sm border rounded"
              >
                Clear
              </button>

              <button
                onClick={() => applyFilter()}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
