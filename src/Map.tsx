import { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L, { LatLngExpression, Map as MapType } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import SearchInput from "./components/SearchInput";

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

/**
 * Padding for the bounds
 */
const BOUNDS_PAD = 0.2;

function Map() {
  const URLParams = useURLParams();
  const [map, setMap] = useState<MapType | null>(null);
  const { data, loading, error } = useGetPOIs(URLParams.api || undefined);
  const setBoundsInterval = useRef<number>();

  const [search, setSearch] = useState<string>("");

  const filteredData = useMemo(
    () =>
      data.filter((poi) => {
        const allText = `${poi.title} ${
          Array.isArray(poi.description)
            ? poi.description.concat(" ")
            : poi.description
        }`;
        return allText.toLowerCase().includes(search.toLowerCase());
      }),
    [data, search]
  );

  const bounds = useMemo(
    () =>
      L.latLngBounds(
        filteredData.map<LatLngExpression>((poi) => [
          poi.latitude,
          poi.longitude,
        ])
      ),
    [filteredData]
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!bounds.isValid()) {
      return;
    }

    clearTimeout(setBoundsInterval.current);

    setBoundsInterval.current = setTimeout(() => {
      map.fitBounds(bounds.pad(BOUNDS_PAD));
      map.setMaxBounds(bounds.pad(BOUNDS_PAD));
    }, 1000);
  }, [map, bounds]);

  return (
    <>
      <div className="absolute top-0 right-0 z-[999] p-2 ml-16">
        <SearchInput
          className="mb-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />

        {loading && (
          <div className="bg-white p-2 border-2 text-gray-800 rounded-md">
            The data for the map is loading...
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border-2 border-red-500 text-red-800 p-2 rounded-md">
            {error}
          </div>
        )}
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

        <MarkerClusterGroup chunkedLoading>
          {filteredData.map((poi, index) => (
            <Marker key={index} position={[poi.latitude, poi.longitude]}>
              <Tooltip direction="top" opacity={1} offset={[0, -50]}>
                <div className="tooltip-content">
                  <h3 className="font-bold mb-2">{poi.title}</h3>

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
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

export default Map;
