import React from 'react';
import FooterMenu from './main/FooterMenu';
import Mypage from './main/mypage';

function MainLayout(props) {
    return (
        <>
            <Mypage></Mypage>
            <FooterMenu></FooterMenu>
        </>
    );
}

export default MainLayout;