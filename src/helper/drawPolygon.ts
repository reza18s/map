/* eslint-disable no-console */
import { deleteData, postData, putData } from "@/services/API";
import { IPolygon } from "@/types";
import L from "leaflet";

// DrawPolygon Function
export const DrawPolygon = async (
  map: L.Map,
  callBack: () => Promise<IPolygon[]>,
) => {
  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  // Add existing polygons from the database to drawnItems
  callBack().then((data) => {
    data.forEach((polygon) => {
      const layer = L.polygon(
        polygon.points.map((point) => [point.lat, point.lng]),
        { interactive: true }, // Ensure polygons are interactive
      );
      // @ts-expect-error the
      layer.options.id = polygon._id; // Store the polygon's DB ID in the layer options
      drawnItems.addLayer(layer);
    });
  });

  // Create draw control for editing and deleting
  const drawControl = new L.Control.Draw({
    draw: {
      // @ts-expect-error the
      polygon: true,
      marker: false,
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
    },
    edit: {
      featureGroup: drawnItems, // Make sure this includes your polygons
      // @ts-expect-error the
      edit: true, // Enable editing
      remove: true, // Enable deleting
    },
  });

  map.addControl(drawControl);

  // Handle polygon creation
  map.on(L.Draw.Event.CREATED, function (event: any) {
    const layer = event.layer;
    drawnItems.addLayer(layer); // Add to drawnItems for editing/removing
    const latlngs = layer.getLatLngs()[0].map((latlng: L.LatLng) => ({
      lat: latlng.lat,
      lng: latlng.lng,
    }));
    const name = prompt("Enter a name for the polygon:");

    if (!name) {
      alert("Polygon name is required!");
      return;
    }

    postData("/api/polygons", { name, points: latlngs, flag: 1 })
      .then((response) => {
        const newPolygon = response.data.polygon; // Get the new polygon with its ID from the response
        layer.options.id = newPolygon._id; // Set the polygon's DB ID in the layer options
        callBack();
      })
      .catch((err) => {
        console.error("Error creating polygon:", err);
        alert("Failed to create the polygon. Please try again.");
      });
  });

  // Handle polygon editing
  map.on(L.Draw.Event.EDITED, function (event: any) {
    const layers = event.layers;
    layers.eachLayer(function (layer: any) {
      const updatedLatLngs = layer.getLatLngs()[0].map((latlng: L.LatLng) => ({
        lat: latlng.lat,
        lng: latlng.lng,
      }));

      const id = layer.options.id; // Retrieve the DB ID from the layer options
      if (!id) {
        console.error("No ID found for the polygon.");
        return;
      }

      // Update polygon in the database
      putData("/api/polygons", { id, points: updatedLatLngs }) // Change to PUT method
        .then(() => {
          callBack(); // Refresh or reload polygons
        })
        .catch((err) => {
          console.error("Error updating polygon:", err);
          alert("Failed to update the polygon. Please try again.");
        });
    });
  });

  // Handle polygon deletion
  map.on(L.Draw.Event.DELETED, function (event: any) {
    const layers = event.layers;
    layers.eachLayer(function (layer: any) {
      const id = layer.options.id; // Retrieve the DB ID from the layer options
      if (!id) {
        console.error("No ID found for the polygon.");
        return;
      }

      // Delete polygon from the database
      deleteData("/api/polygons", { id })
        .then(() => {
          callBack();
        })
        .catch((err) => {
          console.error("Error deleting polygon:", err);
          alert("Failed to delete the polygon. Please try again.");
        });
    });
  });
};
