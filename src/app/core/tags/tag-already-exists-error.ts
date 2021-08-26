export default class TagAlreadyExistsError extends Error {
  constructor(tagName: string = '') {
    tagName = tagName ? tagName + ' ' : tagName;
    super(`Tag ${tagName}already exists`);
    this.name = "TagAlreadyExists";
    this.tagName = tagName;
  }
  public tagName: string;
}
