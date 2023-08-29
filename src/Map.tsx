import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L, { LatLngExpression, Map as MapType } from "leaflet";

// Fix for github pages not showing the icon
import MARKER_ICON_URL from "./assets/images/marker-icon.png";
import MARKER_ICON_RETINA_URL from "./assets/images/marker-icon-2x.png";
import MARKER_SHADOW_URL from "./assets/images/marker-shadow.png";

import useGetPOIs from "./hooks/useGetPOIs";
import useURLParams from "./hooks/useURLParams";

import "leaflet/dist/leaflet.css";

// Fix for github pages not showing the icon
const DefaultIcon = L.icon({
  iconUrl: MARKER_ICON_URL,
  iconRetinaUrl: MARKER_ICON_RETINA_URL,
  shadowUrl: MARKER_SHADOW_URL,
  iconSize: [35, 46],
  iconAnchor: [17, 46],
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * The default center of the map (currently Bucharest :) )
 */
const MAP_CENTER: LatLngExpression = [44.4268, 26.1025];

/**
 * The initial zoom of the map
 */
const MAP_ZOOM = 3;

function Map() {
  const URLParams = useURLParams();
  const [map, setMap] = useState<MapType | null>(null);
  const { data, loading, error } = useGetPOIs(URLParams.api || undefined);

  const bounds = useMemo(
    () =>
      L.latLngBounds(
        data.map<LatLngExpression>((poi) => [poi.latitude, poi.longitude])
      ),
    [data]
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!bounds.isValid()) {
      return;
    }

    map.fitBounds(bounds.pad(0.5));
    map.setMaxBounds(bounds.pad(0.5));
  }, [map, bounds]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 999,
          background: "#fff",
          padding: 10,
          marginLeft: 130,
        }}
      >
        {loading && <>The data for the map is loading...</>}
        {!loading && error && <>{error}</>}
      </div>

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
        {data.map((poi, index) => (
          <Marker key={index} position={[poi.latitude, poi.longitude]}>
            <Tooltip direction="top" opacity={1} offset={[0, -50]}>
              <div className="tooltip-content">
                <h3>{poi.title}</h3>

                {!!poi.description && !Array.isArray(poi.description) && (
                  <>{poi.description}</>
                )}

                {!!poi.description && Array.isArray(poi.description) && (
                  <>
                    {poi.description.map((descriptionItem) => (
                      <div>{descriptionItem}</div>
                    ))}
                  </>
                )}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default Map;
