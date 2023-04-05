import Header from "@/components/layout/Header";
import React, { useState } from "react";
import Categories from "../../components/category/Categories";
import FooterMenu from "@/components/layout/FooterMenu";
import ProductList from "@/components/product/ProductList";
import { firestore } from "@/components/firebase";
import { collection, getDocs } from "firebase/firestore";
import SearchList from "@/components/product/SearchList";

function Main(props) {
  const [onSearch, setOnSearch] = useState(false);
  const [filterdProducts, setfilterdProducts] = useState([]);

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
        onSearch={onSearch}
        searchBoxCancel={searchBoxCancel}
        searchBoxOpen={searchBoxOpen}
        Productsfilter={Productsfilter}
      />
      {onSearch ? <SearchList list={filterdProducts} /> : <Categories />}
      <FooterMenu searchBoxCancel={searchBoxCancel} />
    </>
  );
}

export default Main;

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
