export default interface ICategory {
  slug: string;
  name: string;
  parentCategory: string;
  subcategories: string[];
}
