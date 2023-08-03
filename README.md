# Generic map with POIs

> This the a generic leaflet map with points of interest

## About

This project uses React, Typescript, Leaflet and OpenStreetMap to show points of interest (POIs).

It will automatically set bounds and zoom to the loaded POIs. By default, it will show a few cities of Romania.

If you specify an address in the `?api=` url param, then it will try to use that as a source for the points. Please remember to have the following format in your response:

```typescript
type ResponseType = Promise<
  {
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
  }[]
>;
```

## Install and first run

- `npm i`
- `npm run dev`

## Notes

If you intend to use this project as a base for a new one, please remember to update the `base` url in `vite.config.js`. It is currently used for publishing the project to Github Pages. You can also completely remove it.
