import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartReducer';
import userReducer from './userReducer';

export const store = configureStore({
  reducer: { cart: cartReducer, login: userReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
