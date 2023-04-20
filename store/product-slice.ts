import {PayloadAction, createSlice} from "@reduxjs/toolkit";

const categoryList = [
  "인기매물",
  "디지털기기",
  "생활·가전",
  "가구·인테리어",
  "생활·주방",
  "유아동",
  "의류",
  "뷰티·미용",
  "스포츠·레저",
  "취미·게임·음반",
  "도서",
  "티켓·교환권",
  "반려동물용품",
  "식물",
  "삽니다",
];

export class ItemData {
  title: string;
  price: number | string;
  description: string;
  Latitude: number;
  Longitude: number;
  category: string;
  dong: string;
  nickname: string;
  temp: number;
  time: number;
  ID: string;
  chat: string[];
  show: number;
  wholike: string[];
  likes: number;
  soldout: boolean | null;
}

export class Item {
  id: string;
  data: ItemData;
}

const initialState = {
  dong: "내근처",
  latitude: null,
  longitude: null,
  category: "카테고리",
  isEdit: false,
  categoryList,
  range: 5,
  isSearch: false,
};

const ProductSlice = createSlice({
  name: "Products",
  initialState,
  reducers: {
    setCoordinate: (state, action: PayloadAction<{latitude: number; longitude: number}>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setDong: (state, action: PayloadAction<string>) => {
      state.dong = action.payload;
    },
    setisEdit(state, action: PayloadAction<boolean>) {
      state.isEdit = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    rangeChange(state, action: PayloadAction<number>) {
      state.range = action.payload;
    },
    Searching(state, action: PayloadAction<boolean>) {
      state.isSearch = action.payload;
    },
  },
});

export const productAction = ProductSlice.actions;

export default ProductSlice;
