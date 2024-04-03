import axios from 'axios';

import { store } from './redux/store';
import { refreshAccessTokenAsync } from './redux/userReducer';
import Cookies from 'js-cookie';

const makeRequest = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

makeRequest.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('accessToken') || null;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Thêm một interceptor để xử lý các lỗi liên quan đến token
makeRequest.interceptors.response.use(
  (response) => {
    // Xử lý response ở đây nếu cần
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check nếu lỗi liên quan đến token (ví dụ: HTTP status code 401)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Dispatch action để làm mới token
        await store.dispatch(refreshAccessTokenAsync());

        // Lấy token mới từ state
        const updatedUser = store.getState().login.user;
        console.log(updatedUser.accessToken);
        // Thêm token mới vào header và thực hiện lại request gốc
        originalRequest.headers.Authorization = `Bearer ${updatedUser.accessToken}`;
        return makeRequest(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError.message);
        // Xử lý lỗi khi làm mới token nếu cần
        return Promise.reject(refreshError);
      }
    }

    // Nếu không phải lỗi liên quan đến token, trả về lỗi gốc
    return Promise.reject(error);
  }
);

export default makeRequest;
