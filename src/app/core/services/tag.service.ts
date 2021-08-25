import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import slugify from 'slugify';
import TagAlreadyExistsError from '../errors/tag-already-exists-error';
import ITag from '../components/tags/tag';

export interface ITagsDoc {
  tags: ITag[];
}

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private firestore: AngularFirestore) { }

  private tags: ITag[] = [];
  private tagsLoaded = false;
  private tagsDocRef = this.firestore.firestore.collection('/tags').doc('tags');

  async getTags(forceLoadFromServer = false): Promise<ITag[]> {
    if (!forceLoadFromServer) {
      if (this.tagsLoaded) {
        return this.tags;
      }

      if (this.loadTagsFromSessionStorage()) {
        return this.tags;
      }
    }

    await this.loadTagsFromFirestore();
    return this.tags;
  }

  async addTag(tagName: string) {
    const tagToAdd = {
      slug: slugify(tagName, { lower: true }),
      name: tagName
    };

    this.tags = await this.firestore.firestore.runTransaction(async transaction => {
      const existingTags = await this.getTagsWithinTransaction(transaction);

      const doesTagExists = existingTags.some(tag => tag.slug === tagToAdd.slug);
      if (doesTagExists) {
        throw new TagAlreadyExistsError();
      }
      existingTags.push(tagToAdd);
      transaction.set(this.tagsDocRef, {
        tags: existingTags
      });

      return existingTags;
    });

    this.saveTagsToSessionStorage();
  }

  /**
   * Will add tags array to the database. If tag exists it will omit it
   * @returns returns how many tags were added
   */
  async addTags(tagsNames: string[]): Promise<number> {
    const tagsToAdd = tagsNames.map<ITag>(tagName => {
      return {
        name: tagName,
        slug: slugify(tagName, { lower: true })
      }
    });

    let added = 0;

    this.tags = await this.firestore.firestore.runTransaction(async transaction => {
      const existingTags = await this.getTagsWithinTransaction(transaction);

      const notExistingTags = tagsToAdd.filter(tagToAdd => !existingTags.some(existingTag => existingTag.slug === tagToAdd.slug));
      existingTags.push(...notExistingTags);

      transaction.set(this.tagsDocRef, {
        tags: existingTags
      })
      added = notExistingTags.length;
      return existingTags;
    });

    this.saveTagsToSessionStorage();
    return added;
  }

  async deleteTag(slug: string) {
    this.tags = await this.firestore.firestore.runTransaction(async transaction => {
      const existingTags = await this.getTagsWithinTransaction(transaction);

      const tagsWithoutRemovedOne = existingTags.filter(tag => tag.slug !== slug);
      if (tagsWithoutRemovedOne.length === this.tags.length) {
        return existingTags; // Tag doesn't exists LOL
      }

      transaction.set(this.tagsDocRef, {
        tags: tagsWithoutRemovedOne
      });

      return tagsWithoutRemovedOne;
    })

    this.saveTagsToSessionStorage();
  }

  /**
   * Will add tags array of tags to the database. If tag exists it will omit it
   * @returns how many tags were deleted
   */
  async deleteTags(slugs: string[]): Promise<number> {
    let removed = 0;

    this.tags = await this.firestore.firestore.runTransaction(async transaction => {
      const existingTags = await this.getTagsWithinTransaction(transaction);

      const tagsWithoutRemovedOnes = existingTags.filter(tag => !slugs.includes(tag.slug));
      removed = this.tags.length - tagsWithoutRemovedOnes.length

      if (removed === 0) {
        return existingTags;
      }

      transaction.set(this.tagsDocRef, {
        tags: tagsWithoutRemovedOnes
      });

      return tagsWithoutRemovedOnes;
    })

    this.saveTagsToSessionStorage();
    return removed;
  }


  private async getTagsWithinTransaction(transaction: firebase.default.firestore.Transaction): Promise<ITag[]> {

    const tagsDoc = await transaction.get(this.tagsDocRef);
    return (tagsDoc.data()?.tags ?? []) as ITag[];
  }
  /**
   * @returns result of loading, false - there's no tags document in firestore, true - loaded correctly
   */
  private async loadTagsFromFirestore(): Promise<boolean> {
    const tagsSnapshot = await this.firestore.collection<ITagsDoc>('/tags')
    .doc('tags').get().toPromise();

    if (!tagsSnapshot.exists) {
      this.tags = [];
      return false;
    }

    this.tags = tagsSnapshot.data()!.tags;
    this.tagsLoaded = true;
    this.saveTagsToSessionStorage();
    return true;
  }

  private loadTagsFromSessionStorage(): boolean {
    const tagsJson = sessionStorage.getItem('tags');
    if (tagsJson === null) return false;

    const tags = JSON.parse(tagsJson);
    if (!(tags instanceof Array)) return false;

    this.tags = tags;
    this.tagsLoaded = true;
    return true;
  }
  private saveTagsToSessionStorage() {
    sessionStorage.setItem('tags', JSON.stringify(this.tags));
  }
}
