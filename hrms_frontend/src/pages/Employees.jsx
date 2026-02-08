import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
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

  /* ---------------- FETCH EMPLOYEES ---------------- */
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();

      // ✅ IMPORTANT: backend already returns an array
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
      fetchEmployees(); // refresh list
    } catch (err) {
      console.error("ADD EMPLOYEE ERROR 👉", err);
      alert("Failed to add employee");
    }
  };

  /* ---------------- DELETE EMPLOYEE ---------------- */
  const handleDelete = async (dbId) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await deleteEmployee(dbId);
      fetchEmployees();
    } catch (err) {
      console.error("DELETE EMPLOYEE ERROR 👉", err);
      alert("Failed to delete employee");
    }
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
                <tr key={emp.id} className="border-t">
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
                      onClick={() => handleDelete(emp.id)}
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
      )}
    </div>
  );
}
