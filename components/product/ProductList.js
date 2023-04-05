import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import productContext from "../context";
import { useNearbyLocations } from "@/Hooks/useNearbylocation";

function ProductList({ list, section, range }) {
  const { setIsEdit } = useContext(productContext);

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


      <Link
        href="NewProduct"
        className={`${classes.writeButton} ${IsScroll ? classes.onScroll : ""}`}
        onClick={() => setIsEdit(false)}
        onMouseOver={()=>setIsScroll(false)}
      >{
        IsScroll ? "+" : "+ 글쓰기"
      }
      </Link>
    </>
  );
}

export default ProductList;
