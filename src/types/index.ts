export interface PointData {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  frequency: string;
  status: "active" | "disable";
  date: string;
}

export interface Settings {
  lat: number;
  lng: number;
  zoom: number;
}

export interface FormData {
  name: string;
  lat: string;
  lng: string;
  frequency: string;
  lat_settings?: string;
  lng_settings?: string;
  zoom?: string;
  search?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  loading: boolean;
  initialData?: FormData;
}

export interface MapComponentProps {
  points: PointData[];
  settings: Settings;
  onMarkerClick: (point: PointData) => void;
}
