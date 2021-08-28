export default class CategoryAlreadyExistsError extends Error {
  constructor(categoryName: string = '') {
    categoryName = categoryName ? categoryName + ' ' : categoryName;
    super(`Category ${categoryName}already exists`);
    this.name = "CategoryAlreadyExistsError";
    this.categoryName = categoryName;
  }
  public categoryName: string;
}
