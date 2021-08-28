import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import slugify from 'slugify';
import ICategory from './category';
import CategoryAlreadyExistsError from './category-already-exists-error';

export interface ICategoriesDoc {
  categories: ICategory[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private firestore: AngularFirestore) { }

  private categories: ICategory[] = [];
  private categoriesLoaded = false;
  private categoriesDocRef = this.firestore.firestore.collection('/categories').doc('categories');

  async getCategories(forceLoadFromServer = false): Promise<ICategory[]> {
    if (!forceLoadFromServer) {
      if (this.categoriesLoaded) {
        return this.categories;
      }

      if (this.loadCategoriesFromSessionStorage()) {
        return this.categories;
      }
    }

    await this.loadCategoriesFromFirestore();
    return this.categories;
  }

  async addCategory(categoryName: string) {
    const categoryToAdd = {
      slug: slugify(categoryName, { lower: true }),
      name: categoryName
    };

    this.categories = await this.firestore.firestore.runTransaction(async transaction => {
      const existingCategories = await this.getCategoriesWithinTransaction(transaction);

      const doesCategoryExists = existingCategories.some(category => category.slug === categoryToAdd.slug);
      if (doesCategoryExists) {
        throw new CategoryAlreadyExistsError(categoryName);
      }
      existingCategories.push(categoryToAdd);
      transaction.set(this.categoriesDocRef, {
        categories: existingCategories
      });

      return existingCategories;
    });

    this.saveCategoriesToSessionStorage();
  }

  /**
   * Will add categories array to the database. If category exists it will omit it
   * @returns returns how many categories were added
   */
  async addCategories(categoriesNames: string[]): Promise<number> {
    const categoriesToAdd = categoriesNames.map<ICategory>(categoryName => {
      return {
        name: categoryName,
        slug: slugify(categoryName, { lower: true })
      }
    });

    let added = 0;

    this.categories = await this.firestore.firestore.runTransaction(async transaction => {
      const existingCategories = await this.getCategoriesWithinTransaction(transaction);

      const nonExistingCategories = categoriesToAdd
        .filter(categoryToAdd => !existingCategories.some(existingCategory => existingCategory.slug === categoryToAdd.slug));
      existingCategories.push(...nonExistingCategories);

      transaction.set(this.categoriesDocRef, {
        categories: existingCategories
      });
      added = nonExistingCategories.length;
      return existingCategories;
    });

    this.saveCategoriesToSessionStorage();
    return added;
  }

  async deleteCategory(slug: string) {
    this.categories = await this.firestore.firestore.runTransaction(async transaction => {
      const existingCategories = await this.getCategoriesWithinTransaction(transaction);

      const categoriesWithoutRemovedOne = existingCategories.filter(category => category.slug !== slug);
      if (categoriesWithoutRemovedOne.length === this.categories.length) {
        return existingCategories; // Category doesn't exists LOL
      }

      transaction.set(this.categoriesDocRef, {
        categories: categoriesWithoutRemovedOne
      });

      return categoriesWithoutRemovedOne;
    });

    this.saveCategoriesToSessionStorage();
  }

  /**
   * Will delete categories from the database. If category does not exists it will omit it
   * @returns how many categories were deleted
   */
  async deleteCategories(slugs: string[]): Promise<number> {
    let removed = 0;

    this.categories = await this.firestore.firestore.runTransaction(async transaction => {
      const existingCategories = await this.getCategoriesWithinTransaction(transaction);

      const categoriesWithoutRemovedOnes = existingCategories.filter(category => slugs.includes(category.slug));
      removed = this.categories.length - categoriesWithoutRemovedOnes.length;

      if (removed === 0) {
        return existingCategories;
      }

      transaction.set(this.categoriesDocRef, {
        categories: categoriesWithoutRemovedOnes
      });

      return categoriesWithoutRemovedOnes;
    });

    this.saveCategoriesToSessionStorage();
    return removed;
  }

  private async getCategoriesWithinTransaction(transaction: firebase.default.firestore.Transaction): Promise<ICategory[]> {
    const categoriesDoc = await transaction.get(this.categoriesDocRef);
    return (categoriesDoc.data()?.categories ?? []) as ICategory[];
  }

  /**
   * @returns result of loading, false - there's no tags document in firestore, true - loaded correctly
   */
  private async loadCategoriesFromFirestore(): Promise<boolean> {
    const categoriesSnapshot = await this.firestore.collection<ICategoriesDoc>('/categories')
    .doc('categories').get().toPromise();

    if (!categoriesSnapshot.exists) {
      this.categories = [];
      return false;
    }

    this.categories = categoriesSnapshot.data()!.categories;
    this.categoriesLoaded = true;
    this.saveCategoriesToSessionStorage();
    return true;
  }

  private loadCategoriesFromSessionStorage() {
    const categoriesJson = sessionStorage.getItem('categories');
    if (categoriesJson === null) return false;

    const categories = JSON.parse(categoriesJson);
    if (!(categories instanceof Array)) return false;

    this.categories = categories;
    this.categoriesLoaded = true;
    return true;
  }

  private saveCategoriesToSessionStorage() {
    sessionStorage.setItem('categories', JSON.stringify(this.categories));
  }
}
