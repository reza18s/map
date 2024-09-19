import { postData } from "@/services/API";

import L from "leaflet";
export const DrawPolygon = async (map: L.Map, callBack: () => void) => {
  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  const drawControl = new L.Control.Draw({
    draw: {
      //@ts-expect-error the
      polygon: true,
      marker: false,
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
    },
    edit: {
      featureGroup: drawnItems,
    },
  });

  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, function (event: any) {
    const layer = event.layer;
    drawnItems.addLayer(layer);
    const latlngs = layer.getLatLngs()[0].map((latlng: L.LatLng) => ({
      lat: latlng.lat,
      lng: latlng.lng,
    }));
    const name = prompt("Enter a name for the polygon:");

    if (name) {
      return postData("/api/polygons", {
        name,
        points: latlngs,
        flag: 1,
      }).then(() => {
        callBack();
      });
    }
  });
};
