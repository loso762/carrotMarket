import React, { useContext, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import classes from "./Header.module.css";
import ProductContext from "../context/product-context";
import { firestore } from "@/components/firebase";
import { doc, updateDoc, setDoc, increment, getDoc } from "firebase/firestore";

function Header({
  Productsfilter,
  searchBoxOpen,
  onSearch,
  searchBoxCancel,
  range,
  rangechange,
}) {
  const searchRef = useRef();

  const { SelectedCategory } = useContext(ProductContext);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    Productsfilter(searchRef.current.value);

    const searchListRef = doc(firestore, "searchlist", searchRef.current.value);
    const data = await getDoc(searchListRef);

    if (data.data()) {
      updateDoc(searchListRef, { num: increment(1) });
    } else {
      setDoc(searchListRef, { num: 1 });
    }

    searchRef.current.value = "";
  };

  let searchBtn;
  if (SelectedCategory == "카테고리" || SelectedCategory == "Near") {
    searchBtn = (
      <BsSearch className={classes.searchBtn} onClick={searchBoxOpen} />
    );
  }

  return (
    <header className={classes.ProductsHeader}>
      {!onSearch ? (
        <p>{SelectedCategory == "Near" ? "내근처" : SelectedCategory}</p>
      ) : (
        <IoIosArrowBack onClick={searchBoxCancel} />
      )}
      {SelectedCategory == "Near" && (
        <select
          className={classes.rangeselect}
          onChange={(e) => rangechange(e.target.value)}
          defaultValue={range}
        >
          <option value="3">3km</option>
          <option value="5">5km</option>
          <option value="10">10km</option>
        </select>
      )}
      {!onSearch ? (
        searchBtn
      ) : (
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
      )}
    </header>
  );
}

export default Header;
