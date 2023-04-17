import {createSlice} from "@reduxjs/toolkit";

const initial = {
  nickname: null,
  loginID: null,
  temp: 36.5,
  isLoggedIn: false,
};

const UserSlice = createSlice({
  name: "User",
  initialState: initial,
  reducers: {
    login: (state, action) => {
      state.loginID = action.payload.uid;
      state.nickname = action.payload.nickname;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.temp = action.payload.temp;
    },
    logout: () => initial,
    nicknameChange: (state, action) => {
      state.nickname = action.payload;
    },
  },
});

export const userAction = UserSlice.actions;

export default UserSlice;
