import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { useContext } from "react";
import productContext from "../context";

function ProductList({ list, section }) {
  const { setIsEdit } = useContext(productContext);

  if (section == "인기매물") {
    list.sort(function (a, b) {
      return b.data.likes - a.data.likes;
    });
  } else {
    list.sort(function (a, b) {
      return b.data.time - a.data.time;
    });
  }

  return (
    <>
      <ul className={classes.list}>
        {list.map((item) => (
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
