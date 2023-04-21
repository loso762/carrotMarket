import React, {useEffect} from "react";
import ProductList from "../components/product/ProductList";
import Header from "../components/layout/Header";
import FooterMenu from "../components/layout/FooterMenu";
import SearchList from "../components/product/SearchList";
import {firestore} from "../components/firebase";
import {collection, onSnapshot} from "firebase/firestore";
import {useState} from "react";
import {useAppSelector, useAppDispatch} from "../Hooks/storeHook";
import {Item, productAction} from "../store/product-slice";
import {PulseLoader} from "react-spinners";
import {useFiltering} from "../Hooks/useFiltering";

const Near: React.FC<{ProductsData: Item[]}> = () => {
  const dispatch = useAppDispatch();

  const range = useAppSelector((state) => state.Products.range);
  const isSearch = useAppSelector((state) => state.Products.isSearch);
  const latitude = useAppSelector((state) => state.Products.latitude);
  const longitude = useAppSelector((state) => state.Products.longitude);

  const [isLoading, setIsLoading] = useState(true);
  const [products, setproducts] = useState<Item[]>();

  //검색 매물 필터링
  const {filterdProducts, Productsfilter} = useFiltering(products);

  //거리 구하는 함수
  const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  //거리 필터링
  useEffect(() => {
    setIsLoading(true);
    const lat = Number(sessionStorage.getItem("latitude"));
    const log = Number(sessionStorage.getItem("logitude"));

    dispatch(productAction.setCoordinate({latitude: lat, longitude: log}));
    dispatch(productAction.setCategory("Near"));
    const ProductRef = collection(firestore, "products");

    const unsubscribe = onSnapshot(ProductRef, (snapshot) => {
      const ProductsData = [];
      snapshot.forEach((doc) => {
        ProductsData.push({id: doc.id, data: doc.data()});
      });

      const NearList = ProductsData.filter(
        (arr) => calcDistance(latitude, longitude, arr.data.Latitude, arr.data.Longitude) <= range
      ).sort((a, b) => b.data.time - a.data.time);

      setproducts(NearList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, range, latitude, longitude]);

  const Loader = <PulseLoader margin={10} size={12} color={"#fd9253"} className="loader" />;
  const List =
    !isSearch && products ? <ProductList list={products} /> : <SearchList list={filterdProducts} />;

  return (
    <>
      <Header Productsfilter={Productsfilter} />
      {isLoading ? Loader : List}
      <FooterMenu />
    </>
  );
};

export default Near;
