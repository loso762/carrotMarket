import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useNearbyLocations } from "@/Hooks/useNearbylocation";
import UserContext from "../context/user-context";
import ProductContext from "../context/product-context";

function ProductList({ list, range }) {
  const { setIsEdit, SelectedCategory } = useContext(ProductContext);
  const { isLoggedIn, likeProducts } = useContext(UserContext);

  const [nearProduct, nearbyLocationsFn] = useNearbyLocations(range, list);
  const [IsScroll, setIsScroll] = useState(false);

  const handleScroll = () => {
    setIsScroll(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      window.addEventListener("scroll", handleScroll);
    }, 500);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    //내 근처 매물 불러오기
    if (SelectedCategory == "Near") {
      nearbyLocationsFn();
    }
  }, [nearbyLocationsFn, SelectedCategory]);

  //섹션에 따라 다른 리스트 보여주기
  let showList;
  if (SelectedCategory == "Near") {
    showList = nearProduct;
  } else if (SelectedCategory == "관심목록") {
    showList = likeProducts;
  } else {
    showList = list;
  }

  return (
    <>
      <ul className={classes.list} onScroll={handleScroll}>
        {showList.map((item) => {
          // 유저가 찜한 매물인지 필터링하는 함수
          const isLiked = likeProducts.some((i) => i.id === item.id);
          return (
            <ProductItem
              key={item.id}
              id={item.id}
              item={item.data}
              likes={isLiked}
            />
          );
        })}
      </ul>

      {isLoggedIn && (
        <Link
          href="WriteProduct"
          className={`${classes.writeButton} ${IsScroll && classes.onScroll}`}
          onClick={() => setIsEdit(false)}
          onMouseOver={() => setIsScroll(false)}
        >
          {IsScroll ? "+" : "+ 글쓰기"}
        </Link>
      )}
    </>
  );
}

export default ProductList;
