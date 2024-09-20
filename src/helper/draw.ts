/* eslint-disable no-console */
import { deleteData, postData, putData } from "@/services/API";
import { ILine, IPolygon } from "@/types";
import L, { LatLng } from "leaflet";
import { calculateAngle, calculateDistance } from "./math";

// Draw function to handle both lines and polygons
export const Draw = async (
  map: L.Map,
  getAllPolygons: () => Promise<IPolygon[]>,
  getAllLines: () => Promise<ILine[]>,
) => {
  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  // Load existing polygons from the database
  getAllPolygons().then((data) => {
    data.forEach((polygon) => {
      const layer = L.polygon(
        polygon.points.map((point) => [point.lat, point.lng]),
        { interactive: true },
      );
      layer.options.id = polygon._id; // Store the polygon's DB ID in the layer options
      drawnItems.addLayer(layer);
    });
  });
  getAllLines().then((data) => {
    data.forEach((line) => {
      const latlngs = [
        [line.startPoint.lat, line.startPoint.lng],
        [line.endPoint.lat, line.endPoint.lng],
      ];
      const layer = L.polyline(latlngs, { interactive: true });
      layer.options.id = line._id; // Store the line's DB ID in the layer options
      drawnItems.addLayer(layer);

      // Calculate distance and angle
      const distance = calculateDistance(line.startPoint, line.endPoint);
      const angle = calculateAngle(line.startPoint, line.endPoint);

      const popupContent = `
        <strong>Line Info</strong><br>
        Length: ${(distance / 1000).toFixed(2)} km<br>
        Angle: ${angle.toFixed(2)}°
      `;
      layer.bindPopup(popupContent).openPopup();
    });
  });

  // Create draw control for both polygons and lines
  const drawControl = new L.Control.Draw({
    draw: {
      polygon: {
        allowIntersection: false,
        showArea: true,
        shapeOptions: { color: "#bada55" },
      },
      polyline: {
        allowIntersection: false,
      },
      marker: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
    },
    edit: {
      featureGroup: drawnItems, // Allow editing and removing of drawn shapes
      edit: {
        selectedPathOptions: {
          color: "#666666",
        },
      },
      remove: true,
    },
  });
  map.addControl(drawControl);

  // Handle shape creation (either polygon or line)
  map.on(L.Draw.Event.CREATED, function (event: L.DrawEvents.Created) {
    const layer = event.layer;
    drawnItems.addLayer(layer);

    if (event.layerType === "polygon") {
      const latlngs = (layer as L.Polygon).getLatLngs() as L.LatLng[][];
      const flattenedLatLngs = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
      const latlngsMapped = flattenedLatLngs.map((latlng) => ({
        lat: (latlng as LatLng).lat,
        lng: (latlng as LatLng).lng,
      }));
      const name = prompt("Enter a name for the polygon:");
      if (!name) {
        alert("Polygon name is required!");
        return;
      }
      postData("/api/polygons", { name, points: latlngsMapped, flag: 1 })
        .then((response) => {
          const newPolygon = response.data.polygon;
          layer.options.id = newPolygon._id; // Assign the polygon ID from the response
          getAllPolygons();
        })
        .catch((err) => {
          console.error("Error creating polygon:", err);
          alert("Failed to create the polygon. Please try again.");
        });
    } else if (event.layerType === "polyline") {
      const latlngs = (layer as L.Polyline).getLatLngs() as L.LatLng[];
      if (latlngs.length >= 2) {
        const point1 = latlngs[0];
        const point2 = latlngs[1];
        const distance = calculateDistance(point1, point2);
        const angle = calculateAngle(point1, point2);

        postData("/api/lines", {
          startPoint: { lat: point1.lat, lng: point1.lng },
          endPoint: { lat: point2.lat, lng: point2.lng },
          length: distance,
          angle,
        })
          .then((response) => {
            layer.options.id = response.data.line._id; // Assign the line ID from the response
            console.log("Line saved successfully");
          })
          .catch((err) => {
            console.error("Error saving line:", err);
          });

        const popupContent = `
          <strong>Line Info</strong><br>
          Length: ${(distance / 1000).toFixed(2)} km<br>
          Angle: ${angle.toFixed(2)}°
        `;
        layer.bindPopup(popupContent).openPopup();
      }
    }
  });

  // Handle shape editing (both lines and polygons)
  map.on(L.Draw.Event.EDITED, function (event: L.DrawEvents.Edited) {
    const layers = event.layers;
    layers.eachLayer(function (layer: any) {
      const id = layer.options.id;
      if (!id) {
        console.error("No ID found for the shape.");
        return;
      }

      if (layer instanceof L.Polygon) {
        const updatedLatLngs = layer
          .getLatLngs()[0]
          .map((latlng: L.LatLng) => ({
            lat: latlng.lat,
            lng: latlng.lng,
          }));
        putData("/api/polygons", { id, points: updatedLatLngs })
          .then(() => {
            getAllPolygons();
          })
          .catch((err) => {
            console.error("Error updating polygon:", err);
            alert("Failed to update the polygon. Please try again.");
          });
      } else if (layer instanceof L.Polyline) {
        const latlngs = layer.getLatLngs() as L.LatLng[];
        if (latlngs.length >= 2) {
          const point1 = latlngs[0];
          const point2 = latlngs[1];
          const distance = calculateDistance(point1, point2);
          const angle = calculateAngle(point1, point2);
          putData("/api/lines", {
            id,
            startPoint: { lat: point1.lat, lng: point1.lng },
            endPoint: { lat: point2.lat, lng: point2.lng },
            length: distance,
            angle,
          })
            .then(() => {
              console.log("Line updated successfully");
            })
            .catch((err) => {
              console.error("Error updating line:", err);
            });
        }
      }
    });
  });

  // Handle shape deletion (both lines and polygons)
  map.on(L.Draw.Event.DELETED, function (event: L.DrawEvents.Deleted) {
    const layers = event.layers;
    layers.eachLayer(function (layer: any) {
      const id = layer.options.id;
      if (!id) {
        console.error("No ID found for the shape.");
        return;
      }

      if (layer instanceof L.Polygon) {
        deleteData("/api/polygons", { id })
          .then(() => {
            getAllPolygons();
          })
          .catch((err) => {
            console.error("Error deleting polygon:", err);
            alert("Failed to delete the polygon. Please try again.");
          });
      } else if (layer instanceof L.Polyline) {
        deleteData("/api/lines", { id })
          .then(() => {
            console.log("Line deleted successfully");
          })
          .catch((err) => {
            console.error("Error deleting line:", err);
          });
      }
    });
  });
};
