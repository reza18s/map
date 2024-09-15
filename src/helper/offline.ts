/* global L, LeafletOffline, $ */

const urlTemplate = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

// Show tile list function
function showTileList(): void {
  // @ts-expect-error the
  LeafletOffline.getStorageInfo(urlTemplate).then((r: any[]) => {
    const list = document.getElementById("tileinforows");
    if (list) {
      list.innerHTML = "";
      r.forEach((tile: any, i: number) => {
        const createdAt = new Date(tile.createdAt);
        list.insertAdjacentHTML(
          "beforeend",
          `<tr><td>${i}</td><td>${tile.url}</td><td>${tile.key}</td><td>${createdAt.toDateString()}</td></tr>`,
        );
      });
    }
  });
}

// @ts-expect-error the
$("#storageModal").on("show.bs.modal", showTileList);

// Initialize map and base layer
const map = L.map("map");
const baseLayer = L.tileLayer
  .offline(urlTemplate, {
    attribution: "Map data {attribution.OpenStreetMap}",
    subdomains: "abc",
    minZoom: 13,
  } as L.TileLayerOptions)
  .addTo(map);

// Set up tile saving controls
const control = L.control.savetiles(baseLayer, {
  zoomlevels: [13, 16],
  confirm: (layer: any, successCallback: () => void): void => {
    if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
      successCallback();
    }
  },
  confirmRemoval: (layer: any, successCallback: () => void): void => {
    if (window.confirm("Remove all the tiles?")) {
      successCallback();
    }
  },
});

control.addTo(map);

// Set map view
map.setView({ lat: 51.985, lng: 5 }, 16);

// Add layers to map
const layerswitcher = L.control
  // @ts-expect-error the
  .layers({ "osm (offline)": baseLayer }, null, { collapsed: false })
  .addTo(map);

// GeoJSON storage layer
let storageLayer: L.GeoJSON;

// Get stored GeoJSON data
const getGeoJsonData = (): Promise<L.GeoJSON> =>
  // @ts-expect-error the
  LeafletOffline.getStorageInfo(urlTemplate).then((data: any) =>
    // @ts-expect-error the
    LeafletOffline.getStoredTilesAsJson(baseLayer, data),
  );

// Add storage layer to the map
const addStorageLayer = (): void => {
  getGeoJsonData().then((geojson: any) => {
    storageLayer = L.geoJSON(geojson).bindPopup(
      (clickedLayer: any) => clickedLayer.feature.properties.key,
    );
    layerswitcher.addOverlay(storageLayer, "stored tiles");
  });
};

addStorageLayer();

// Event listener to remove tiles
document.getElementById("remove_tiles")?.addEventListener("click", () => {
  (control as any)._rmTiles(); // Assuming _rmTiles is a method without typing in the library
});

// Update storage size event
baseLayer.on("storagesize", (e: any) => {
  document.getElementById("storage")!.innerHTML = e.storagesize.toString();
  if (storageLayer) {
    storageLayer.clearLayers();
    getGeoJsonData().then((data: any) => {
      storageLayer.addData(data);
    });
  }
});

// Progress tracking for saving tiles
let progress: number;
baseLayer.on("savestart", (e: any) => {
  progress = 0;
  document.getElementById("total")!.innerHTML =
    e._tilesforSave.length.toString();
});
baseLayer.on("savetileend", () => {
  progress += 1;
  document.getElementById("progress")!.innerHTML = progress.toString();
});
