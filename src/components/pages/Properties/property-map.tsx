'use client';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type PropertyMapProps = {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
};

export default function PropertyMap({
  latitude,
  longitude,
  title = "Property Location",
  address,
}: PropertyMapProps) {
  return (
    <div className="w-full h-[350px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{title}</strong>
            <br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
