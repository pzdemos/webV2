import axios from "axios";
import { useUserStore } from "@/stores/user";
const request = axios.create({
  baseURL: "/api/v1/web",
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
    console.error('请求发送错误:', error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    if (response.data && response.data.actionType === 'OK') {
      // console.log('响应数据:', response.data);
    } else {
      // console.warn('响应数据格式异常:', response.data);
    }
    return response;
  },
  (error) => {
    console.error('请求响应错误:', error.message);
    if (error.response) {
      console.error('服务器响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return Promise.reject(error);
  } 
);

export default request;
