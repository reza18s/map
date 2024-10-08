// File: src/types/index.ts

export interface IPoint {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  frequency: number;
  iconType: string;
  date: string;
  active: boolean;
  status: boolean;
  connect: boolean;
  level: number;
}

export interface ISettings {
  lat: number;
  lng: number;
  zoom: number;
  PointIcon: { name: string; url: string }[];
}
export interface ILine {
  _id: string;
  startPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
  length: number;
  angle: number;
}

export interface IFormData {
  name: string;
  lat: string;
  lng: string;
  frequency: string;
  lat_settings?: string;
  lng_settings?: string;
  zoom?: string;
  search?: string;
}

// New IPolygon interface for polygons
export interface IPolygon {
  _id: string;
  name: string;
  points: { lat: number; lng: number }[]; // Array of lat/lng for polygon vertices
  flag: number; // 0 (hide) or 1 (show)
  isPolygon: boolean; // True for polygons
  date: string;
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IFormData) => void;
  loading: boolean;
  initialData?: IFormData;
}

export interface MapComponentProps {
  points: IPoint[];
  polygons: IPolygon[]; // Add polygons to map component props
  settings: ISettings;
  onMarkerClick: (point: IPoint) => void;
}
