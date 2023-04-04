import React, { useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import classes from "./Header.module.css";

function Header({
  section,
  Productsfilter,
  searchBoxOpen,
  onSearch,
  searchBoxCancel,
  range,
  rangechange,
}) {
  const searchRef = useRef();

  const SubmitHandler = (e) => {
    e.preventDefault();
    Productsfilter(searchRef.current.value);
  };

  let searchBtn;
  if (section == "카테고리" || section == "내근처") {
    searchBtn = (
      <BsSearch className={classes.searchBtn} onClick={searchBoxOpen} />
    );
  }

  return (
    <header className={classes.ProductsHeader}>
      {!onSearch ? (
        <p>{section}</p>
      ) : (
        <IoIosArrowBack onClick={searchBoxCancel} />
      )}
      {section == "내근처" && (
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
