import {configureStore} from "@reduxjs/toolkit";
import UserSlice from "./user-slice";
import productSlice from "./product-slice";

const store = configureStore({
  reducer: {
    User: UserSlice.reducer,
    Products: productSlice.reducer,
  },
});

export default store;
