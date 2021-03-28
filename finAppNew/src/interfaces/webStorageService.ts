export default interface IWebStorageService {
  saveState(key: string, data: string);
  getSavedState(key: string);
  removeSavedState(key: string);
} 

export const webStorageServiceSymbol = Symbol("IWebStorageService")