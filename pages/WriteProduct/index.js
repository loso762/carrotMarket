import WriteProduct from "@/components/product/WriteProduct";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/components/firebase";

function NewProduct() {
  return <WriteProduct />;
}

export default NewProduct;
