import React, {useContext, useRef} from "react";
import {BsSearch} from "react-icons/bs";
import {IoIosArrowBack} from "react-icons/io";
import classes from "./Header.module.css";
import ProductContext from "../context/product-context";
import {firestore} from "@/components/firebase";
import {doc, updateDoc, setDoc, increment, getDoc} from "firebase/firestore";

function Header({Productsfilter, searchBoxOpen, onSearch, searchBoxCancel, range, rangechange}) {
  const searchRef = useRef();
  const {SelectedCategory} = useContext(ProductContext);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    Productsfilter(searchRef.current.value);

    const searchListRef = doc(firestore, "searchlist", searchRef.current.value);
    const data = await getDoc(searchListRef);

    searchRef.current.value = "";
    if (data.data()) {
      updateDoc(searchListRef, {num: increment(1)});
    } else {
      setDoc(searchListRef, {num: 1});
    }
  };

  const Category = SelectedCategory == "Near" ? <p>내근처</p> : <p>{SelectedCategory}</p>;

  const searchBtn = (SelectedCategory == "카테고리" || SelectedCategory == "Near") && (
    <BsSearch className={classes.searchBtn} onClick={searchBoxOpen} />
  );

  return (
    <header className={classes.ProductsHeader}>
      {!onSearch ? (
        <>
          {Category}
          {searchBtn}
        </>
      ) : (
        <>
          <IoIosArrowBack onClick={searchBoxCancel} />
          <form className={classes.searchBox} onSubmit={SubmitHandler}>
            <input
              placeholder="원하는 상품 검색"
              className={`${onSearch && classes.active}`}
              ref={searchRef}
            />
            <button>
              <BsSearch className={classes.searchBtn2} />
            </button>
          </form>
        </>
      )}

      {/* 범위조절옵션 */}
      {SelectedCategory == "Near" && (
        <select
          className={classes.rangeselect}
          onChange={(e) => rangechange(e.target.value)}
          defaultValue={range}>
          <option value="3">3km</option>
          <option value="5">5km</option>
          <option value="10">10km</option>
        </select>
      )}
    </header>
  );
}

export default Header;
