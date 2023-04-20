import React from "react";
import classes from "./Category.module.css";
import ListItem from "./ListItem";
import {useAppSelector} from "../../Hooks/storeHook";

const SectionList: React.FC = () => {
  const categoryList = useAppSelector((state) => state.Products.categoryList);

  return (
    <ul className={classes.categoryMenu}>
      {categoryList.map((c) => {
        return <ListItem key={c} category={c} />;
      })}
    </ul>
  );
};

export default SectionList;
