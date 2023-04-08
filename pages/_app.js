import "@/styles/globals.css";
import { ProductContextProvider } from "@/components/context/product-context";
import { UserContextProvider } from "@/components/context/user-context";

export default function App({ Component, pageProps }) {
  return (
    <ProductContextProvider>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ProductContextProvider>
  );
}
