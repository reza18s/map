import "leaflet.offline";
import "leaflet-draw";
import L from "leaflet";
export const controlSaveTiles = ({
  map,
  setProgress,
  setTotal,
}: {
  map: L.Map;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const tileLayerOffline = L.tileLayer.offline(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abc",
      minZoom: 11,
      maxZoom: 16,
    },
  );
  tileLayerOffline.addTo(map);
  const controlSaveTiles = L.control.savetiles(tileLayerOffline, {
    zoomlevels: [11, 12, 13, 14, 15, 16],
    confirm(layer: any, succescallback: () => void) {
      if (
        window.confirm(
          `Are you sure you want to download ${layer._tilesforSave.length} tiles?`,
        )
      ) {
        succescallback();
      }
    },
    confirmRemoval(layer: any, successCallback: () => void) {
      if (window.confirm("Are you sure you want to remove all tiles?")) {
        successCallback();
      }
    },
    saveText: `<div class="w-full h-full flex justify-center items-center">
  <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  </div>`,
    rmText: `<div class="w-full h-full flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
    </div>`,
  });
  if (controlSaveTiles) {
    controlSaveTiles.addTo(map);
  }

  let progress: number;
  tileLayerOffline.on("savestart", (e: any) => {
    progress = 0;
    setTotal(e._tilesforSave.length);
  });
  tileLayerOffline.on("savetileend", () => {
    progress += 1;
    setProgress(progress);
  });
};
