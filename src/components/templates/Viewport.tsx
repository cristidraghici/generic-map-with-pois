import { useCallback, useEffect, useMemo, useState } from 'react'
import L, { LatLngTuple } from 'leaflet'

import Drawer from '@/components/molecules/Drawer'
import RecordDetails from '@/components/molecules/RecordDetails'
import MapControls from '@/components/organisms/MapControls'
import SearchSection from '@/components/organisms/SearchSection'
import MapContainer from '@/components/organisms/MapContainer'
import ListView from '@/components/organisms/ListView'
import HorizontalViewportSplit from '@/components/molecules/HorizontalViewportSplit'

import useFetchData from '@/hooks/useFetchData'
import useURLParams from '@/hooks/useURLParams'
import useMap from '@/hooks/useMap'
import { CustomRecord } from '@/types'

const Viewport = () => {
  const [search, setSearch] = useState<string>('')
  const [selectedRecord, setSelectedRecord] = useState<CustomRecord | null>(
    null,
  )

  const { api } = useURLParams()

  const { records, metadata, config, loading, error, reload } = useFetchData(
    api,
    search,
  )

  const {
    map,
    setMap,
    handleMapRefresh,
    isZoomInDisabled,
    isZoomOutDisabled,
    handleZoomIn,
    handleZoomOut,
    handleSetBounds,
    currentMapBounds,
  } = useMap()

  useEffect(() => {
    if (!map || !records || records.length === 0) return

    const coords = records
      .filter(({ latitude, longitude }) => latitude && longitude)
      .map(({ latitude, longitude }) => [latitude, longitude] as LatLngTuple)

    handleSetBounds(coords)
  }, [map, records, handleSetBounds])

  /**
   * Filter records based on the current map viewport bounds
   */
  const visibleRecords = useMemo(() => {
    if (!currentMapBounds) return records

    return records.filter((record) =>
      currentMapBounds.contains([record.latitude, record.longitude]),
    )
  }, [records, currentMapBounds])

  const handleRecordSelect = useCallback(
    (record: CustomRecord | null) => {
      if (!record) {
        setSelectedRecord(record)
        return
      }

      setSelectedRecord(record)

      if (map && !!config.zoomOnSelect) {
        map.flyTo([record.latitude, record.longitude], 18)
      }
    },
    [map, config],
  )

  return (
    <>
      <SearchSection
        search={search}
        loading={loading}
        error={error}
        hasUrl={!!api}
        onSearchChange={(value: string) => setSearch(value)}
      />

      <HorizontalViewportSplit
        isSplitEnabled={!!config.isListVisible}
        mainElement={
          <MapContainer
            setMap={setMap}
            records={visibleRecords}
            onRecordSelect={handleRecordSelect}
            icon={config.typeOfIcon}
          />
        }
        splitElement={
          <ListView
            records={visibleRecords}
            onRecordSelect={(record) => {
              handleRecordSelect(record)

              if (!config.zoomOnSelect) {
                map?.flyTo([record.latitude, record.longitude], 14)
              }
            }}
          />
        }
        onClick={(isListOpen) => {
          if (!map) return

          if (isListOpen && map.attributionControl) {
            map.removeControl(map.attributionControl)
          }

          if (!isListOpen) {
            map.addControl(L.control.attribution())
          }
        }}
        onResize={() => {
          handleMapRefresh()
        }}
      />

      <MapControls
        isZoomInDisabled={isZoomInDisabled}
        isZoomOutDisabled={isZoomOutDisabled}
        loading={loading}
        metadata={metadata}
        onRefresh={reload}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
      />

      <Drawer
        isOpen={selectedRecord !== null}
        onClose={() => handleRecordSelect(null)}
      >
        {selectedRecord && <RecordDetails {...selectedRecord} />}
      </Drawer>
    </>
  )
}

export default Viewport
