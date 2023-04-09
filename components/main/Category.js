import React, {useContext} from "react";
import classes from "./Category.module.css";
import ProductContext from "../context/product-context";
import Image from "next/image";
import Link from "next/link";

function SectionList() {
  const {setSelectedCategory, category} = useContext(ProductContext);

  return (
    <ul className={classes.categoryMenu}>
      {category.map((category) => {
        return (
          <li key={category} onClick={() => setSelectedCategory(category)}>
            <Link href={category} className={classes.link}>
              <Image src={`/images/${category}.png`} alt="category" width={42} height={42} />
              <p>{category}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default SectionList;
