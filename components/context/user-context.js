import React, {createContext, useState, useEffect, useContext} from "react";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {firestore} from "../firebase";

const UserContext = createContext({});
export default UserContext;

export const UserContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDisplayName, setloginDisplayName] = useState();
  const [loginTemp, setloginTemp] = useState("");
  const [loginID, setloginID] = useState("");
  const [likeProducts, setlikeProducts] = useState([]);

  //찜한 매물 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      const likesDocRef = collection(firestore, "users", loginID, "likesproducts");

      const unsubscribe = onSnapshot(likesDocRef, (snapshot) => {
        const ProductsData = [];
        snapshot.forEach((doc) => {
          ProductsData.push({id: doc.id, data: doc.data()});
        });
        setlikeProducts(ProductsData);
      });

      return () => unsubscribe();
    }
  }, [loginID, isLoggedIn]);

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
        setlikeProducts,
      }}>
      {props.children}
    </UserContext.Provider>
  );
};
