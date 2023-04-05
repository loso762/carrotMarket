import "@/styles/globals.css";
import { ProductContextProvider } from "@/components/product-context";
import { UserContextProvider } from "@/components/user-context";

export default function App({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <ProductContextProvider>
        <Component {...pageProps} />
      </ProductContextProvider>
    </UserContextProvider>
  );
}
