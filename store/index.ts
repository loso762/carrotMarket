import {configureStore} from "@reduxjs/toolkit";
import UserSlice from "./user-slice";
import productSlice from "./product-slice";

const store = configureStore({
  reducer: {
    User: UserSlice.reducer,
    Products: productSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
