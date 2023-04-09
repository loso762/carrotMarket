import React, {createContext, useEffect, useState} from "react";

const ProductContext = createContext({});

export default ProductContext;

export const ProductContextProvider = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [SelectedCategory, setSelectedCategory] = useState("카테고리");

  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [dong, setDong] = useState("내근처");

  const category = [
    "인기매물",
    "디지털기기",
    "생활가전",
    "가구·인테리어",
    "생활·주방",
    "유아동",
    "의류",
    "뷰티·미용",
    "스포츠·레저",
    "취미·게임·음반",
    "도서",
    "티켓·교환권",
    "반려동물용품",
    "식물",
    "삽니다",
  ];

  useEffect(() => {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KakaoMap_API_Key}&libraries=services&autoload=false`;
    document.head.appendChild(mapScript);

    //좌표 가져오기
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

    //좌표로 동주소 가져오기
    const onLoadDong = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const dongAddress = result[0].region_3depth_name;
            setDong(dongAddress);
          } else {
            console.error("주소 불러오기 실패!");
          }
        });
      });
    };

    if (latitude && longitude) {
      mapScript.addEventListener("load", onLoadDong);
    }
  }, [latitude, longitude]);

  return (
    <ProductContext.Provider
      value={{
        isEdit,
        setIsEdit,
        setSelectedCategory,
        SelectedCategory,
        latitude,
        longitude,
        dong,
        category,
      }}>
      {props.children}
    </ProductContext.Provider>
  );
};
