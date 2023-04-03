import React, { createContext, useState } from "react";

const ProductContext = createContext({});
export default ProductContext;

export const ProductContextProvider = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [SelectedCategory, setSelectedCategory] = useState(false);

  return (
    <ProductContext.Provider
      value={{ isEdit, setIsEdit, setSelectedCategory, SelectedCategory }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};
