import { useState, useCallback, useContext } from "react";
import ProductContext from "@/components/context";

export const useNearbyLocations = (range, list) => {
  const { longitude: myLng, latitude: myLat } = useContext(ProductContext);

  const [nearProduct, setNearProduct] = useState([]);

  const calcDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371; //earth radius (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return parseFloat(d.toFixed(1));
  }, []);

  const nearbyLocationsFn = useCallback(() => {
    const NearList = list.filter(
      (arr) =>
        calcDistance(myLat, myLng, arr.data.Latitude, arr.data.Longitude) <=
        range
    );

    NearList.sort(function (a, b) {
      return b.data.time - a.data.time;
    });

    setNearProduct(NearList);
  }, [calcDistance, myLat, myLng, list, range]);

  return [nearProduct, nearbyLocationsFn];
};
