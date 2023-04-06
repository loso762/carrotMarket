import React, { createContext, useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

const UserContext = createContext({});
export default UserContext;

export const UserContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDisplayName, setloginDisplayName] = useState("loso762");
  const [loginTemp, setloginTemp] = useState("");
  const [loginID, setloginID] = useState("");
  const [likeProducts, setlikeProducts] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      // 유저가 찜한 매물 불러오기
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
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
