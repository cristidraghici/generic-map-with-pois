import { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L, { LatLngExpression, Map as MapType } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import SearchInput from "./components/SearchInput";
import MarkerElement from "./components/MarkerElement";

import useGetPOIs from "./hooks/useGetPOIs";
import useURLParams from "./hooks/useURLParams";

import defaultIcon from "./utils/defaultIcon";

import "leaflet/dist/leaflet.css";

// Fix for github pages not showing the icon
L.Marker.prototype.options.icon = defaultIcon;

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
          onCancel={() => {
            setSearch("");
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
            <MarkerElement key={index} {...poi} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

export default Map;
