/// <reference types="vite/client" />

type CustomMarker = {
  latitude: number;
  longitude: number;
  title: string;
  description?: string | string[];
};

/**
 * Metadata currently only consists of a string or an array of strings
 * containing information about the retrieved records
 */
type Metadata = string | string[];

interface APIEnvelope<T> {
  metadata: Metadata;
  records: T[];
}
