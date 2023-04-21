import React, {useEffect, useState} from "react";
import Header from "../../components/layout/Header";
import FooterMenu from "../../components/layout/FooterMenu";
import {firestore} from "../../components/firebase";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
  orderBy,
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import {PulseLoader} from "react-spinners";
import ProductList from "../../components/product/ProductList";
import {useAppDispatch, useAppSelector} from "../../Hooks/storeHook";
import {productAction} from "../../store/product-slice";
import {useFiltering} from "../../Hooks/useFiltering";
import SearchList from "../../components/product/SearchList";
import Empty from "../../components/product/Empty";

const Products: React.FC = () => {
  const dispatch = useAppDispatch();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loginID = useAppSelector((state) => state.User.loginID);
  const isLoggedIn = useAppSelector((state) => state.User.isLoggedIn);
  const nickname = useAppSelector((state) => state.User.nickname);
  const category = useAppSelector((state) => state.Products.category);
  const isSearch = useAppSelector((state) => state.Products.isSearch);

  useEffect(() => {
    dispatch(productAction.setCategory(sessionStorage.getItem("category")));
    setIsLoading(true);

    const ProductRef: CollectionReference<DocumentData> = collection(firestore, "products");

    const q = getQuery(ProductRef);

    function getQuery(ref: CollectionReference<DocumentData>) {
      if (category == "판매내역" && isLoggedIn) {
        return query(ref, where("nickname", "==", nickname));
      } else if (category == "구매내역" && isLoggedIn) {
        return query(ref, where("buyer", "==", nickname));
      } else if (category == "인기매물") {
        return query(ref, orderBy("likes", "desc"), limit(10));
      } else if (category == "관심목록" && isLoggedIn) {
        return query(ref, where("wholike", "array-contains", loginID));
      } else if (category == "카테고리" || category == "Near") {
        setIsLoading(false);
        return query(ref);
      } else {
        return query(ref, where("category", "==", category));
      }
    }

    const handleSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
      const ProductsData = [];
      snapshot.forEach((doc) => {
        ProductsData.push({id: doc.id, data: doc.data()});
      });

      if (category !== "인기매물") {
        ProductsData.sort((a, b) => {
          return b.data.time - a.data.time;
        });
      }

      setProducts(ProductsData);
      setIsLoading(false);
    };

    const unsubscribe = onSnapshot(q, handleSnapshot);

    return () => {
      unsubscribe();
    };
  }, [category, dispatch, isLoggedIn, loginID, nickname]);

  //검색 매물 필터링
  const {filterdProducts, Productsfilter} = useFiltering(products);

  const Loader = <PulseLoader margin={10} size={12} color={"#fd9253"} className="loader" />;
  const List =
    !isSearch && products ? <ProductList list={products} /> : <SearchList list={filterdProducts} />;

  return (
    <>
      <Header Productsfilter={Productsfilter} />
      {isLoading ? Loader : !isLoading && products.length === 0 ? <Empty /> : List}
      <FooterMenu />
    </>
  );
};

export default Products;
