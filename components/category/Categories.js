import React, { useContext } from "react";
import Link from "next/link";
import classes from "./Categories.module.css";
import ProductContext from "../product-context";

function SectionList(props) {
  const { setSelectedCategory } = useContext(ProductContext);
  const category = [
    "인기매물",
    "디지털기기",
    "생활가전",
    "가구/인테리어",
    "생활/주방",
    "유아동",
    "의류",
    "뷰티/미용",
    "스포츠/레저",
    "취미/게임/음반",
    "도서",
    "티켓/교환권",
    "반려동물용품",
    "식물",
    "삽니다",
  ];

  const CategoryDBname = [
    "인기매물",
    "디지털기기",
    "생활가전",
    "가구",
    "생활",
    "유아동",
    "의류",
    "뷰티",
    "스포츠",
    "취미",
    "도서",
    "티켓",
    "반려동물용품",
    "식물",
    "삽니다",
  ];

  const CategoryIcon = [
    "🔥",
    "💻",
    "📺",
    "🪑",
    "🍴",
    "🧸",
    "👔",
    "💄",
    "🏓",
    "🎮",
    "📘",
    "🎫",
    "🐈",
    "🌷",
    "📢",
  ];

  return (
    <ul className={classes.categoryMenu}>
      {category.map((category, idx) => {
        return (
          <li key={category} onClick={() => setSelectedCategory(category)}>
            <Link href={CategoryDBname[idx]}>
              <h2>{CategoryIcon[idx]}</h2>
              {category}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default SectionList;
