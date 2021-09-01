export default class CategoryNotFoundError extends Error {
  constructor(categorySlug: string = '') {
    categorySlug = categorySlug ? categorySlug + ' ' : categorySlug;
    super(`Category ${categorySlug}not found`);
    this.name = "CategoryNotFoundError";
    this.categorySlug = categorySlug;
  }
  public categorySlug: string;
}
