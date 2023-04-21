import Header from "../../components/layout/Header";
import React, {useState} from "react";
import Category from "../../components/main/Category";
import FooterMenu from "../../components/layout/FooterMenu";
import {firestore} from "../../components/firebase";
import {collection, getDocs} from "firebase/firestore";
import SearchList from "../../components/product/SearchList";
import {Item} from "../../store/product-slice";
import {useAppSelector} from "../../Hooks/storeHook";
import {useFiltering} from "../../Hooks/useFiltering";

const Main: React.FC<{ProductsData: Item[]}> = (props) => {
  const isSearch = useAppSelector((state) => state.Products.isSearch);
  const {filterdProducts, Productsfilter} = useFiltering(props.ProductsData);

  return (
    <>
      <Header Productsfilter={Productsfilter} />
      {isSearch ? <SearchList list={filterdProducts} /> : <Category />}
      <FooterMenu />
    </>
  );
};

export default Main;

export async function getStaticProps() {
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
