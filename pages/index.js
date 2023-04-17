import FooterMenu from "@/components/layout/FooterMenu";
import Mypage from "@/components/user/mypage";
import Login from "@/components/user/login";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {productAction} from "@/store/product-slice";

function Index() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.User.isLoggedIn);
  const latitude = useSelector((state) => state.Products.latitude);
  const longitude = useSelector((state) => state.Products.longitude);

  useEffect(() => {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KakaoMap_API_Key}&libraries=services&autoload=false`;
    document.head.appendChild(mapScript);

    //좌표 가져오기
    navigator.geolocation.getCurrentPosition(function (position) {
      dispatch(
        productAction.setCoordinate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      );
    });

    //좌표로 동주소 가져오기
    const onLoadDong = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const dongAddress = result[0].region_3depth_name;
            dispatch(productAction.setDong(dongAddress));
          } else {
            console.error("주소 불러오기 실패!");
          }
        });
      });
    };

    latitude && longitude && mapScript.addEventListener("load", onLoadDong);
  }, [dispatch, latitude, longitude]);

  return (
    <>
      {isLoggedIn ? <Mypage /> : <Login />}
      <FooterMenu />
    </>
  );
}

export default Index;
