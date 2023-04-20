import FooterMenu from "../components/layout/FooterMenu";
import Mypage from "../components/user/mypage";
import Login from "../components/user/login";
import {useAppSelector} from "../Hooks/storeHook";
import {useLocations} from "../Hooks/useLocations";

const Index: React.FC = () => {
  const isLoggedIn = useAppSelector((state) => state.User.isLoggedIn);
  useLocations();

  return (
    <>
      {isLoggedIn ? <Mypage /> : <Login />}
      <FooterMenu />
    </>
  );
};

export default Index;
