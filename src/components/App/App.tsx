import React from 'react';
// Contexts
import ContextProvider from 'globalState/ContextProvider';
// Components
import BusArea from './BusArea/BusArea';

function App() {
  return (
    <React.StrictMode>
      <ContextProvider>
        <BusArea />
      </ContextProvider>
    </React.StrictMode>
  );
}

export default App;
