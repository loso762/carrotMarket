import React,{useState} from 'react';
import Link from 'next/link';
import {IoIosArrowBack} from 'react-icons/io';
import {BsSearch} from 'react-icons/bs';

import classes from './ProductsHeader.module.css';


function ProductsHeader(props) {

    const [onSearch,setOnSearch] = useState(false);

    return (
        <header className={classes.ProductsHeader}>
            <Link href="/Home"><IoIosArrowBack/></Link>
            <p>{props.section}</p>
            <div className={classes.searchBox}>
            {
                !onSearch 
                ? <BsSearch className={classes.searchBtn} onClick={()=>{setOnSearch((prev)=>!prev)}}/> 
                : ( <form>
                        <input placeholder='원하는 상품 검색'></input>
                        <BsSearch className={classes.searchBtn2} />
                    </form>)
            }
            </div>
        </header>
    );
}

export default ProductsHeader;