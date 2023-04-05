import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useNearbyLocations } from "@/Hooks/useNearbylocation";
import UserContext from "../context/user-context";
import ProductContext from "../context/product-context";
import { firestore } from "../firebase";
import { collection, doc, getDocs } from "firebase/firestore";

function ProductList({ list, section, range }) {
  const { setIsEdit } = useContext(ProductContext);
  const { isLoggedIn, loginID } = useContext(UserContext);

  const [nearProduct, nearbyLocationsFn] = useNearbyLocations(range, list);
  const [IsScroll, setIsScroll] = useState(false);
  const [likeProduct, setlikeProduct] = useState([]);
  const [isLikeCategory, setIsLikeCategory] = useState(false);

  const handleScroll = () => {
    setIsScroll(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      window.addEventListener("scroll", handleScroll);
    }, 100);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      // 유저가 찜한 매물 불러오기
      async function fetchLikeProducts(context) {
        let ProductsData = [];

        const likesDocRef = collection(
          firestore,
          "users",
          loginID,
          "likesproducts"
        );

        const Productlist = await getDocs(likesDocRef);

        Productlist.forEach((doc) => {
          ProductsData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setlikeProduct(ProductsData);
        ProductsData.map((a) => {
          console.log(a.id);
        });
      }
      fetchLikeProducts();
    }

    //내 근처 매물 불러오기
    if (section == "내근처") {
      nearbyLocationsFn();
    }
  }, [nearbyLocationsFn, loginID, section]);

  let lists;
  if (section == "내근처") {
    lists = nearProduct;
  } else if (section == "likes") {
    lists = likeProduct;
  } else {
    lists = list;
  }

  return (
    <>
      <ul className={classes.list} onScroll={handleScroll}>
        {lists &&
          lists.map((item) => {
            // 유저가 찜한 매물인지 필터링하는 함수
            const isLiked = likeProduct.some((i) => i.id === item.id);
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
