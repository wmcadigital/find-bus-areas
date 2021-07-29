import { useEffect, useState, useRef, useCallback } from 'react';
import { getBusAreas } from 'components/App/NZoneAreas/NZoneAreas';
import axios from 'axios';

interface IError {
  title: string;
  message: string;
  isTimeoutError?: boolean;
}

const useBusStopAPI = (location: any) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Set loading state for spinner
  const [errorInfo, setErrorInfo] = useState<IError | null>(null); // Placeholder to set error messaging

  // Reference variables
  const mounted = useRef<any>();
  const source = useRef<any>();
  const apiTimeout = useRef<any>();
  // Helper functions
  const cancelRequest = () => {
    if (source.current) source.current.cancel('Api request timeout');
  };

  const startApiTimeout = useCallback(() => {
    apiTimeout.current = setTimeout(() => {
      cancelRequest();
    }, 15000); // 15 seconds
  }, []);

  const clearApiTimeout = () => clearTimeout(apiTimeout.current);

  const handleApiResponse = useCallback((response) => {
    if (response.data.stopPoints?.length > 0) {
      const stopResults = response.data.stopPoints
        .map((stop: any) => {
          const stopBusAreas = getBusAreas([stop.longitude, stop.latitude]);
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [stop.longitude, stop.latitude],
            },
            properties: {
              ...stop,
            },
            stopBusAreas,
          };
        })
        .filter((stop: any) => stop.stopBusAreas.length > 0);

      if (stopResults.length > 0) {
        setResults(stopResults);
      } else {
        setResults([]);
        setErrorInfo({
          // Update error message
          title: 'Please try another location',
          message: 'No west midlands bus stops were found near to your selected location',
        });
      }
    }
    clearApiTimeout();
    setLoading(false);
  }, []);

  const handleApiError = (error: any) => {
    setLoading(false); // Set loading state to false after data is received
    setErrorInfo({
      // Update error message
      title: 'Please try again',
      message: 'Apologies, we are having technical difficulties.',
      isTimeoutError: axios.isCancel(error),
    });
    setResults([]); // Reset the results
    if (!axios.isCancel(error)) {
      // eslint-disable-next-line no-console
      console.log({ error });
    }
  };

  // Take main function out of useEffect, so it can be called elsewhere to retry the search
  const getAPIResults = useCallback(
    ({ x: longitude, y: latitude }) => {
      source.current = axios.CancelToken.source();
      mounted.current = true; // Set mounted to true (used later to make sure we don't do events as component is unmounting)
      const { REACT_APP_API_HOST, REACT_APP_API_KEY } = process.env; // Destructure env vars
      setLoading(true); // Update loading state to true as we are hitting API
      startApiTimeout();
      const options = {
        headers: {
          'Ocp-Apim-Subscription-Key': REACT_APP_API_KEY,
        },
        cancelToken: source.current.token, // Set token with API call, so we can cancel this call on unmount
      };

      axios
        .get(`${REACT_APP_API_HOST}/Stop/v1/Nearest/${latitude}/${longitude}/`, options)
        .then((res) => mounted.current && handleApiResponse(res))
        .catch(handleApiError);
    },
    [handleApiResponse, startApiTimeout]
  );

  useEffect(() => {
    if (!location) setResults([]);
    // Unmount / cleanup
    return () => {
      mounted.current = false; // Set mounted back to false on unmount
      setResults([]); // clear results on unmount
      cancelRequest(); // cancel the request
      clearApiTimeout(); // clear timeout
    };
  }, [location]);

  return { loading, errorInfo, results, getAPIResults };
};

export default useBusStopAPI;
