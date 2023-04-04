import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { useContext, useEffect, useCallback, useState } from "react";
import productContext from "../context";
import { useNearbyLocations } from "@/Hooks/useNearbylocation";

function ProductList({ list, section, range }) {
  const { setIsEdit } = useContext(productContext);

  const [nearProduct, nearbyLocationsFn] = useNearbyLocations(range, list);

  useEffect(() => {
    nearbyLocationsFn();
  }, [nearbyLocationsFn]);

  const lists = section == "내근처" ? nearProduct : list;

  return (
    <>
      <ul className={classes.list}>
        {lists.map((item) => (
          <ProductItem key={item.id} id={item.id} item={item.data} />
        ))}
      </ul>

      <Link
        href="NewProduct"
        className={classes.writeButton}
        onClick={() => setIsEdit(false)}
      >
        {" "}
        + 글쓰기
      </Link>
    </>
  );
}

export default ProductList;
