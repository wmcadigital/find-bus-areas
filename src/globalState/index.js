// Export * from  any context files in the globalState folder

// By adding them below, we don't have to import directly to the file like...
// import {ContextA} from 'globalState/ContextA';
// import {ContextB} from 'globalState/ContextB';

// Instead, by exporting them all below, we can now import by linking to this index.js file like...
// import {ContextA, ContextB} from 'globalState'
// Much easier! :)

// Don't forget to add the providers for each context to the ./ContextProvider.js file(more info inside there)
export { useFormContext, FormProvider } from './FormContext';
export { useMapContext, MapProvider } from './MapContext';
