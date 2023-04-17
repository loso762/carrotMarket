import {createSlice} from "@reduxjs/toolkit";

const category = [
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

const initial = {
  dong: "내근처",
  latitude: null,
  longitude: null,
  selectedCategory: "카테고리",
  isEdit: false,
  category: category,
};

const ProductSlice = createSlice({
  name: "Products",
  initialState: initial,
  reducers: {
    setCoordinate(state, action) {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setDong(state, action) {
      state.dong = action.payload;
    },
    setisEdit(state, action) {
      state.isEdit = action.payload;
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
    },
  },
});

export const productAction = ProductSlice.actions;

export default ProductSlice;
