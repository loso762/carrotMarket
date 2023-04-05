import React, { createContext, useEffect, useState } from "react";

const ProductContext = createContext({});

export default ProductContext;

export const ProductContextProvider = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [SelectedCategory, setSelectedCategory] = useState("카테고리");

  //글쓴이 주소 가져오는 코드
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [dong, setDong] = useState("내근처");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=ed86928ac206d7e1c95266631cccfd91&libraries=services&autoload=false`;
    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const dongAddress = result[0].region_3depth_name;
            setDong(dongAddress);
          } else {
            console.error("Failed to get the dong address");
          }
        });
      });
    };

    if (latitude && longitude) {
      mapScript.addEventListener("load", onLoadKakaoMap);
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
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};
