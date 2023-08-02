import { useState, useEffect } from "react";

type URLParams = { [key: string]: string };

function useURLParams(): URLParams {
  const [params, setParams] = useState<URLParams>({});

  useEffect(() => {
    // Function to parse the URL query string and extract parameters
    const parseQueryString = (queryString: string) => {
      const params: URLParams = {};
      const query = new URLSearchParams(queryString);
      query.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    };

    // Get the current URL
    const currentURL = window.location.href;

    // Extract the query string from the URL
    const queryString = currentURL.split("?")[1];

    // Parse the query string and update the state with parameters
    if (queryString) {
      const parsedParams = parseQueryString(queryString);
      setParams(parsedParams);
    }

    // Update the state when the URL changes
    const handleURLChange = () => {
      const newURL = window.location.href;
      const newQueryString = newURL.split("?")[1];
      if (newQueryString) {
        const newParams = parseQueryString(newQueryString);
        setParams(newParams);
      }
    };

    // Add event listener for URL changes
    window.addEventListener("popstate", handleURLChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handleURLChange);
    };
  }, []);

  return params;
}

export default useURLParams;
