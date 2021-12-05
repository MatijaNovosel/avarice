export default interface IWebStorageService {
  saveState(key: string, data: string): void;
  // eslint-disable-next-line
  getSavedState(key: string): any;
  removeSavedState(key: string): void;
}

export const webStorageServiceSymbol = Symbol("IWebStorageService");
