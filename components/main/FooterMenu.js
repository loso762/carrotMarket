import React from 'react';
import Link from 'next/link';
import classes from './FooterMenu.module.css'
import {AiFillHome} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {BsChatDots} from 'react-icons/bs'
import {CgProfile} from 'react-icons/cg'

function FooterMenu(props) {
    return (
        <ul className={classes.footer}>
            <li>
                <Link href='/Home'>
                    <AiFillHome/>
                    <p>홈</p>
                </Link>
            </li>
            <li>
                <Link href='/Near'>
                    <GoLocation/>
                    <p>내근처</p>
                </Link>
            </li>
            <li>
                <Link href='/Near'>
                    <BsChatDots/>
                    <p>채팅</p>
                </Link>
            </li>
            <li>
                <Link href='/Near'>
                    <CgProfile/>
                    <p>나의당근</p>
                </Link>
            </li>
        </ul>
    );
}

export default FooterMenu;