import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import {useCallback, useEffect, useState} from "react";
import {useNearbyLocations} from "@/Hooks/useNearbylocation";
import {useDispatch, useSelector} from "react-redux";
import {productAction} from "@/store/product-slice";

function ProductList({list, range}) {
  const dispatch = useDispatch();

  const loginID = useSelector((state) => state.User.loginID);
  const isLoggedIn = useSelector((state) => state.User.isLoggedIn);
  const selectedCategory = useSelector((state) => state.Products.selectedCategory);
  console.log(selectedCategory);

  const [nearProduct, nearbyLocationsFn] = useNearbyLocations(range, list);
  const [isScroll, setIsScroll] = useState(false);
  const [showList, setShowList] = useState([]);
  const [isError, setisError] = useState(false);
  const writeBtnOff = ["구매내역", "관심목록"].includes(selectedCategory);

  const handleScroll = () => {
    setIsScroll(true);
  };

  useEffect(() => {
    //내 근처 매물 불러오기
    if (selectedCategory == "Near") {
      nearbyLocationsFn();
    }
  }, [nearbyLocationsFn, selectedCategory]);

  //섹션에 따라 다른 리스트 보여주기
  useEffect(() => {
    if (selectedCategory == "Near") {
      setShowList(nearProduct);
    } else if (selectedCategory == "카테고리") {
      return;
    } else {
      setShowList(list);
    }
  }, [selectedCategory, , list, nearProduct]);

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
          onClick={() => dispatch(productAction.setisEdit(false))}
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
