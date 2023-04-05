import React from "react";
import ProductList from "@/components/product/ProductList";
import Header from "@/components/layout/Header";
import FooterMenu from "@/components/layout/FooterMenu";
import { firestore } from "@/components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import SearchList from "@/components/product/SearchList";

function Near(props) {
  const [searchRange, setSearchRange] = useState(10); // 검색 지역 범위
  const [onSearch, setOnSearch] = useState(false);
  const [filterdProducts, setfilterdProducts] = useState([]);

  const searchRangeHandler = (range) => {
    setSearchRange(range);
  };

  const searchBoxCancel = (e) => {
    e.stopPropagation();
    setOnSearch(false);
  };

  const searchBoxOpen = (e) => {
    e.stopPropagation();
    setOnSearch(true);
  };

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
        onSearch={onSearch}
        searchBoxCancel={searchBoxCancel}
        searchBoxOpen={searchBoxOpen}
        Productsfilter={Productsfilter}
      />
      {onSearch ? (
        <SearchList
          list={filterdProducts}
          range={searchRange}
          section="내근처"
        />
      ) : (
        <ProductList
          list={props.ProductsData}
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
    ProductsData.push({
      id: doc.id,
      data: doc.data(),
    });
  });

  return {
    props: {
      ProductsData,
    },
    revalidate: 1,
  };
}
