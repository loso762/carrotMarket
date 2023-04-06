import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { useContext, useEffect } from "react";
import productContext from "../context/product-context";
import { useNearbyLocations } from "@/Hooks/useNearbylocation";

function SearchList({ list, range, section }) {
  list.sort(function (a, b) {
    return b.data.time - a.data.time;
  });

  const [nearProduct, nearbyLocationsFn] = useNearbyLocations(range, list);

  useEffect(() => {
    nearbyLocationsFn();
  }, [nearbyLocationsFn]);

  const lists = section == "내근처" ? nearProduct : list;

  return (
    <ul className={classes.list}>
      {lists.map((item) => (
        <ProductItem key={item.id} id={item.id} item={item.data} />
      ))}
    </ul>
  );
}

export default SearchList;
