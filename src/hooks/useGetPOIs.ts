import { useState, useEffect } from "react";
import mockData from "../assets/cities_in_romania.json";

/**
 * List of regular expressions used to whitelist the URL given as a source of POIs.
 * This is a minimal security feature to prevent the most basic abuse.
 */
const ALLOWED_API_URLS: RegExp[] = [
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, // A regex for the Github pages
];

const useGetPOIs = (url?: string) => {
  const [records, setRecords] = useState<CustomMarker[]>([]);
  const [metadata, setMetadata] = useState<Metadata>("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [reload, setReload] = useState(0);

  useEffect(() => {
    // No url was provided
    if (!url) {
      return;
    }

    // Load the default data
    if (url === "/cities_in_romania.json") {
      setRecords(Array.isArray(mockData) ? mockData : mockData.records);
      setMetadata(!mockData?.metadata ? "" : mockData?.metadata);
      return;
    }

    // The provided url does not match the regex values in the whitelist
    if (ALLOWED_API_URLS.every((regex) => !regex.test(url))) {
      setError(
        "The URL provided does not match the safety rules in this project's whitelist."
      );

      return;
    }

    // Fetch the data
    setLoading(true);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<
          CustomMarker[] | APIEnvelope<CustomMarker>
        >;
      })
      .then((json) => {
        if (Array.isArray(json)) {
          setRecords(json);
          setMetadata("");
          return;
        }

        setRecords(json.records);
        setMetadata(json.metadata);
      })
      .catch((error) => {
        setError(error as string);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url, reload]);

  return {
    records,
    metadata,
    loading,
    error,
    reload: () => setReload(reload + 1),
  };
};

export default useGetPOIs;
