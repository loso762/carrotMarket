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

  useEffect(() => {
    if (isLoggedIn) {
      const likesDocRef = collection(firestore, "products");
      const q = query(likesDocRef, where("wholike", "array-contains", loginID));

      const unsubscribe = onSnapshot(q, (snapshot) => {
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
