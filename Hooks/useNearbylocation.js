import {useState, useCallback} from "react";
import {useSelector} from "react-redux";

export const useNearbyLocations = (range, list) => {
  const latitude = useSelector((state) => state.Products.latitude);
  const longitude = useSelector((state) => state.Products.longitude);

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
      (arr) => calcDistance(latitude, longitude, arr.data.Latitude, arr.data.Longitude) <= range
    );

    NearList.sort(function (a, b) {
      return b.data.time - a.data.time;
    });

    setNearProduct(NearList);
  }, [calcDistance, latitude, longitude, list, range]);

  return [nearProduct, nearbyLocationsFn];
};
