import React, {useEffect, useState} from "react";
import ProductDetail from "@/components/product/productDetail";
import {useRouter} from "next/router";
import {doc, getDoc, collection} from "firebase/firestore";
import {firestore, storage} from "@/components/firebase";
import {ref, getDownloadURL} from "firebase/storage";

function ProductDetailPage(props) {
  const router = useRouter();
  const [productUrl, setproductUrl] = useState();
  const [userUrl, setuserUrl] = useState("/images/profile.jpg");
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState();

  // 매물과 작성자 프로필 사진 불러오기
  useEffect(() => {
    const itemImageRef = ref(storage, `images/${router.query.productId}`);

    async function fetchData() {
      const itemData = await getDoc(doc(collection(firestore, "products"), router.query.productId));

      setItem(itemData.data());

      const profileImageRef = ref(storage, `profile/${itemData.data().ID}`);

      getDownloadURL(profileImageRef)
        .then((url) => {
          setuserUrl(url);
        })
        .catch(() => {
          return;
        });
    }

    fetchData();

    getDownloadURL(itemImageRef).then((url) => {
      setproductUrl(url);
      setIsLoading(false);
    });
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
}

export default ProductDetailPage;
