import React, {useContext} from "react";
import classes from "./Category.module.css";
import ProductContext from "../context/product-context";
import Image from "next/image";
import Link from "next/link";

const ListItem = React.memo(({category}) => {
  const {setSelectedCategory} = useContext(ProductContext);

  return (
    <li onClick={() => setSelectedCategory(category)}>
      <Link href={category} className={classes.link}>
        <Image src={`/images/${category}.webp`} alt="category" width={42} height={42} />
        <p>{category}</p>
      </Link>
    </li>
  );
});

ListItem.displayName = "ListItem";

export default ListItem;
