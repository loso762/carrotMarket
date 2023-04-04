import classes from "./product/ProductList.module.css";
import ProductItem from "./product/ProductItem";
import Link from "next/link";
import { useCallback, useContext, useEffect } from "react";
import productContext from "./context";
import { useNearbyLocations } from "@/Hooks/useNearbylocation";

function SearchList({ list, range, section }) {
  const { setIsEdit } = useContext(productContext);

  list.sort(function (a, b) {
    return b.data.time - a.data.time;
  });

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

export default SearchList;
