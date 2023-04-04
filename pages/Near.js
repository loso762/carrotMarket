import React from "react";
import ProductList from "@/components/product/ProductList";
import ProductsHeader from "@/components/product/ProductsHeader";
import FooterMenu from "@/components/main/FooterMenu";
import { firestore } from "@/components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";

function Near(props) {
  const [searchRange, setSearchRange] = useState(10); // 검색 지역 범위

  const searchRangeHandler = (range) => {
    setSearchRange(range)
  }
  
  return (
    <>
      <ProductsHeader
        section="내근처" 
        near={true} 
        range={searchRange}
        rangechange={searchRangeHandler}
      />
      <ProductList 
        list={props.ProductsData} 
        section="내근처" 
        range={searchRange}
      />
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
