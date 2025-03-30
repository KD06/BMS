import axios from "axios";

export const apiInstance = axios.create({
  baseURL: "http://localhost:8000",
  responseType: "json",
});

apiInstance.interceptors.request.use((reqPayload) => {
  const token = localStorage.getItem("token");
  if (token) {
    reqPayload.headers.Authorization = `Bearer ${token}`;
  }
  return reqPayload;
});
