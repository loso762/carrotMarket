import React from 'react';
import {IoIosArrowBack} from 'react-icons/io'
import Link from 'next/link';
import classes from './homeHeader.module.css';

function HomeHeader(props) {
    return (
        <header className={classes.categoryHeader}> 
            <Link href="/Home">
                <IoIosArrowBack/></Link>
                카테고리
        </header>
    );
}

export default HomeHeader;