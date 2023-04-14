import React, {useEffect, useState} from "react";
import ProductDetail from "@/components/product/productDetail";
import {useRouter} from "next/router";
import {doc, collection, onSnapshot} from "firebase/firestore";
import {firestore, storage} from "@/components/firebase";
import {ref, getDownloadURL} from "firebase/storage";

const ProductDetailPage = () => {
  const router = useRouter();
  const [productUrl, setproductUrl] = useState();
  const [userUrl, setuserUrl] = useState("/images/profile.jpg");
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState();

  // 매물과 작성자 프로필 사진 불러오기
  useEffect(() => {
    const fetchData = async () => {
      if (router.query.productId) {
        const ProductRef = doc(collection(firestore, "products"), router.query.productId);
        onSnapshot(ProductRef, (item) => {
          setItem(item.data());

          if (item.data()) {
            getDownloadURL(ref(storage, `profile/${item.data().ID}`))
              .then((url) => {
                setuserUrl(url);
              })
              .catch(() => {
                return;
              });
          }

          const itemImageRef = ref(storage, `images/${router.query.productId}`);
          getDownloadURL(itemImageRef).then((url) => {
            setproductUrl(url);
            setIsLoading(false);
          });
        });
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router.query.productId]);

  return (
    <>
      {item && (
        <ProductDetail
          item={item}
          id={router.query.productId}
          productUrl={productUrl}
          userUrl={userUrl}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ProductDetailPage;
