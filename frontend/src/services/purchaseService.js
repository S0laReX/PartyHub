import api from "./api";

export const createPurchase = async (data) => {
  const response = await api.post("/purchases", data);
  return response.data;
};

export const getPurchases = async () => {
  const response = await api.get("/purchases");
  return response.data;
};

export const scanTicket = async (qr_uuid) => {
  const response = await api.post("/scan-ticket", { qr_uuid });
  return response.data;
};