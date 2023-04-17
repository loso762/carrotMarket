import React from "react";
import classes from "./Category.module.css";
import ListItem from "./ListItem";
import {useSelector} from "react-redux";

const SectionList = () => {
  const category = useSelector((state) => state.Products.category);

  return (
    <ul className={classes.categoryMenu}>
      {category.map((item) => {
        return <ListItem key={item} category={item} />;
      })}
    </ul>
  );
};

export default SectionList;
