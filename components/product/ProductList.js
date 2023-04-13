import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import {useCallback, useContext, useEffect, useState} from "react";
import {useNearbyLocations} from "@/Hooks/useNearbylocation";
import UserContext from "../context/user-context";
import ProductContext from "../context/product-context";

function ProductList({list, range}) {
  const {setIsEdit, SelectedCategory} = useContext(ProductContext);
  const {isLoggedIn, loginID} = useContext(UserContext);
  const [nearProduct, nearbyLocationsFn] = useNearbyLocations(range, list);
  const [isScroll, setIsScroll] = useState(false);
  const [showList, setShowList] = useState([]);
  const [isError, setisError] = useState(false);
  const writeBtnOff = ["구매내역", "관심목록"].includes(SelectedCategory);

  const handleScroll = () => {
    setIsScroll(true);
  };

  useEffect(() => {
    //내 근처 매물 불러오기
    if (SelectedCategory == "Near") {
      nearbyLocationsFn();
    }
  }, [nearbyLocationsFn, SelectedCategory]);

  //섹션에 따라 다른 리스트 보여주기
  useEffect(() => {
    if (SelectedCategory == "Near") {
      setShowList(nearProduct);
    } else if (SelectedCategory == "카테고리") {
      return;
    } else {
      setShowList(list);
    }
  }, [SelectedCategory, , list, nearProduct]);

  //자신의 글 좋아요 누른경우
  const errorHandler = useCallback(() => {
    setisError(true);

    setTimeout(() => {
      setisError(false);
    }, 1000);
  }, []);

  return (
    <>
      <ul className={classes.list} onScroll={handleScroll}>
        {showList.map((item) => (
          <ProductItem
            errorHandler={errorHandler}
            key={item.id}
            id={item.id}
            item={item.data}
            isliked={item.data.wholike.includes(loginID)}
          />
        ))}
      </ul>

      {/* 글쓰기버튼 조건 */}
      {isLoggedIn && !writeBtnOff && (
        <Link
          href="WriteProduct"
          className={`${classes.writeButton} ${isScroll && classes.onScroll}`}
          onClick={() => setIsEdit(false)}
          onMouseOver={() => setIsScroll(false)}>
          +{!isScroll && " 글쓰기"}
        </Link>
      )}

      <div className={`${classes.errorBox} ${!isError && classes.hide}`}>
        본인의 글에는 좋아요를 누르실 수 없습니다
      </div>
    </>
  );
}

export default ProductList;
