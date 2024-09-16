export interface IPoint {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  frequency: number;
  status: "active" | "disable";
  date: string;
}
export interface ISettings {
  lat: number;
  lng: number;
  zoom: number;
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

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IFormData) => void;
  loading: boolean;
  initialData?: IFormData;
}

export interface MapComponentProps {
  points: IPoint[];
  settings: ISettings;
  onMarkerClick: (point: IPoint) => void;
}
