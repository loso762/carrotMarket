import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import classes from "./writeBtn.module.css";
import {productAction} from "@/store/product-slice";

const WriteBtn = ({isScroll, hoverBtn}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.User.isLoggedIn);
  const selectedCategory = useSelector((state) => state.Products.selectedCategory);

  const BtnOff = ["구매내역", "관심목록"].includes(selectedCategory);

  return (
    <>
      {isLoggedIn && !BtnOff && (
        <Link
          href="WriteProduct"
          className={`${classes.writeButton} ${isScroll && classes.onScroll}`}
          onClick={() => dispatch(productAction.setisEdit(false))}
          onMouseOver={hoverBtn}>
          +{!isScroll && " 글쓰기"}
        </Link>
      )}
    </>
  );
};

export default WriteBtn;
