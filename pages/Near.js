import React, {useEffect} from "react";
import ProductList from "@/components/product/ProductList";
import Header from "@/components/layout/Header";
import FooterMenu from "@/components/layout/FooterMenu";
import {firestore} from "@/components/firebase";
import {collection, getDocs} from "firebase/firestore";
import {useState, useContext} from "react";
import SearchList from "@/components/product/SearchList";
import ProductContext from '@/components/context/product-context';


function Near(props) {
  
  const {setSelectedCategory} = useContext(ProductContext);

  const [searchRange, setSearchRange] = useState(10); // 검색 지역 범위
  const [isSearching, setIsSearching] = useState(false);
  const [filterdProducts, setfilterdProducts] = useState([]);

  useEffect(()=>{
    sessionStorage.setItem("category","Near");
    setSelectedCategory(sessionStorage.getItem("category"));
  },[setSelectedCategory])

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

    props.ProductsData.forEach((product) => {
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
        <ProductList
          list={isSearching ? filterdProducts : props.ProductsData}
          section="내근처"
          range={searchRange}
        />
      ) : (
        <SearchList
          list={isSearching ? filterdProducts : props.ProductsData}
          section="내근처"
          range={searchRange}
        />
      )}

      <FooterMenu />
    </>
  );
}

export default Near;

export async function getStaticProps(context) {
  let ProductsData = [];

  const Productlist = await getDocs(collection(firestore, "products"));

  Productlist.forEach((doc) => {
    ProductsData.push({id: doc.id, data: doc.data()});
  });

  return {
    props: {ProductsData},
    revalidate: 1,
  };
}
