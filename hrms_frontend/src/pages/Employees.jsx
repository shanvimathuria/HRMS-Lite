import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
  getEmployeeAttendance,
} from "../api/employees.api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  // Attendance modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  /* ---------------- FETCH EMPLOYEES ---------------- */
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();

      console.log("EMPLOYEES FROM API 👉", data);

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH EMPLOYEES ERROR 👉", err);
      alert("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ---------------- ADD EMPLOYEE ---------------- */
  const handleAddEmployee = async () => {
    if (
      !form.employee_id ||
      !form.full_name ||
      !form.email ||
      !form.department
    ) {
      alert("All fields are required");
      return;
    }

    try {
      await createEmployee(form);
      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
      fetchEmployees();
    } catch (err) {
      console.error("ADD EMPLOYEE ERROR 👉", err);
      alert("Failed to add employee");
    }
  };

  /* ---------------- DELETE EMPLOYEE ---------------- */
  const handleDeleteClick = (emp, e) => {
    e.stopPropagation();
    setEmployeeToDelete(emp);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await deleteEmployee(employeeToDelete.id);
      fetchEmployees();
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error("DELETE EMPLOYEE ERROR 👉", err);
      alert("Failed to delete employee");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  /* ---------------- ATTENDANCE MODAL ---------------- */
  const openAttendanceModal = async (emp) => {
    const resolvedId =
      emp?.id ??
      emp?.employee_db_id ??
      emp?.employeeId ??
      emp?.employee_id;

    if (!resolvedId) {
      setSelectedEmployee(emp);
      setIsModalOpen(true);
      setAttendance([]);
      setAttendanceError("Missing employee id");
      setAttendanceLoading(false);
      return;
    }

    setSelectedEmployee(emp);
    setIsModalOpen(true);
    setAttendance([]);
    setAttendanceError("");
    setAttendanceLoading(true);

    try {
      const data = await getEmployeeAttendance(resolvedId);
      console.log("Attendance data:", data);
      setAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH ATTENDANCE ERROR 👉", err);
      setAttendanceError(err.message || "Failed to load attendance");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const closeAttendanceModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setAttendance([]);
    setAttendanceError("");
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Employees
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage your organization employees
      </p>

      {/* ADD EMPLOYEE FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          placeholder="Employee ID"
          className="border px-3 py-2 rounded"
          value={form.employee_id}
          onChange={(e) =>
            setForm({ ...form, employee_id: e.target.value })
          }
        />
        <input
          placeholder="Full Name"
          className="border px-3 py-2 rounded"
          value={form.full_name}
          onChange={(e) =>
            setForm({ ...form, full_name: e.target.value })
          }
        />
        <input
          placeholder="Email"
          className="border px-3 py-2 rounded"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <input
          placeholder="Department"
          className="border px-3 py-2 rounded"
          value={form.department}
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        />

        <button
          onClick={handleAddEmployee}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-gray-500">Loading employees...</p>
      ) : (
        <div>
          <p className="text-xs text-gray-500 text-right mb-2">
            Click on employee name to see attendance details
          </p>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Employee ID</th>
                  <th className="px-6 py-3 text-left">Full Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Department</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-t cursor-pointer hover:bg-gray-50"
                    onClick={() => openAttendanceModal(emp)}
                  >
                    <td className="px-6 py-4">
                      {emp.employee_id}
                    </td>
                    <td className="px-6 py-4">
                      {emp.full_name}
                    </td>
                    <td className="px-6 py-4">
                      {emp.email}
                    </td>
                    <td className="px-6 py-4">
                      {emp.department}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => handleDeleteClick(emp, e)}
                        className="text-red-600 hover:text-red-800 text-lg"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {employees.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                No employees found
              </p>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Employee
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <strong>{employeeToDelete?.full_name}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Attendance Details
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedEmployee?.full_name} (ID: {selectedEmployee?.employee_id})
                </p>
              </div>
              <button
                onClick={closeAttendanceModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {attendanceLoading ? (
              <p className="text-gray-500">Loading attendance...</p>
            ) : attendanceError ? (
              <p className="text-red-600">{attendanceError}</p>
            ) : attendance.length === 0 ? (
              <p className="text-gray-500">No attendance records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Employee</th>
                      <th className="px-4 py-2 text-left">Business ID</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a, idx) => (
                      <tr key={`${a.employee_db_id}-${a.attendance_date}-${idx}`} className="border-t">
                        <td className="px-4 py-2">{a.employee_name}</td>
                        <td className="px-4 py-2">{a.employee_business_id}</td>
                        <td className="px-4 py-2">{a.attendance_date}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              a.status === "Present"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeAttendanceModal}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}