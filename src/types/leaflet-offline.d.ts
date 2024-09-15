import "leaflet";

declare module "leaflet" {
  namespace tileLayer {
    function offline(
      urlTemplate: string,
      options?: L.TileLayerOptions,
    ): L.TileLayer;
  }

  namespace control {
    function savetiles(layer: L.TileLayer, options: any): L.Control;
  }
}

interface LeafletOffline {
  getStorageInfo(urlTemplate: string): Promise<any[]>;
  getStoredTilesAsJson(layer: L.TileLayer, data: any[]): Promise<L.GeoJSON>;
}
declare module "leaflet" {
  interface LeafletEvent {
    _tilesforSave?: any[]; // Define the custom property _tilesforSave, change `any[]` to a more specific type if known
  }
}
