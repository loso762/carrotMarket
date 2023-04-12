import React, {useContext} from "react";
import classes from "./Category.module.css";
import ProductContext from "../context/product-context";
import ListItem from "./ListItem";

const SectionList = () => {
  const {category} = useContext(ProductContext);

  return (
    <ul className={classes.categoryMenu}>
      {category.map((category) => {
        return <ListItem key={category} category={category} />;
      })}
    </ul>
  );
};

export default SectionList;
