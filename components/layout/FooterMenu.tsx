import classes from "./FooterMenu.module.css";
import {AiFillHome, AiOutlineHome} from "react-icons/ai";
import {MdOutlineLocationOn, MdLocationOn} from "react-icons/md";
import {BsChatDots, BsFillChatDotsFill} from "react-icons/bs";
import {CgProfile} from "react-icons/cg";
import {useRouter} from "next/router";
import {useAppDispatch} from "../../Hooks/storeHook";
import {productAction} from "../../store/product-slice";

const FooterMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const clickHomeBtn = () => {
    router.push("/Main");
    dispatch(productAction.setCategory("카테고리"));
    dispatch(productAction.Searching(false));
    sessionStorage.setItem("category", "카테고리");
  };

  const clickNearBtn = () => {
    router.push("/Near");
    dispatch(productAction.setCategory("Near"));
    dispatch(productAction.Searching(false));
    sessionStorage.setItem("category", "Near");
  };

  return (
    <ul className={classes.footer}>
      <li onClick={clickHomeBtn}>{router.route == "/Main" ? <AiFillHome /> : <AiOutlineHome />}홈</li>
      <li onClick={clickNearBtn}>
        {router.route == "/Near" ? <MdLocationOn /> : <MdOutlineLocationOn />}내근처
      </li>
      <li onClick={() => router.push("/Chat")}>
        {router.route == "/Chat" ? <BsFillChatDotsFill /> : <BsChatDots />}
        채팅
      </li>
      <li onClick={() => router.push("/")}>
        <CgProfile />
        나의당근
      </li>
    </ul>
  );
};

export default FooterMenu;
