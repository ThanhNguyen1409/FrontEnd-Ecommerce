import { createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

const secretKey = 'thakhkatnakwhakdnakwhtn'; // Thay đổi secretKey bằng một giá trị thực tế

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
  localStorage.getItem('products') != null
    ? decryptData(localStorage.getItem('products'))
    : [];
const initialState = {
  products: items,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find((item) => item.id === action.payload.id);
      if (item && item.size === action.payload.size) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
      console.log(action.payload);
      localStorage.setItem('products', encryptData(state.products));
    },
    removeItem: (state, action) => {
      state.products = state.products.filter(
        (item) =>
          item.id !== action.payload && item.size !== action.payload.size
      );
      localStorage.setItem('products', encryptData(state.products));
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (item) {
        item.quantity += 1;
        localStorage.setItem('products', encryptData(state.products));
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('products', encryptData(state.products));
      }
    },
    updateQuantity: (state, action) => {
      const item = state.products.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );
      if (item) {
        switch (action.payload.command) {
          case 'update size':
            item.size = action.payload.newSize;
            item.maxQuantity = action.payload.newMaxQuantity;
            item.quantity = action.payload.quantity;
            break;
          case 'update quantity':
            // Nếu tìm thấy phần tử cần sửa đổi, trả về một bản sao mới với giá trị được cập nhật
            item.quantity = action.payload.quantity;
            break;
          default:
            return item;
        }
        localStorage.setItem('products', encryptData(state.products));
      }
    },
    resetCart: (state, action) => {
      state.products = [];
      localStorage.setItem('products', encryptData([]));
    },
  },
});

export const {
  addToCart,
  removeItem,
  resetCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
