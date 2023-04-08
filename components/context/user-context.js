import React, { createContext, useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";

const UserContext = createContext({});
export default UserContext;

export const UserContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDisplayName, setloginDisplayName] = useState("loso762");
  const [loginTemp, setloginTemp] = useState("");
  const [loginID, setloginID] = useState("");
  const [likeProducts, setlikeProducts] = useState([]);
  const [sellProducts, setsellProducts] = useState([]);
  const [buyProducts, setBuyProducts] = useState([]);

  //찜한 매물 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      async function fetchLikeProducts(context) {
        let ProductsData = [];

        const likesDocRef = collection(
          firestore,
          "users",
          loginID,
          "likesproducts"
        );

        const Productlist = await getDocs(likesDocRef);

        Productlist.forEach((doc) => {
          ProductsData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setlikeProducts(ProductsData);
      }
      fetchLikeProducts();
    }
  }, [loginID, isLoggedIn]);

  //판매하는 매물 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      async function fetchSellProducts(context) {
        let ProductsData = [];

        const sellListRef = collection(firestore, "products");

        const q = query(sellListRef, where("userName", "==", loginDisplayName));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          ProductsData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setsellProducts(ProductsData);
      }
      fetchSellProducts();
    }
  }, [loginDisplayName, isLoggedIn]);

  //구매한 매물 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      async function fetchBuyProducts(context) {
        let ProductsData = [];

        const buyListRef = collection(firestore, "products");

        const q = query(buyListRef, where("buyer", "==", loginDisplayName));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          ProductsData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setBuyProducts(ProductsData);
      }
      fetchBuyProducts();
    }
  }, [loginDisplayName, isLoggedIn]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loginDisplayName,
        setloginDisplayName,
        loginID,
        setloginID,
        loginTemp,
        setloginTemp,
        likeProducts,
        sellProducts,
        buyProducts,
        setsellProducts,
        setlikeProducts,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
