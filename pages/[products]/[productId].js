import React, {useEffect, useState} from "react";
import ProductDetail from "@/components/product/productDetail";
import {useRouter} from "next/router";
import {doc, getDoc} from "firebase/firestore";
import {firestore, storage} from "@/components/firebase";
import {ref, getDownloadURL} from "firebase/storage";

function ProductDetailPage(props) {
  const router = useRouter();
  const [productUrl, setproductUrl] = useState();
  const [userUrl, setuserUrl] = useState("/images/profile.jpg");
  const [isLoading, setIsLoading] = useState(true);

  const imageRef = ref(storage, `images/${router.query.productId}`);
  const imageRef2 = ref(storage, `profile/${props.ProductData.userName}`);

  useEffect(() => {
    getDownloadURL(imageRef).then((url) => {
      setproductUrl(url);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    getDownloadURL(imageRef2)
      .then((url) => {
        setuserUrl(url);
      })
      .catch(() => {
        return;
      });
  }, []);

  return (
    <ProductDetail
      item={props.ProductData}
      id={router.query.productId}
      productUrl={productUrl}
      userUrl={userUrl}
      isLoading={isLoading}
    />
  );
}

export default ProductDetailPage;

export async function getStaticPaths(context) {
  return {
    fallback: "blocking",
    paths: [{params: {products: "의류", productId: "1680885265084"}}],
  };
}

export async function getStaticProps(context) {
  const productId = context.params.productId;

  const docRef = doc(firestore, "products", productId);
  const docSnap = await getDoc(docRef);

  let ProductData = docSnap.data();

  return {
    props: {ProductData},
    revalidate: 1,
  };
}
