import axiosInstance from "../api/axiosInstance";

const BASE = "/wishlist";

export const addToWishlist = (data) => axiosInstance.post(`${BASE}/add`, data);

export const getWishlist = () => axiosInstance.get(`${BASE}/all`);

export const removeWishlistItem = (itemId) =>
  axiosInstance.delete(`${BASE}/item/${itemId}`);

export const removeByVariant = (variantId) =>
  axiosInstance.delete(`${BASE}/variant/${variantId}`);

export const clearWishlist = () => axiosInstance.delete(`${BASE}/clear`);
