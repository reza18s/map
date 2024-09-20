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
