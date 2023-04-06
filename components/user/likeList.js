import classes from "../product/ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useNearbyLocations } from "@/Hooks/useNearbylocation";
import UserContext from "../context/user-context";
import ProductContext from "../context/product-context";

function LikeList({ list, section, range }) {
  const { setIsEdit } = useContext(ProductContext);
  const { isLoggedIn } = useContext(UserContext);

  const [nearProduct, nearbyLocationsFn] = useNearbyLocations(range, list);
  const [IsScroll, setIsScroll] = useState(false);

  const handleScroll = () => {
    setIsScroll(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      window.addEventListener("scroll", handleScroll);
    }, 100);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    nearbyLocationsFn();
  }, [nearbyLocationsFn]);

  const lists = section == "내근처" ? nearProduct : list;

  return (
    <>
      <ul className={classes.list} onScroll={handleScroll}>
        {lists.map((item) => (
          <ProductItem key={item.id} id={item.id} item={item.data} />
        ))}
      </ul>

      {isLoggedIn && (
        <Link
          href="WriteProduct"
          className={`${classes.writeButton} ${
            IsScroll ? classes.onScroll : ""
          }`}
          onClick={() => setIsEdit(false)}
          onMouseOver={() => setIsScroll(false)}
        >
          {IsScroll ? "+" : "+ 글쓰기"}
        </Link>
      )}
    </>
  );
}

export default LikeList;
