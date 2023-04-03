import React, { useContext } from "react";
import ProductDetail from "@/components/product/productDetail";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/components/firebase";

function ProductDetailPage(props) {
  const router = useRouter();

  return <ProductDetail data={props.ProductData} id={router.query.productId} />;
}

export default ProductDetailPage;

export async function getStaticPaths(context) {
  return {
    fallback: "blocking",
    paths: [{ params: { products: "의류", productId: "1680533245121_의류" } }],
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup
  const productId = context.params.productId;

  const docRef = doc(firestore, "products", productId);
  const docSnap = await getDoc(docRef);

  let ProductData = docSnap.data();

  return {
    props: {
      ProductData,
    },
    revalidate: 1,
  };
}
