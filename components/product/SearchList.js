import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import {useEffect, useState} from "react";
import {useNearbyLocations} from "@/Hooks/useNearbylocation";
import {firestore} from "@/components/firebase";
import {collection, getDocs} from "firebase/firestore";

function SearchList({list, range, section}) {
  const [searchList, setSearchList] = useState([]);

  list.sort((a, b) => b.data.time - a.data.time);

  const [nearProduct, nearbyLocationsFn] = useNearbyLocations(range, list);

  useEffect(() => {
    //상위 검색어 7개만 표시해주기
    const fetchSearchList = async () => {
      const search = [];
      const searchSnap = await getDocs(collection(firestore, "searchlist"));
      searchSnap.docs.forEach((doc) => search.push([doc.id, doc.data().num]));
      search.sort(function (a, b) {
        return b[1] - a[1];
      });
      setSearchList(search.slice(0, 7));
    };

    fetchSearchList();
  }, []);

  useEffect(() => {
    nearbyLocationsFn();
  }, [nearbyLocationsFn]);

  const lists = section == "내근처" ? nearProduct : list;

  return (
    <>
      {lists.length !== 0 ? (
        <ul className={classes.list}>
          {lists.map((item) => (
            <ProductItem key={item.id} id={item.id} item={item.data} />
          ))}
        </ul>
      ) : (
        <ul className={classes.searchList}>
          <p>이웃들이 많이 찾고 있어요!</p>
          {searchList.map((search, idx) => {
            return <p key={idx}>{search[0]}</p>;
          })}
        </ul>
      )}
    </>
  );
}

export default SearchList;
