import Link from "next/link";
import classes from "./writeBtn.module.css";
import {productAction} from "../../store/product-slice";
import {useAppDispatch, useAppSelector} from "../../Hooks/storeHook";

interface Props {
  isScroll: boolean;
  hoverBtn: () => void;
}
const WriteBtn: React.FC<Props> = ({isScroll, hoverBtn}) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.User.isLoggedIn);
  const category = useAppSelector((state) => state.Products.category);

  const BtnOff = ["구매내역", "관심목록"].includes(category);

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
