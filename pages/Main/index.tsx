import Header from "../../components/layout/Header";
import React, {useState} from "react";
import Category from "../../components/main/Category";
import FooterMenu from "../../components/layout/FooterMenu";
import {firestore} from "../../components/firebase";
import {collection, getDocs} from "firebase/firestore";
import SearchList from "../../components/product/SearchList";
import {Item} from "../../store/product-slice";
import {useAppSelector} from "../../Hooks/storeHook";

const Main: React.FC<{ProductsData: Item[]}> = (props) => {
  const [filterdProducts, setfilterdProducts] = useState([]);
  const isSearch = useAppSelector((state) => state.Products.isSearch);

  //검색어로 제품 필터링하기
  const Productsfilter = async (filter: string) => {
    const tempData = [];

    props.ProductsData.forEach((product) => {
      if (product.data.title.includes(filter)) {
        tempData.push(product);
      }
    });

    setfilterdProducts(tempData);
  };

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
