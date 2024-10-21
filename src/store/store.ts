import { deleteData, getData, postData, putData } from "@/services/API";
import { ILine, IPoint, IPolygon, ISettings } from "@/types";
import { create } from "zustand";
import L, { polygon } from "leaflet";
interface IHistory {
  actionType: "create" | "delete" | "update";
  type: "polygon" | "polyline";
  polygon?: IPolygon;
  line?: ILine;
}
interface IFuture extends IHistory {
  layer: L.Layer;
}
interface dataType {
  map: L.Map | null;
  isLoading: boolean;
  points: IPoint[];
  polygons: IPolygon[]; // State for polygons
  lines: ILine[]; // New state for lines
  settings?: ISettings;
  addPointModal: boolean;
  showPointList: boolean;
  drawnItems?: L.FeatureGroup<any>;
  history: IHistory[]; // Array to track history for undo
  future: IFuture[]; // Array to track future for redo
}

interface storeAction {
  setDrawnItems: (drawnItems: L.FeatureGroup<any>) => void;
  setAddPointModal: (value: boolean) => void;
  setShowPointList: (value: boolean) => void;
  setPoints: (points: IPoint[]) => void;
  setPolygons: (polygons: IPolygon[]) => void; // Setter for polygons
  setLines: (lines: ILine[]) => void; // Setter for lines
  addLine: (line: ILine) => void; // Action to add a line
  getSettings: () => void;
  getAllPoints: () => void;
  refreshAllData: () => void;
  getAllPolygons: () => Promise<IPolygon[]>;
  getAllLines: () => Promise<ILine[]>;
  setIsLoading: (state: (() => boolean) | boolean) => void;
  setMap: (state: (() => L.Map | null) | (L.Map | null)) => void;
  pushToHistory: ({
    actionType,
    type,
    line,
    polygon,
  }: {
    actionType: "create" | "delete" | "update";
    type: "polygon" | "polyline";
    polygon?: IPolygon;
    line?: ILine;
  }) => void;
  undo: () => void;
  redo: () => void;
}

const initialData: dataType = {
  map: null,
  isLoading: false,
  addPointModal: false,
  points: [],
  polygons: [],
  lines: [],
  showPointList: false,
  history: [],
  future: [],
};

export type storeType = dataType & storeAction;

export const useAppStore = create<storeType>((set, get) => ({
  ...initialData,

  setAddPointModal: (value) => set(() => ({ addPointModal: value })),
  setShowPointList: (value) => set(() => ({ showPointList: value })),

  setPoints: (points) => set(() => ({ points })),
  setPolygons: (polygons) => set(() => ({ polygons })),
  setLines: (lines) => set(() => ({ lines })),

  addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),

  getSettings: () => {
    set({ isLoading: true });
    getData("/api/settings", {}).then((res) => {
      set({ settings: res.data, isLoading: false });
    });
  },

  getAllPoints: () => {
    set({ isLoading: true });
    getData("/api/points", {})
      .then((res) => {
        set({ points: res.data, isLoading: false });
      })
      .catch((error) => {
        console.error("Error fetching points:", error);
        set({ isLoading: false });
      });
  },

  getAllPolygons: async () => {
    set({ isLoading: true });
    const res = await getData("/api/polygons", {});
    set({ polygons: res.data, isLoading: false });
    return res.data;
  },

  getAllLines: async () => {
    set({ isLoading: true });
    const res = await getData("/api/lines", {});
    set({ lines: res.data, isLoading: false });
    return res.data;
  },

  setIsLoading: (state) => {
    if (typeof state == "boolean") {
      set({ isLoading: state });
    } else if (typeof state == "function") {
      set({ isLoading: state() });
    }
  },

  setMap: (state) => {
    if (typeof state == "function") {
      set({ map: state() });
    } else {
      set({ map: state });
    }
  },

  refreshAllData: () => {
    get().getAllLines();
    get().getAllPoints();
    get().getAllPolygons();
    get().getSettings();
  },

  // Push state to history and reset future (for new actions)
  pushToHistory: ({ actionType, type, line, polygon }) => {
    console.log("addToHistory");
    const { history } = get();
    set({
      history: [...history, { actionType, type, line, polygon }],
      future: [],
    });
  },

  // Undo: Revert the last action and store it in future
  undo: () => {
    const {
      history,
      future,
      drawnItems,
      getAllLines,
      getAllPolygons,
      setIsLoading,
    } = get();
    if (history.length === 0 || !drawnItems) {
      return;
    }
    console.log(history);

    const lastAction = history[history.length - 1];

    let item: IPolygon | IPoint;
    if (lastAction.polygon) {
      item = lastAction.polygon;
    } else {
      // @ts-expect-error the
      item = lastAction.line!;
    }

    const layer = drawnItems
      .getLayers()
      // @ts-expect-error the
      .findLast((layer) => layer.options.id == item._id);
    if (!layer) {
      return;
    }
    const updatedHistory = history.slice(0, -1);
    set({
      history: updatedHistory,
      future: [{ ...lastAction, layer }, ...future],
    });

    switch (lastAction.actionType) {
      case "create":
        drawnItems.removeLayer(layer);
        if (lastAction.type == "polygon") {
          deleteData("/api/polygons", { id: item._id }).then(() => {
            getAllPolygons();
            setIsLoading(false);
          });
        } else if (lastAction.type == "polyline") {
          deleteData("/api/lines", { id: item._id }).then(() => {
            getAllLines();
            setIsLoading(false);
          });
        }

        break;
      case "delete":
        drawnItems.addLayer(layer);
        if (lastAction.type == "polygon") {
          putData("/api/polygons", { id: item._id, deletedAt: null }).then(
            () => {
              getAllPolygons();
              setIsLoading(false);
            },
          );
        } else if (lastAction.type == "polyline") {
          putData("/api/lines", { id: item._id, deletedAt: null }).then(() => {
            getAllLines();
            setIsLoading(false);
          });
        }
        break;
      case "update":
    }
  },

  // Redo: Reapply the last undone action
  redo: () => {
    const {
      future,
      history,
      drawnItems,
      getAllPolygons,
      getAllLines,
      setIsLoading,
    } = get();
    if (future.length === 0 || !drawnItems) {
      return;
    }

    const nextAction = future[0];
    let item: IPolygon | IPoint;
    if (nextAction.polygon) {
      item = nextAction.polygon;
    } else {
      // @ts-expect-error the
      item = nextAction.line!;
    }
    const updatedFuture = future.slice(1);
    set({
      future: updatedFuture,
      history: [
        ...history,
        {
          type: nextAction.type,
          actionType: nextAction.actionType,
          line: nextAction.line,
          polygon: nextAction.polygon,
        },
      ],
    });

    switch (nextAction.actionType) {
      case "create":
        drawnItems.addLayer(nextAction.layer);
        if (nextAction.type == "polygon") {
          putData("/api/polygons", { id: item._id, deletedAt: null }).then(
            () => {
              getAllPolygons();
              setIsLoading(false);
            },
          );
        } else if (nextAction.type == "polyline") {
          putData("/api/lines", { id: item._id, deletedAt: null }).then(() => {
            getAllLines();
            setIsLoading(false);
          });
        }
        break;
      case "delete":
        drawnItems.removeLayer(nextAction.layer);
        if (nextAction.type == "polygon") {
          deleteData("/api/polygons", { id: item._id }).then(() => {
            getAllPolygons();
            setIsLoading(false);
          });
        } else if (nextAction.type == "polyline") {
          deleteData("/api/lines", { id: item._id }).then(() => {
            getAllLines();
            setIsLoading(false);
          });
        }
        break;
      case "update":
    }
  },
  setDrawnItems: (drawnItems) => {
    set({ drawnItems });
  },
}));
