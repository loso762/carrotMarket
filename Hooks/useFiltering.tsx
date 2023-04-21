import {useState} from "react";
import {Item} from "../store/product-slice";

export const useFiltering = (products: Item[]) => {
  const [filterdProducts, setfilterdProducts] = useState<Item[]>();

  const Productsfilter = (filter: string) => {
    const tempData: Item[] = [];
    products.forEach((product) => {
      if (product.data.title.includes(filter)) {
        tempData.push(product);
      }
    });
    if (tempData.length !== 0) {
      setfilterdProducts(tempData);
    } else {
      alert("찾으시는 상품이 없습니다!");
    }
  };

  return {filterdProducts, Productsfilter};
};
