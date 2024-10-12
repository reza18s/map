export const calculateDistance = (
  point1: L.LatLng,
  point2: L.LatLng,
): number => {
  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
};

// Function to calculate angle in degrees between two points
export const calculateAngle = (point1: L.LatLng, point2: L.LatLng): number => {
  const Δλ = point2.lng - point1.lng;
  const Δφ = point2.lat - point1.lat;
  const angle = (Math.atan2(Δφ, Δλ) * 180) / Math.PI; // Angle in degrees
  return angle;
};
export const calculateDotPosition = (
  lat: number,
  lng: number,
  angle: number,
  distance: number = 500, // distance in meters
): [number, number] => {
  const R = 6371000; // Radius of the Earth in meters
  const angularDistance = distance / R; // Angular distance in radians
  const angleRad = (angle * Math.PI) / 180; // Convert the angle to radians

  const newLat = Math.asin(
    Math.sin((lat * Math.PI) / 180) * Math.cos(angularDistance) +
      Math.cos((lat * Math.PI) / 180) *
        Math.sin(angularDistance) *
        Math.cos(angleRad),
  );

  const newLng =
    ((lng * Math.PI) / 180 +
      Math.atan2(
        Math.sin(angleRad) *
          Math.sin(angularDistance) *
          Math.cos((lat * Math.PI) / 180),
        Math.cos(angularDistance) -
          Math.sin((lat * Math.PI) / 180) * Math.sin(newLat),
      )) *
    (180 / Math.PI);

  return [newLat * (180 / Math.PI), newLng];
};
