import { useState, useCallback } from "react";

export const useNearbyLocations = (range, arr) => {
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

  const nearbyLocationsFn = (myLat, myLng) => {
    const NearList = arr.filter(
      (list) =>
        calcDistance(myLat, myLng, list.data.Latitude, list.data.Longitude) <=
        range
    );

    NearList.sort(function (a, b) {
      return b.data.time - a.data.time;
    });

    setNearProduct(NearList);
  };

  return [nearProduct, nearbyLocationsFn];
};
