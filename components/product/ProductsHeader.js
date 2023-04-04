import React,{useState} from 'react';
import {BsSearch} from 'react-icons/bs';

import classes from './ProductsHeader.module.css';


function ProductsHeader(props) {
    const [onSearch,setOnSearch] = useState(false);

    return (
        <header className={classes.ProductsHeader}>
            <p>{props.section}</p>
            {
                props.near 
                ?(
                    <select 
                        className={classes.rangeselect} 
                        onChange={(e)=>props.rangechange(e.target.value)}
                        defaultValue={props.range}
                    >
                        <option value="3">3km</option>
                        <option value="5">5km</option>
                        <option value="10">10km</option>
                    </select>
                    
                ) 
                : <div className={classes.searchBox}>
                {
                    !onSearch 
                    ? <BsSearch className={classes.searchBtn} onClick={()=>{setOnSearch((prev)=>!prev)}}/> 
                    : ( <form>
                            <input placeholder='원하는 상품 검색'></input>
                            <BsSearch className={classes.searchBtn2} />
                        </form>)
                }
                </div>
            }
            
        </header>
    );
}

export default ProductsHeader;