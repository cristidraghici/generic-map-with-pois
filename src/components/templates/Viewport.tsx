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
import { reduceVisibleRecords } from '@/utils/performance'

const Viewport = () => {
  const [search, setSearch] = useState<string>('')
  const [selectedRecord, setSelectedRecord] = useState<CustomRecord | null>(
    null,
  )

  const { api, id } = useURLParams()

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
   * Get ID from URL parameter (if exists)
   */
  const idFromUrl = useMemo(() => {
    if (!id) return null
    return id
  }, [id])

  const zoomLevel = useMemo(() => map?.getZoom() || 0, [map])

  /**
   * Filter records based on the current map viewport bounds
   */
  const visibleRecords = useMemo(() => {
    if (!currentMapBounds) return []

    if (idFromUrl && config.isShowOnlyURLRecordEnabled)
      return records.filter((record) => record.id === idFromUrl)

    if (config.isAggressiveOptimizationEnabled) {
      return reduceVisibleRecords(records, currentMapBounds, zoomLevel)
    }

    return records.filter((record) =>
      currentMapBounds.contains([record.latitude, record.longitude]),
    )

    return []
  }, [records, currentMapBounds, idFromUrl, config, zoomLevel])

  const handleRecordSelect = useCallback(
    (record: CustomRecord | null) => {
      if (!record) {
        setSelectedRecord(record)
        return
      }

      setSelectedRecord(record)

      if (!map) return

      if (!!config.isZoomOnSelectEnabled || idFromUrl === record.id) {
        map.flyTo([record.latitude, record.longitude], 15)
      }
    },
    [map, config, idFromUrl],
  )

  /**
   * Handle ID parameter to focus specific record
   */
  useEffect(() => {
    if (!id || !records || records.length === 0) return

    const targetRecord = records.find((record) => record.id === id)
    if (targetRecord) {
      handleRecordSelect(targetRecord)
    }
  }, [id, records, handleRecordSelect])

  const isListEnabled = useMemo(
    () => !!config.isListEnabled && records.length > 0 && !idFromUrl,
    [config.isListEnabled, records.length, idFromUrl],
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
        isSplitEnabled={isListEnabled}
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
            records={config.isListFilteredToViewport ? visibleRecords : records}
            onRecordSelect={(record) => {
              handleRecordSelect(record)

              if (!config.isZoomOnSelectEnabled) {
                map?.flyTo([record.latitude, record.longitude], 18)
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
