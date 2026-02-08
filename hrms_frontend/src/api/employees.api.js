import api from "./axios";

// Get all employees
export const getEmployees = async () => {
  try {
    const response = await api.get("/employees");
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Create a new employee
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post("/employees", employeeData);
    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = async (employeeId) => {
  try {
    const response = await api.delete(`/employees/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

// Get attendance for an employee
export const getEmployeeAttendance = async (employeeId) => {
  try {
    const response = await api.get(`/attendance/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    throw error;
  }
};
