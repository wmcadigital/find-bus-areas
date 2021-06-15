const url = new URL(typeof window !== 'undefined' ? window.location.href : ''); // Set URL to current if browser window is detected

declare global {
  interface Window {
    dataLayer: any;
  }
}

// Function for getting the value of a search param in the URL
const getAllSearchParams = () => {
  const params: any[] = [];
  url.searchParams.forEach((value, key) => {
    params.push({ name: key, id: value });
  });
  return params; // Get the search param value for name passed in, and return back
};

// Function for getting the value of a search param in the URL
const getSearchParam = (name: string) => {
  return url.searchParams.get(name); // Get the search param value for name passed in, and return back
};

// Function for setting the value of a search param in the URL
const setSearchParam = (name: string, val: string) => {
  url.searchParams.set(name, val); // Set the search param with the name provided to the value provided
  window.history.pushState({}, '', url.href); // Then push the updated search params back to the URL

  // If we ever set new search params then push the new URL to Google Analytics
  window.dataLayer = window.dataLayer || []; // Set datalayer (GA thing)
  // This is a Google Tag Manager event that allows to pass in a route
  window.dataLayer.push({
    event: 'ngRouteChange',
    attributes: {
      route: url.search,
    },
  });
};

// Function for deleting a search param in the URL
const delSearchParam = (name: string) => {
  url.searchParams.delete(name); // Delete the search param for the name provided
  window.history.pushState({}, '', url.href); // Then push the updated search params back to the URL
};

export { getAllSearchParams, getSearchParam, setSearchParam, delSearchParam }; // Return functions, so they can be called independently
