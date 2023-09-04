import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L, { LatLngExpression, Map as MapType } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import ButtonWrapper from "./components/ButtonWrapper";
import MapButton from "./components/MapButton";
import SearchInput from "./components/SearchInput";
import MarkerElement from "./components/MarkerElement";
import POIDetails from "./components/POIDetails";

import Modal from "./components/Modal";
import Tooltip from "./components/Tooltip";

import useGetPOIs from "./hooks/useGetPOIs";
import useURLParams from "./hooks/useURLParams";

import defaultIcon from "./utils/defaultIcon";

import { ReactComponent as IconPlusSVG } from "./assets/icon-plus.svg";
import { ReactComponent as IconMinusSVG } from "./assets/icon-minus.svg";
import { ReactComponent as IconRefreshSVG } from "./assets/icon-refresh.svg";
import { ReactComponent as IconInfoSVG } from "./assets/icon-info.svg";

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
  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false);
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false);
  const { records, metadata, loading, error, reload } = useGetPOIs(
    URLParams.api || undefined
  );
  const setBoundsInterval = useRef<number>();

  const [selectedPOI, setSelectedPoi] = useState<CustomMarker | null>(null);

  const [search, setSearch] = useState<string>("");

  const filteredRecords = useMemo(
    () =>
      records.filter((poi) => {
        const allText = `${poi.title} ${
          Array.isArray(poi.description)
            ? poi.description.concat(" ")
            : poi.description
        }`;
        return allText.toLowerCase().includes(search.toLowerCase());
      }),
    [records, search]
  );

  const bounds = useMemo(
    () =>
      L.latLngBounds(
        filteredRecords.map<LatLngExpression>((poi) => [
          poi.latitude,
          poi.longitude,
        ])
      ),
    [filteredRecords]
  );

  const setMapBounds = useCallback(() => {
    if (!map) {
      return;
    }

    map.fitBounds(bounds.pad(BOUNDS_PAD));
    map.setMaxBounds(bounds.pad(BOUNDS_PAD));
  }, [map, bounds]);

  useEffect(() => {
    if (!map) {
      return;
    }

    if (!bounds.isValid()) {
      return;
    }

    clearTimeout(setBoundsInterval.current);

    setBoundsInterval.current = setTimeout(() => setMapBounds(), 1000);

    map.on("zoom", () => {
      const zoom = map.getZoom();
      const maxZoom = map.getMaxZoom();

      setIsZoomOutDisabled(zoom === 0);
      setIsZoomInDisabled(zoom === maxZoom);
    });
  }, [map, bounds, setMapBounds]);

  if (!URLParams.api) {
    return (
      <div className="p-4 text-center">
        It appears you have not specified an <strong>?api=</strong> param. You
        can use the default meanwhile:
        <div className="pt-4">
          <a href="?api=/cities_in_romania.json">cities_in_romania.json</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-0 right-0 z-[999] p-2 max-w-full w-[400px] pl-[50px]">
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
          <div className="bg-white text-gray-800 p-2 rounded-md">
            The data for the map is loading...
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border-red-500 text-red-800 p-2 rounded-md">
            {error}
          </div>
        )}
      </div>

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        style={{ height: "100vh" }}
        ref={setMap}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MarkerClusterGroup chunkedLoading>
          {filteredRecords.map((poi, index) => (
            <MarkerElement
              key={index}
              marker={poi}
              onClick={() => setSelectedPoi(poi)}
            >
              <POIDetails {...poi} />
            </MarkerElement>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <Modal
        isOpen={selectedPOI !== null}
        onClose={() => {
          setSelectedPoi(null);
        }}
      >
        {selectedPOI && <POIDetails {...selectedPOI} />}
      </Modal>

      <ButtonWrapper className="absolute left-[10px] top-[10px]">
        <MapButton
          onClick={() => map && map.zoomIn()}
          disabled={isZoomInDisabled}
        >
          <IconPlusSVG width={15} height={15} />
        </MapButton>
        <MapButton
          onClick={() => map && map.zoomOut()}
          disabled={isZoomOutDisabled}
        >
          <IconMinusSVG width={15} height={15} />
        </MapButton>
      </ButtonWrapper>

      <ButtonWrapper className="absolute left-[10px] top-[80px]">
        <MapButton
          onClick={() => {
            setSearch("");
            reload();
            // fallback for when the data is locally loaded
            setMapBounds();
          }}
          disabled={loading}
        >
          <IconRefreshSVG width={15} height={15} />
        </MapButton>
      </ButtonWrapper>

      {!!metadata && (
        <ButtonWrapper className="absolute left-[10px] top-[120px]">
          <Tooltip text={metadata} className="text-left w-[240px] ">
            <MapButton>
              <IconInfoSVG width={15} height={15} />
            </MapButton>
          </Tooltip>
        </ButtonWrapper>
      )}
    </>
  );
}

export default Map;
