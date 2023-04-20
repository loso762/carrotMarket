import React, {useRef} from "react";
import {BsSearch} from "react-icons/bs";
import {IoIosArrowBack} from "react-icons/io";
import classes from "./Header.module.css";
import {firestore} from "../firebase";
import {doc, updateDoc, setDoc, increment, getDoc} from "firebase/firestore";
import {useAppSelector, useAppDispatch} from "../../Hooks/storeHook";
import {productAction} from "../../store/product-slice";

const Header: React.FC<{Productsfilter: (value: string) => void}> = ({Productsfilter}) => {
  const dispatch = useAppDispatch();
  const searchRef = useRef<HTMLInputElement>(null);
  const category = useAppSelector((state) => state.Products.category);
  const range = useAppSelector((state) => state.Products.range);
  const isSearch = useAppSelector((state) => state.Products.isSearch);

  const SubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.current.value.trim().length !== 0) {
      Productsfilter(searchRef.current.value);

      const searchListRef = doc(firestore, "searchlist", searchRef.current.value);
      const data = await getDoc(searchListRef);

      searchRef.current.value = "";
      if (data.data()) {
        updateDoc(searchListRef, {num: increment(1)});
      } else {
        setDoc(searchListRef, {num: 1});
      }
    } else {
      alert("검색어를 입력해주세요");
    }
  };

  const Category = category === "Near" ? <p>내근처</p> : <p>{category}</p>;

  return (
    <header className={classes.ProductsHeader}>
      {!isSearch ? (
        <>
          {Category}
          <BsSearch className={classes.searchBtn} onClick={() => dispatch(productAction.Searching(true))} />
        </>
      ) : (
        <>
          <IoIosArrowBack onClick={() => dispatch(productAction.Searching(false))} />
          <form className={classes.searchBox} onSubmit={SubmitHandler}>
            <input
              placeholder="원하는 상품 검색"
              className={`${isSearch && classes.active}`}
              ref={searchRef}
            />
            <button>
              <BsSearch className={classes.searchBtn2} />
            </button>
          </form>
        </>
      )}

      {/* 범위조절옵션 */}
      {category === "Near" && (
        <select
          className={classes.rangeselect}
          onChange={(e) => dispatch(productAction.rangeChange(Number(e.target.value)))}
          defaultValue={range}>
          <option value="3">3km</option>
          <option value="5">5km</option>
          <option value="10">10km</option>
          <option value="20">20km</option>
        </select>
      )}
    </header>
  );
};

export default Header;
