import { useRouter } from "next/router";
import React from "react";
import ProductList from "@/components/product/ProductList";
import ProductsHeader from "@/components/product/ProductsHeader";
import FooterMenu from "@/components/main/FooterMenu";
import { firestore } from "@/components/firebase";
import { collection, getDocs } from "firebase/firestore";

function Near(props) {
  const router = useRouter();
  const section = router.query.products;

  return (
    <>
      <ProductsHeader section={section} />
      <ProductList list={props.ProductsData} section={section} />
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
