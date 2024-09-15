/* global L, LeafletOffline, $ */
const urlTemplate = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

function showTileList() {
  LeafletOffline.getStorageInfo(urlTemplate).then((r) => {
    const list = document.getElementById("tileinforows");
    if (list) {
      list.innerHTML = "";
      r.forEach((tile, i) => {
        const createdAt = new Date(tile.createdAt);
        list.insertAdjacentHTML(
          "beforeend",
          `<tr><td>${i}</td><td>${tile.url}</td><td>${tile.key}</td><td>${createdAt.toDateString()}</td></tr>`,
        );
      });
    }
  });
}

$("#storageModal").on("show.bs.modal", showTileList);

const map = L.map("map");
const baseLayer = L.tileLayer
  .offline(urlTemplate, {
    attribution: "Map data {attribution.OpenStreetMap}",
    subdomains: "abc",
    minZoom: 13,
  })
  .addTo(map);
const control = L.control.savetiles(baseLayer, {
  zoomlevels: [13, 16],
  confirm: (layer, successCallback) => {
    if (window.confirm(`Save ${layer._tilesforSave.length}`)) {
      successCallback();
    }
  },
  confirmRemoval: (layer, successCallback) => {
    if (window.confirm("Remove all the tiles?")) {
      successCallback();
    }
  },
  saveText:
    '<i class="fa fa-download" aria-hidden="true" title="Save tiles"></i>',
  rmText:
    '<i class="fa fa-trash" aria-hidden="true"  title="Remove tiles"></i>',
});

control.addTo(map);

map.setView({ lat: 51.985, lng: 5 }, 16);
const layerswitcher = L.control
  .layers({ "osm (offline)": baseLayer }, null, { collapsed: false })
  .addTo(map);

let storageLayer: L.GeoJSON;

const getGeoJsonData = () =>
  LeafletOffline.getStorageInfo(urlTemplate).then((data) =>
    LeafletOffline.getStoredTilesAsJson(baseLayer, data),
  );

const addStorageLayer = () => {
  getGeoJsonData().then((geojson) => {
    storageLayer = L.geoJSON(geojson).bindPopup(
      (clickedLayer) => clickedLayer.feature.properties.key,
    );
    layerswitcher.addOverlay(storageLayer, "stored tiles");
  });
};

addStorageLayer();

document.getElementById("remove_tiles")?.addEventListener("click", () => {
  control._rmTiles();
});

baseLayer.on("storagesize", (e) => {
  document.getElementById("storage")!.innerHTML = e.storagesize.toString();
  if (storageLayer) {
    storageLayer.clearLayers();
    getGeoJsonData().then((data) => {
      storageLayer.addData(data);
    });
  }
});

let progress: number;
baseLayer.on("savestart", (e) => {
  progress = 0;
  document.getElementById("total")!.innerHTML =
    e._tilesforSave.length.toString();
});
baseLayer.on("savetileend", () => {
  progress += 1;
  document.getElementById("progress")!.innerHTML = progress.toString();
});
