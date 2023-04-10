import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import {useNearbyLocations} from "@/Hooks/useNearbylocation";
import UserContext from "../context/user-context";
import ProductContext from "../context/product-context";
import {firestore} from "../firebase";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import Image from "next/image";

function ProductList({list, range}) {
  const {setIsEdit, SelectedCategory} = useContext(ProductContext);
  const {isLoggedIn, likeProducts, loginDisplayName} = useContext(UserContext);
  const [nearProduct, nearbyLocationsFn] = useNearbyLocations(range, list);
  const [isScroll, setIsScroll] = useState(false);
  const [showList, setShowList] = useState([]);
  const [isError, setisError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    } else if (SelectedCategory == "관심목록") {
      setShowList(likeProducts);
    } else if (SelectedCategory == "판매내역") {
      const sellListRef = collection(firestore, "products");
      const q = query(sellListRef, where("userName", "==", loginDisplayName));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ProductsData = [];

        snapshot.forEach((doc) => {
          ProductsData.push({id: doc.id, data: doc.data()});
        });
        setShowList(ProductsData);
      });

      return () => unsubscribe();
    } else if (SelectedCategory == "구매내역") {
      if (isLoggedIn) {
        const buyListRef = collection(firestore, "products");
        const q = query(buyListRef, where("buyer", "==", loginDisplayName));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const ProductsData = [];
          snapshot.forEach((doc) => {
            ProductsData.push({id: doc.id, data: doc.data()});
          });
          setShowList(ProductsData);
        });

        return () => unsubscribe();
      }
    } else if (SelectedCategory == "카테고리") {
      return;
    } else {
      setShowList(list);
    }
    setIsLoading(false);
  }, [SelectedCategory, likeProducts, list, nearProduct, isLoggedIn, loginDisplayName]);

  const nowriteCategory = ["구매내역", "판매내역", "관심목록"];
  const writeBtnOff = nowriteCategory.includes(SelectedCategory);

  //자신의 글 좋아요 누른경우
  const errorHandler = () => {
    setisError(true);

    setTimeout(() => {
      setisError(false);
    }, 1000);
  };

  // 유저가 찜한 매물인지 필터링하는 함수
  const isLiked = (id) => {
    return likeProducts.some((product) => product.id === id);
  };

  return (
    <>
      {/* 게시물리스트 있을때와 없을때 */}
      {!isLoading && showList.length === 0 ? (
        <div className={classes.empty}>
          <Image src="/images/empty.png" alt="" width={100} height={100} />텅
        </div>
      ) : (
        <ul className={classes.list} onScroll={handleScroll}>
          {showList.map((item) => {
            return (
              <ProductItem
                errorHandler={errorHandler}
                key={item.id}
                id={item.id}
                item={item.data}
                isliked={isLiked(item.id)}
              />
            );
          })}
        </ul>
      )}
      {/* 글쓰기버튼 조건 */}
      {isLoggedIn && !writeBtnOff && (
        <Link
          href="WriteProduct"
          className={`${classes.writeButton} ${isScroll && classes.onScroll}`}
          onClick={() => setIsEdit(false)}
          onMouseOver={() => setIsScroll(false)}>
          {isScroll ? "+" : "+ 글쓰기"}
        </Link>
      )}
      <div className={`${classes.errorBox} ${!isError && classes.hide}`}>
        본인의 글에는 좋아요를 누르실 수 없습니다
      </div>
    </>
  );
}

export default ProductList;
