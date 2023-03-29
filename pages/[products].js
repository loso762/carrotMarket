import { useRouter } from 'next/router';
import React from 'react';
import ProductList from './../components/ProductList';

function Products(props) {
    const router = useRouter();
    
    const section = router.query.products;

    // console.log(props.ProductsData);
    // console.log(Object.values(props.ProductsData))

    return (
    <>
        <header> {section} </header>
        <ProductList list={props.ProductsData}></ProductList>
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

    const response = await fetch(`https://carrot-621db-default-rtdb.firebaseio.com/${section}.json`);
    const resData = await response.json();

    return {
        props: {
            ProductsData: resData
        },
    };
  }