import {useEffect} from "react";
import {useAppSelector, useAppDispatch} from "./storeHook";
import {productAction} from "../store/product-slice";

declare global {
  interface Window {
    kakao: any;
  }
}

interface RegionInfo {
  region_3depth_name: string;
  // Add any other properties you need from the region information object
}

export const useLocations = () => {
  const dispatch = useAppDispatch();
  const latitude = useAppSelector((state) => state.Products.latitude);
  const longitude = useAppSelector((state) => state.Products.longitude);

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
      sessionStorage.setItem("latitude", position.coords.latitude.toString());
      sessionStorage.setItem("logitude", position.coords.longitude.toString());
    });

    //좌표로 동주소 가져오기
    const onLoadDong = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2RegionCode(longitude, latitude, (result: Array<RegionInfo> | null, status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const dongAddress = result[0].region_3depth_name;
            dispatch(productAction.setDong(dongAddress));
          } else {
            console.error("주소 불러오기 실패..");
          }
        });
      });
    };

    latitude && longitude && mapScript.addEventListener("load", onLoadDong);
  }, [dispatch, latitude, longitude]);

  return;
};
