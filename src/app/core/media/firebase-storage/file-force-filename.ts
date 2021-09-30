export type FileForceFilename<T extends File = File> = T & {
  forcedStorageFilename?: string;
}
