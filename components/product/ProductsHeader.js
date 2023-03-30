import React from 'react';
import Link from 'next/link';
import {IoIosArrowBack} from 'react-icons/io';
import classes from './ProductsHeader.module.css';

function ProductsHeader(props) {
    return (
        <header className={classes.ProductsHeader}>
            <Link href="/Home"><IoIosArrowBack/></Link>
            <p>{props.section}</p>
            <form>
                <input placeholder='원하는 상품 검색'></input>
                <button>검색</button>
            </form>
            <Link href="NewProduct">글쓰기</Link>
        </header>
    );
}

export default ProductsHeader;