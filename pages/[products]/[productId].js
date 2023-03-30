import React from 'react';
import ProductDetail from '@/components/product/productDetail';
import { useRouter } from 'next/router';

function ProductDetailPage(props) {
    const router = useRouter();
    const section = router.query.products;
    
    return (
        <ProductDetail section={section} data={props.ProductData}/>
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

    const response = await fetch(`https://carrot-621db-default-rtdb.firebaseio.com/${section}/${productId}.json`);
    const resData = await response.json();

    return {
        props: {
            ProductsData: resData
        },
    };
  }