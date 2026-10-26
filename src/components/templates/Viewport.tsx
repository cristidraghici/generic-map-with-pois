import L, { LatLngTuple } from 'leaflet'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Drawer from '@/components/molecules/Drawer'
import HorizontalViewportSplit from '@/components/molecules/HorizontalViewportSplit'
import RecordDetails from '@/components/molecules/RecordDetails'
import ListView from '@/components/organisms/ListView'
import MapContainer from '@/components/organisms/MapContainer'
import MapControls from '@/components/organisms/MapControls'
import SearchSection from '@/components/organisms/SearchSection'

import useFetchData from '@/hooks/useFetchData'
import useMap from '@/hooks/useMap'
import useURLParams from '@/hooks/useURLParams'
import { CustomRecord } from '@/types'
import { reduceVisibleRecords } from '@/utils/performance'

const Viewport = () => {
  const [search, setSearch] = useState<string>('')
  const [selectedRecord, setSelectedRecord] = useState<CustomRecord | null>(
    null,
  )

  const {
    params: { id, selected },
    listParams: { api: apiUrls = [] },
    updateParams,
  } = useURLParams()

  /**
   * Index of the selected dataset (`?selected=`), defaulting to the first one
   */
  const selectedDatasetIndex = useMemo(() => {
    const index = Number(selected)
    return Number.isInteger(index) && index >= 0 && index < apiUrls.length
      ? index
      : 0
  }, [selected, apiUrls.length])

  const {
    allRecords,
    records,
    metadata,
    config,
    layers,
    loading,
    error,
    datasets,
    reload,
  } = useFetchData(apiUrls, selectedDatasetIndex, search)

  const [visibleLayerIds, setVisibleLayerIds] = useState<string[]>([])
  const prevDatasetIndexRef = useRef(selectedDatasetIndex)

  // Reset or initialize visible layers when dataset changes or layers load
  useEffect(() => {
    if (layers.length > 0) {
      if (prevDatasetIndexRef.current !== selectedDatasetIndex) {
        prevDatasetIndexRef.current = selectedDatasetIndex
        setVisibleLayerIds(layers.map((l) => l.id))
      } else {
        setVisibleLayerIds((prev) => {
          if (prev.length === 0) {
            return layers.map((l) => l.id)
          }
          const layerIdSet = new Set(layers.map((l) => l.id))
          const retained = prev.filter((layerId) => layerIdSet.has(layerId))
          return retained.length > 0 ? retained : layers.map((l) => l.id)
        })
      }
    } else {
      setVisibleLayerIds([])
    }
  }, [layers, selectedDatasetIndex])

  const handleToggleLayer = useCallback((layerId: string) => {
    setVisibleLayerIds((prev) =>
      prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId],
    )
  }, [])

  // Deselect active record and close drawer if its layer is unchecked
  useEffect(() => {
    if (!selectedRecord) return
    if (
      layers.length > 1 &&
      selectedRecord.layerId &&
      !visibleLayerIds.includes(selectedRecord.layerId)
    ) {
      setSelectedRecord(null)
    }
  }, [selectedRecord, layers.length, visibleLayerIds])

  // Filter records by currently active layers
  const activeLayerRecords = useMemo(() => {
    if (layers.length <= 1) return records
    const visibleSet = new Set(visibleLayerIds)
    return records.filter((r) => !r.layerId || visibleSet.has(r.layerId))
  }, [records, layers.length, visibleLayerIds])

  // Aggregate metadata across visible layers
  const activeMetadata = useMemo(() => {
    if (layers.length <= 1) return metadata

    const visibleSet = new Set(visibleLayerIds)
    const activeLayers = layers.filter((l) => visibleSet.has(l.id))
    const items: string[] = []

    for (const layer of activeLayers) {
      if (!layer.metadata) continue
      if (Array.isArray(layer.metadata)) {
        items.push(...layer.metadata)
      } else if (typeof layer.metadata === 'string' && layer.metadata.trim()) {
        items.push(layer.metadata)
      }
    }

    return items.length > 0 ? items : ''
  }, [layers, visibleLayerIds, metadata])

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
    currentZoom,
  } = useMap()

  useEffect(() => {
    if (!map || !allRecords || allRecords.length === 0) return

    const coords = allRecords
      .filter(
        ({ latitude, longitude }) =>
          Number.isFinite(latitude) && Number.isFinite(longitude),
      )
      .map(({ latitude, longitude }) => [latitude, longitude] as LatLngTuple)

    handleSetBounds(coords)
  }, [map, allRecords, handleSetBounds])

  /**
   * Get ID from URL parameter (if exists)
   */
  const idFromUrl = useMemo(() => {
    if (!id) return null
    return id
  }, [id])

  /**
   * Filter records based on the current map viewport bounds
   */
  const visibleRecords = useMemo(() => {
    if (!currentMapBounds) return []

    if (idFromUrl && config.isShowOnlyURLRecordEnabled)
      return activeLayerRecords.filter((record) => record.id === idFromUrl)

    if (config.isAggressiveOptimizationEnabled) {
      return reduceVisibleRecords(
        activeLayerRecords,
        currentMapBounds,
        currentZoom,
      )
    }

    return activeLayerRecords.filter((record) =>
      currentMapBounds.contains([record.latitude, record.longitude]),
    )
  }, [activeLayerRecords, currentMapBounds, idFromUrl, config, currentZoom])

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
    () => !!config.isListEnabled && activeLayerRecords.length > 0 && !idFromUrl,
    [config.isListEnabled, activeLayerRecords.length, idFromUrl],
  )

  /**
   * Switch the dataset: keep the search, close the drawer and drop the
   * record `id`, which belongs to the previous dataset
   */
  const handleDatasetChange = useCallback(
    (index: number) => {
      setSelectedRecord(null)
      updateParams({ selected: index.toString(), id: null })
    },
    [updateParams],
  )

  return (
    <>
      <SearchSection
        loading={loading}
        error={error}
        hasUrl={apiUrls.length > 0}
        datasets={datasets}
        selectedDatasetIndex={selectedDatasetIndex}
        onSearchChange={setSearch}
        onDatasetChange={handleDatasetChange}
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
            records={
              config.isListFilteredToViewport
                ? visibleRecords
                : activeLayerRecords
            }
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
        metadata={activeMetadata}
        layers={layers}
        visibleLayerIds={visibleLayerIds}
        onToggleLayer={handleToggleLayer}
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
