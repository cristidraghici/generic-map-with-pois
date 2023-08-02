import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L, { LatLngExpression, Map as MapType } from "leaflet";

import "leaflet/dist/leaflet.css";

/**
 * The default center of the map (currently Bucharest :) )
 */
const MAP_CENTER: LatLngExpression = [44.4268, 26.1025];

/**
 * The initial zoom of the map
 */
const MAP_ZOOM = 3;

/**
 * Some cities in Romania used as default POIs
 */
const DEFAULT_POINTS: CustomMarker[] = [
  { title: "Bucharest", latitude: 44.4268, longitude: 26.1025 },
  { title: "Cluj-Napoca", latitude: 46.7712, longitude: 23.6236 },
  { title: "Iasi", latitude: 47.1585, longitude: 27.6014 },
  {
    title: "Constanta",
    description: "A city by the Black Sea",
    latitude: 44.181,
    longitude: 28.6348,
  },
  { title: "Timisoara", latitude: 45.7489, longitude: 21.2087 },
];

function Map() {
  const [map, setMap] = useState<MapType | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const bounds = L.latLngBounds(
      DEFAULT_POINTS.map<LatLngExpression>((poi) => [
        poi.latitude,
        poi.longitude,
      ])
    );

    map.fitBounds(bounds.pad(0.1));
    map.setMaxBounds(bounds.pad(0.5));
  }, [map]);

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      style={{ height: "100vh" }}
      ref={setMap}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {DEFAULT_POINTS.map((poi, index) => (
        <Marker key={index} position={[poi.latitude, poi.longitude]}>
          <Tooltip direction="top" offset={[-15, -15]} opacity={1}>
            <div className="tooltip-content">
              <h3>{poi.title}</h3>
              {!!poi.description && <>{poi.description}</>}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
