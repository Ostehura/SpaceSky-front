"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
});

api.interceptors.request.use(async (config) => {
  console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND);

  const access = localStorage.getItem("access");
  const accessExp = localStorage.getItem("accessExpiresAt");
  const refresh = localStorage.getItem("refresh");

  const isExpired = !accessExp || new Date(accessExp) < new Date();

  if (access && !isExpired) {
    config.headers.Authorization = `Bearer ${access}`;
    return config;
  }

  if (refresh) {
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh,
      });

      const newAccess = res.data.access;
      const newAccessExp = new Date(Date.now() + 5 * 60 * 1000);

      localStorage.setItem("access", newAccess);
      localStorage.setItem("accessExpiresAt", newAccessExp.toISOString());

      config.headers.Authorization = `Bearer ${newAccess}`;
    } catch (e) {
      console.error("Refresh token failed");
      localStorage.clear();
    }
  }

  return config;
});

export default api;
