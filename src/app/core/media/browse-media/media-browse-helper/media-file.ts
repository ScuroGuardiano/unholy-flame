export default interface IMediaFile {
  metadata: firebase.default.storage.FullMetadata;
  fullAbsoluteURL: string;
  thumbnailAbsoluteURL?: string;
}
