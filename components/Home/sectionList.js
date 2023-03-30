import React from 'react';
import Link from 'next/link';
import classes from './sectionList.module.css';

function SectionList(props) {
    
    const Sections = ["인기매물","디지털기기","생활가전","가구/인테리어","생활/주방","유아동","의류","뷰티/미용","스포츠/레저","취미/게임/음반", "도서", "티켓/교환권", "반려동물용품" , "식물" , "삽니다"];

    const SectionDBname = ["인기매물","디지털기기","가전","가구","생활","유아동","의류","뷰티","스포츠","취미", "도서", "티켓", "반려동물용품" , "식물" , "삽니다"];

    const SectionIcon = [ "🔥" ,"💻" ,"📺", "🪑","🍴" ,"🧸" ,"👔", "💄","🏓" ,"🎮" ,"📘", "🎫","🐈", "🌷","📢" ]

    return (
        <ul className={classes.sectionMenu}>
            {
                Sections.map((section,idx)=>{ 
                    return (
                        <li key={section}>
                            <Link href={SectionDBname[idx]}>
                                <h2>{SectionIcon[idx]}</h2>
                                {section}
                            </Link>
                        </li>
                    ) 
                })
            }
        </ul>
    );
}

export default SectionList;