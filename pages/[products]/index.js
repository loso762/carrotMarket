import React, {useEffect, useContext, useState} from "react";
import Header from "@/components/layout/Header";
import FooterMenu from "../../components/layout/FooterMenu";
import {firestore} from "@/components/firebase";
import {collection, limit, onSnapshot, query, where, orderBy} from "firebase/firestore";
import UserContext from "@/components/context/user-context";
import ProductContext from "@/components/context/product-context";
import Image from "next/image";
import {PulseLoader} from "react-spinners";
import ProductList from "@/components/product/ProductList";

function Products() {
  const [products, setproducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {loginDisplayName, loginID} = useContext(UserContext);
  const {setSelectedCategory, SelectedCategory} = useContext(ProductContext);

  useEffect(() => {
    setSelectedCategory(sessionStorage.getItem("category"));
    setIsLoading(true);
    const ProductRef = collection(firestore, "products");

    let q;

    if (SelectedCategory == "판매내역") {
      q = query(ProductRef, where("nickname", "==", loginDisplayName));
    } else if (SelectedCategory == "구매내역") {
      q = query(ProductRef, where("buyer", "==", loginDisplayName));
    } else if (SelectedCategory == "인기매물") {
      q = query(ProductRef, orderBy("likes", "desc"), limit(10));
    } else if (SelectedCategory == "관심목록") {
      q = query(ProductRef, where("wholike", "array-contains", loginID));
    } else if (SelectedCategory == "카테고리") {
      setIsLoading(false);
      return;
    } else if (SelectedCategory == "Near") {
      setIsLoading(false);
      return;
    } else {
      q = query(ProductRef, where("category", "==", SelectedCategory));
    }

    onSnapshot(q, (snapshot) => {
      const ProductsData = [];
      snapshot.forEach((doc) => {
        ProductsData.push({id: doc.id, data: doc.data()});
      });

      if (SelectedCategory !== "인기매물") {
        ProductsData.sort((a, b) => {
          return b.data.time - a.data.time;
        });
      }
      setproducts(ProductsData);
      setIsLoading(false);
    });
  }, [SelectedCategory, loginDisplayName, loginID, setSelectedCategory]);

  return (
    <>
      <Header />

      {isLoading ? (
        <PulseLoader margin={10} size={12} color={"#fd9253"} className="loader" />
      ) : !isLoading && products.length === 0 ? (
        <div className="empty">
          <Image src="/images/empty.webp" alt="" width={100} height={100} />텅
        </div>
      ) : (
        <ProductList list={products} />
      )}

      <FooterMenu />
    </>
  );
}

export default Products;
