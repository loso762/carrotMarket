import { useRouter } from 'next/router';
import React from 'react';
import ProductList from '../../components/product/ProductList';
import ProductsHeader from '@/components/product/ProductsHeader';
import FooterMenu from '../../components/main/FooterMenu';

function Products(props) {
    const router = useRouter();
    
    const section = router.query.products;

    // console.log(props.ProductsData);
    // console.log(Object.values(props.ProductsData))

    return (
    <>
        <ProductsHeader section={section}/>
        <ProductList list={props.ProductsData} section={section}></ProductList>
        <FooterMenu/>
    </>
    );
}

export default Products;


export async function getStaticPaths() {
    
    return {
        fallback: 'blocking',
        paths: [
            { params: {products:"인기매물"} },
            { params: {products:"가구"} },
            { params: {products:"디지털기기"} },
        ]
    };
}

export async function getStaticProps(context) {
    // fetch data for a single meetup

    const section = context.params.products;

    const response = await fetch(`https://carrot-621db-default-rtdb.firebaseio.com/products/${section}.json`);
    const ProductsData = await response.json();

    return {
        props: {
            ProductsData
        },
    };
  }