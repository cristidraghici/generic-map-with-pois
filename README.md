# Generic map with POIs

> This the a generic leaflet map with points of interest

## Demo

[https://cristidraghici.github.io/generic-map-with-pois/?api=/cities_in_romania.json](https://cristidraghici.github.io/generic-map-with-pois/?api=/cities_in_romania.json)

## About

This project uses React, Typescript, Leaflet and OpenStreetMap to show points of interest (POIs).

It will automatically set bounds and zoom to the loaded POIs. By default, it will show a few cities of Romania.

If you specify an address in the `?api=` url param, then it will try to use that as a source for the points. Please remember to have the following format in your response:

```typescript
type ResponseType = Promise<
  {
    id?: string
    latitude: number
    longitude: number
    title: string
    description?: string | string[]
    images?: string[]
  }[]
>
```

There is also an option to use an enveloped structure:

```typescript
interface APIEnvelope<T> {
  metadata: string | string[]
  config: {
    typeOfIcon: 'text' | 'default' | 'dot' // the icon to use in the data
    isListVisible: boolean | undefined // show the toggler to view a list
    isListFilteredToViewport: boolean | undefined // show only the POIs in the viewport
    zoomOnSelect: boolean | undefined // zoom to a POI when clicked
  }
  records: T[]
}
```

## Install and first run

- `npm i`
- `npm run dev`

## Notes

If you intend to use this project as a base for a new one, please remember to update the `base` url in `vite.config.js`. It is currently used for publishing the project to Github Pages. You can also completely remove it.

## Icons

We are using FontAwesome svg icons: [https://fontawesome.com/search](https://fontawesome.com/search)
