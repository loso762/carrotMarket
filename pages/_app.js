import "@/styles/globals.css";
import { ProductContextProvider } from "@/components/context";

export default function App({ Component, pageProps }) {
  return (
    <ProductContextProvider>
      <Component {...pageProps} />
    </ProductContextProvider>
  );
}
