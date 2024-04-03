import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { _ } from 'numeral';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const secretKey = 'thakhtnha';
const encryptData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encryptedData;
};

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

const items =
  localStorage.getItem('user') != null
    ? decryptData(localStorage.getItem('user'))
    : [];

const initialState = {
  user: items,
};

export const refreshAccessTokenAsync = createAsyncThunk(
  'login/refreshAccessToken',
  async (_, { dispatch, getState }) => {
    try {
      const user = getState().login.user;
      const { refreshToken, email } = user;
      console.log(user);
      // Call the API to refresh the access token
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_API_URL +
          `/api/account/refresh-token?email=${email}`,
        {
          refreshToken,
        }
      );

      // Dispatch the saveUser action to update the user state
      dispatch(
        updateToken({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          expiration: response.data.expiration,
        })
      );
      console.log('Refreshed token:', response);
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
);

export const userSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    saveUser: (state, action) => {
      const { accessToken, ...userData } = action.payload;
      state.user = { ...state.user, ...userData };
      localStorage.setItem('user', encryptData(state.user));
      if (accessToken) {
        Cookies.set('accessToken', accessToken);
      }
    },
    logOut: (state, action) => {
      state.user = [];
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateToken: (state, action) => {
      const { accessToken, ...newData } = action.payload;
      if (accessToken) {
        Cookies.set('accessToken', accessToken);
      }
      state.user = { ...state.user, ...newData };
      localStorage.setItem('user', encryptData(state.user));
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveUser, logOut, updateToken } = userSlice.actions;

export default userSlice.reducer;
