import React, { useEffect, useState } from "react";
import ProductDetail from "@/components/product/productDetail";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { firestore, storage } from "@/components/firebase";
import { ref, getDownloadURL } from "firebase/storage";

function ProductDetailPage(props) {
  const router = useRouter();
  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const imageRef = ref(storage, `images/${router.query.productId}`);
  useEffect(() => {
    getDownloadURL(imageRef).then((url) => {
      setImage(url);
      setIsLoading(false);
    });
  }, [imageRef]);

  return (
    <>
      <ProductDetail
        item={props.ProductData}
        id={router.query.productId}
        url={image}
        isLoading={isLoading}
      />
    </>
  );
}

export default ProductDetailPage;

export async function getStaticPaths(context) {
  return {
    fallback: "blocking",
    paths: [{ params: { products: "의류", productId: "1680885265084" } }],
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
