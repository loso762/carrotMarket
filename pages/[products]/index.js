import React, {useEffect, useState} from "react";
import Header from "@/components/layout/Header";
import FooterMenu from "../../components/layout/FooterMenu";
import {firestore} from "@/components/firebase";
import {collection, limit, onSnapshot, query, where, orderBy} from "firebase/firestore";
import Image from "next/image";
import {PulseLoader} from "react-spinners";
import ProductList from "@/components/product/ProductList";
import {useDispatch, useSelector} from "react-redux";
import {productAction} from "@/store/product-slice";
import WriteBtn from "@/components/product/writeBtn";

function Products() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loginID = useSelector((state) => state.User.loginID);
  const isLoggedIn = useSelector((state) => state.User.isLoggedIn);
  const nickname = useSelector((state) => state.User.nickname);
  const selectedCategory = useSelector((state) => state.Products.selectedCategory);

  useEffect(() => {
    dispatch(productAction.setCategory(sessionStorage.getItem("category")));
    setIsLoading(true);

    const ProductRef = collection(firestore, "products");
    const q = getQuery(ProductRef);

    function getQuery(ProductRef) {
      if (selectedCategory == "판매내역" && isLoggedIn) {
        return query(ProductRef, where("nickname", "==", nickname));
      } else if (selectedCategory == "구매내역" && isLoggedIn) {
        return query(ProductRef, where("buyer", "==", nickname));
      } else if (selectedCategory == "인기매물") {
        return query(ProductRef, orderBy("likes", "desc"), limit(10));
      } else if (selectedCategory == "관심목록" && isLoggedIn) {
        return query(ProductRef, where("wholike", "array-contains", loginID));
      } else if (selectedCategory == "카테고리" || selectedCategory == "Near") {
        setIsLoading(false);
        return query(ProductRef);
      } else {
        return query(ProductRef, where("category", "==", selectedCategory));
      }
    }
    const handleSnapshot = (snapshot) => {
      const ProductsData = [];
      snapshot.forEach((doc) => {
        ProductsData.push({id: doc.id, data: doc.data()});
      });

      if (selectedCategory !== "인기매물") {
        ProductsData.sort((a, b) => {
          return b.data.time - a.data.time;
        });
      }

      setProducts(ProductsData);
      setIsLoading(false);
    };

    const unsubscribe = onSnapshot(q, handleSnapshot);

    return () => {
      unsubscribe();
    };
  }, [selectedCategory, dispatch, isLoggedIn, loginID, nickname]);

  return (
    <>
      <Header />

      {isLoading ? (
        <PulseLoader margin={10} size={12} color={"#fd9253"} className="loader" />
      ) : !isLoading && products.length === 0 ? (
        <>
          <div className="empty">
            <Image src="/images/empty.webp" alt="" width={100} height={100} />텅
          </div>
          <WriteBtn />
        </>
      ) : (
        <ProductList list={products} />
      )}
      <FooterMenu />
    </>
  );
}

export default Products;
