import { useRouter } from "next/router";
import React from "react";
import ProductList from "../../components/product/ProductList";
import Header from "@/components/Header";
import FooterMenu from "../../components/main/FooterMenu";
import { firestore } from "@/components/firebase";
import { collection, getDocs } from "firebase/firestore";

function Products(props) {
  const router = useRouter();
  const section = router.query.products;

  return (
    <>
      <Header />
      <ProductList list={props.ProductsData} section={section} />
      <FooterMenu />
    </>
  );
}

export default Products;

export async function getStaticPaths() {
  return {
    fallback: "blocking",
    paths: [{ params: { products: "의류" } }],
  };
}

export async function getStaticProps(context) {
  const section = context.params.products;
  let ProductsData = [];

  const Productlist = await getDocs(collection(firestore, "products"));

  if (section == "인기매물") {
    Productlist.forEach((doc) => {
      ProductsData.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    ProductsData = ProductsData.sort(function (a, b) {
      return b.data.likes - a.data.likes;
    }).slice(0, 5);
  } else {
    Productlist.forEach((doc) => {
      if (doc.data().category == section) {
        ProductsData.push({
          id: doc.id,
          data: doc.data(),
        });
      }
    });

    ProductsData.sort(function (a, b) {
      return b.data.time - a.data.time;
    });
  }

  return {
    props: {
      ProductsData,
    },
    revalidate: 1,
  };
}
