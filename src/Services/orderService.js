import axiosInstance from "../api/axiosInstance";

export const getAllOrders = (params = {}) => {
  return axiosInstance.get("/orders/admin/all", {
    params,
  });
};

export const getOrderById = (id) => {
  return axiosInstance.get(`/orders/${id}`);
};

export const updateOrderStatus = (id, data) => {
  return axiosInstance.patch(`/orders/status/${id}`, data);
};

export const updateTracking = (id, data) => {
  return axiosInstance.patch(`/orders/tracking/${id}`, data);
};

export const deleteOrder = (id) => {
  return axiosInstance.delete(`/orders/delete/${id}`);
};

export const cancelOrder = (id, data = {}) => {
  return axiosInstance.patch(`/orders/cancel/${id}`, data);
};
