import api from "./api";

export const getAdminDashboard = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};

export const getOrganizerDashboard = async () => {
  const response = await api.get("/dashboard/organizer");
  return response.data;
};

export const getRankingEvents = async () => {
  const response = await api.get("/stats/ranking-events");
  return response.data;
};