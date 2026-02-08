import { useState } from "react";

const employees = [
  { empId: "EMP001", name: "Amit Sharma" },
  { empId: "EMP002", name: "Neha Verma" },
  { empId: "EMP003", name: "Rahul Singh" },
];

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState([]);

  const markAttendance = (empId, status) => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    setAttendance((prev) => {
      const filtered = prev.filter(
        (a) => !(a.empId === empId && a.date === selectedDate)
      );
      return [...filtered, { empId, date: selectedDate, status }];
    });
  };

  const getStatus = (empId) => {
    const record = attendance.find(
      (a) => a.empId === empId && a.date === selectedDate
    );
    return record ? record.status : "Not Marked";
  };

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

      {/* Attendance Table */}
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
              const status = getStatus(emp.empId);

              return (
                <tr key={emp.empId} className="border-t">
                  <td className="px-6 py-4">{emp.empId}</td>
                  <td className="px-6 py-4">{emp.name}</td>

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
                        markAttendance(emp.empId, "Present")
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Present
                    </button>
                    <button
                      onClick={() =>
                        markAttendance(emp.empId, "Absent")
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
