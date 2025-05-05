import axios from "axios";
import { useUserStore } from "@/stores/user";
const request = axios.create({
  baseURL: "http://localhost:5200/api/v1/web",
});

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  } 
);

export default request;
