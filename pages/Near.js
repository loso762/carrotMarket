import React, {useEffect} from "react";
import ProductList from "@/components/product/ProductList";
import Header from "@/components/layout/Header";
import FooterMenu from "@/components/layout/FooterMenu";
import {firestore} from "@/components/firebase";
import {collection, onSnapshot} from "firebase/firestore";
import {useState, useContext} from "react";
import SearchList from "@/components/product/SearchList";
import ProductContext from "@/components/context/product-context";

function Near(props) {
  const {setSelectedCategory} = useContext(ProductContext);

  const [products, setproducts] = useState([]);
  const [searchRange, setSearchRange] = useState(10); // 검색 지역 범위
  const [isSearching, setIsSearching] = useState(false);
  const [filterdProducts, setfilterdProducts] = useState([]);

  useEffect(() => {
    sessionStorage.setItem("category", "Near");
    setSelectedCategory(sessionStorage.getItem("category"));
  }, [setSelectedCategory]);

  useEffect(() => {
    const ProductRef = collection(firestore, "products");

    const unsubscribe = onSnapshot(ProductRef, (snapshot) => {
      const ProductsData = [];
      snapshot.forEach((doc) => {
        ProductsData.push({id: doc.id, data: doc.data()});
      });
      setproducts(ProductsData);
    });

    return () => unsubscribe();
  }, []);

  //검색범위 지정
  const searchRangeHandler = (range) => {
    setSearchRange(range);
  };

  const searchBoxCancel = (e) => {
    e.stopPropagation();
    setIsSearching(false);
  };

  const searchBoxOpen = (e) => {
    e.stopPropagation();
    setIsSearching(true);
  };

  //검색 매물 필터링
  function Productsfilter(filter) {
    const tempData = [];

    products.forEach((product) => {
      if (product.data.title.includes(filter)) {
        tempData.push(product);
      }
    });

    setfilterdProducts(tempData);
  }

  return (
    <>
      <Header
        near={true}
        range={searchRange}
        rangechange={searchRangeHandler}
        onSearch={isSearching}
        searchBoxCancel={searchBoxCancel}
        searchBoxOpen={searchBoxOpen}
        Productsfilter={Productsfilter}
      />

      {!isSearching ? (
        <ProductList list={isSearching ? filterdProducts : products} section="내근처" range={searchRange} />
      ) : (
        <SearchList list={isSearching ? filterdProducts : products} section="내근처" range={searchRange} />
      )}

      <FooterMenu />
    </>
  );
}

export default Near;
