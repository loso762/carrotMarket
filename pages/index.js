import { ProductContextProvider } from "@/components/context";
import React from "react";
import MainLayout from "../components/mainLayout";

function index(props) {
  return (
    <ProductContextProvider>
      <MainLayout />
    </ProductContextProvider>
  );
}

export default index;
