import { useState, useEffect } from "react";
import citiesInRomania from "../assets/cities_in_romania.json";

/**
 * List of regular expressions used to whitelist the URL given as a source of POIs.
 * This is a minimal security feature to prevent the most basic abuse.
 */
const ALLOWED_API_URLS: RegExp[] = [
  /^https:\/\/\w+\.github\.io\/[\w-]+(\/[\w-]+\/)?$/, // A regex for the Github pages
];

const useGetPOIs = (url?: string) => {
  const [data, setData] = useState<CustomMarker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // No url was provided
    if (!url) {
      setLoading(false);
      setData(citiesInRomania);
      return;
    }

    // The provided url does not match the regex values in the whitelist
    if (ALLOWED_API_URLS.every((regex) => !regex.test(url))) {
      setLoading(false);
      setError(
        "The URL provided does not match the safety rules in this project's whitelist."
      );
      return;
    }

    // Fetch the data
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<CustomMarker[]>;
      })
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        setError(error as string);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};

export default useGetPOIs;
