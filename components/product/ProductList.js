import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { useContext, useEffect, useCallback, useState } from "react";
import productContext from "../context";

  
function ProductList({ list, section, range }) {
  const { setIsEdit, longitude:myLng, latitude:myLat } = useContext(productContext);
  const [nearProduct, setNearProduct] = useState([]); 

  //내 위치와 게시물 간의 위치 구하는 함수
  const calcDistance = useCallback( (lat1, lng1, lat2, lng2) => {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return parseFloat(d.toFixed(1)); 
  },[])

  const nearbyLocationsFn = (myLat, myLng, range) => {
    // range 값으로 필터링
    const NearList = list.filter(list => calcDistance(myLat, myLng, list.data.Latitude, list.data.Longitude) <= range );
    
    NearList.sort(function (a, b) {
      return b.data.time - a.data.time;
    });
    
    setNearProduct(NearList);
  }

  useEffect(()=>{
    nearbyLocationsFn(myLat, myLng, range);
  },[myLat, myLng, range])

  const lists = section == "내근처" ? nearProduct : list

  return (
    <>
      <ul className={classes.list}>
        {
          lists.map((item) => (
            <ProductItem key={item.id} id={item.id} item={item.data} />
          ))
        }
      </ul>

      <Link
        href="NewProduct"
        className={classes.writeButton}
        onClick={() => setIsEdit(false)}
      >
        {" "}
        + 글쓰기
      </Link>
    </>
  );
}

export default ProductList;
