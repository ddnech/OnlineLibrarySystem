import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducer/authSlice";

export const store = configureStore({
  reducer: { auth },
});

export default store;
