import NewProductForm from "@/components/product/newProductForm";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/components/firebase";

function NewProduct() {
  return <NewProductForm />;
}

export default NewProduct;
