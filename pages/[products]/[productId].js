import React from 'react';
import ProductDetail from '@/components/product/productDetail';

function ProductDetailPage(props) {

    return (
        <ProductDetail data={props.ProductData} />
    );
}

export default ProductDetailPage;


export async function getStaticPaths(context) {
    return {
        fallback: 'blocking',
        paths: [
            { params: {products:'의류', productId:"-NRgRXiSi7wgtf-njqJX"} }
        ]
    };
}


export async function getStaticProps(context) {
    // fetch data for a single meetup
    const section = context.params.products;
    const productId = context.params.productId;

    const response = await fetch(`https://carrot-621db-default-rtdb.firebaseio.com/products/${section}/${productId}.json`);
    const ProductData = await response.json();

    return {
        props: { 
            ProductData 
        }
    }
  }