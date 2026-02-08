import api from "./axios";

// Mark attendance
export const markAttendance = async (payload) => {
  const res = await api.post("/attendance/", payload);
  return res.data;
};

// Get attendance for employee
export const getAttendanceByEmployee = async (employeeDbId) => {
  const res = await api.get(`/attendance/${employeeDbId}`);
  return res.data;
};

// ✅ ADD THIS (FOR DASHBOARD FILTER)
export const filterAttendanceByDate = async (startDate, endDate) => {
  const res = await api.get(
    `/attendance/filter/?start_date=${startDate}&end_date=${endDate}`
  );
  return res.data;
};
