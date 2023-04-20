import classes from "./ProductList.module.css";
import ProductItem from "./ProductItem";
import {useCallback, useEffect, useState} from "react";
import {firestore} from "../../components/firebase";
import {collection, getDocs} from "firebase/firestore";
import {useAppSelector} from "../../Hooks/storeHook";
import {Item} from "../../store/product-slice";

const SearchList: React.FC<{list: Item[]}> = ({list}) => {
  const [searchList, setSearchList] = useState([]);
  const [isError, setIsError] = useState(false);
  const loginID = useAppSelector((state) => state.User.loginID);

  list.sort((a, b) => b.data.time - a.data.time);

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

  //자신의 글 좋아요 누른경우
  const errorHandler = useCallback(() => {
    setIsError(true);

    setTimeout(() => {
      setIsError(false);
    }, 1000);
  }, []);

  return (
    <>
      {list.length !== 0 ? (
        <ul className={classes.list}>
          {list.map((item) => (
            <ProductItem
              errorHandler={errorHandler}
              key={item.id}
              id={item.id}
              item={item.data}
              isliked={item.data.wholike.includes(loginID)}
            />
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
      <div className={`${classes.errorBox} ${!isError && classes.hide}`}>
        본인의 글에는 좋아요를 누르실 수 없습니다
      </div>
    </>
  );
};

export default SearchList;
