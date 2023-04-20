import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import {useCallback, useEffect, useState} from "react";
import WriteBtn from "./writeBtn";
import {Item} from "../../store/product-slice";
import {useAppSelector} from "../../Hooks/storeHook";

const ProductList: React.FC<{list: Item[]}> = ({list}) => {
  const loginID = useAppSelector((state) => state.User.loginID);
  const category = useAppSelector((state) => state.Products.category);

  const [showList, setShowList] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isScroll, setIsScroll] = useState(false);

  const handleScroll = () => {
    setIsScroll(true);
  };

  const hoverBtn = () => {
    setIsScroll(false);
  };

  //섹션에 따라 다른 리스트 보여주기
  useEffect(() => {
    if (category !== "카테고리") {
      setShowList(list);
    }
  }, [category, list]);

  //자신의 글 좋아요 누른경우
  const errorHandler = useCallback(() => {
    setIsError(true);

    setTimeout(() => {
      setIsError(false);
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
      <WriteBtn isScroll={isScroll} hoverBtn={hoverBtn} />
      <div className={`${classes.errorBox} ${!isError && classes.hide}`}>
        본인의 글에는 좋아요를 누르실 수 없습니다
      </div>
    </>
  );
};

export default ProductList;
