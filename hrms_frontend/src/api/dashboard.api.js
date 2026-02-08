import api from "./axios";

export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};

export const getPresentDays = async () => {
  const res = await api.get("/dashboard/present-days");
  return res.data;
};
