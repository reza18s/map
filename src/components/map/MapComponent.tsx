import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet.offline";
import "leaflet/dist/leaflet.css";
import { PointData, Settings } from "@/types";

interface MapComponentProps {
  points: PointData[];
  settings: Settings;
  onMarkerClick: (point: PointData) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  points,
  settings,
  onMarkerClick,
}) => {
  return (
    <MapContainer
      center={[settings.lat, settings.lng]}
      zoom={settings.zoom}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point) => (
        <Marker key={point._id} position={[point.lat, point.lng]}>
          <Popup>{point.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
