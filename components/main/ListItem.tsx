import React from "react";
import classes from "./Category.module.css";
import Image from "next/image";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {productAction} from "../../store/product-slice";

const ListItem: React.FC<{category: string}> = React.memo(({category}) => {
  const dispatch = useDispatch();

  const clickCategory = () => {
    sessionStorage.setItem("category", category);
    dispatch(productAction.setCategory(category));
  };

  return (
    <li onClick={clickCategory}>
      <Link href={category} className={classes.link}>
        <Image src={`/images/${category}.webp`} alt="category" width={42} height={42} />
        <p>{category}</p>
      </Link>
    </li>
  );
});

ListItem.displayName = "ListItem";

export default ListItem;
