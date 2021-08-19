import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import slugify from 'slugify';
import TagAlreadyExistsError from '../errors/tag-already-exists-error';
import ITag from '../tags/tag';

export interface ITagsDoc {
  tags: ITag[];
}

@Injectable({
  providedIn: 'root'
})
export class BetterTagService {

  constructor(private firestore: AngularFirestore) { }

  private tags: ITag[] = [];
  private tagsLoaded = false;

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

    await this.loadTagsFromFirestore();  // Check note at the bottom of a file
    const doesTagExists = this.tags.some(tag => tag.slug === tagToAdd.slug);

    if (doesTagExists) {
      throw new TagAlreadyExistsError();
    }

    this.tags.push(tagToAdd);
    this.firestore.collection<ITagsDoc>('/tags').doc('tags').set({
      tags: this.tags
    });
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

    await this.loadTagsFromFirestore(); // Check note at the bottom of a file
    const notExistingTags = tagsToAdd.filter(tagToAdd => !this.tags.some(existingTag => existingTag.slug === tagToAdd.slug));
    this.tags.push(...notExistingTags);
    await this.firestore.collection<ITagsDoc>('/tags').doc('tags').set({
      tags: this.tags
    });

    return notExistingTags.length;
  }

  async deleteTag(slug: string) {
    await this.loadTagsFromFirestore(); // Check note at the bottom of a file

    const tagsWithoutRemovedOne = this.tags.filter(tag => tag.slug !== slug);
    if (tagsWithoutRemovedOne.length === this.tags.length) {
      return; // Tag doesn't exists LOL
    }

    this.tags = tagsWithoutRemovedOne;
    this.firestore.collection<ITagsDoc>('/tags').doc('tags').set({
      tags: this.tags
    });
  }

  /**
   * Will add tags array of tags to the database. If tag exists it will omit it
   * @returns how many tags were deleted
   */
  async deleteTags(slugs: string[]): Promise<number> {
    await this.loadTagsFromFirestore(); // Check note at the bottom of a file

    const tagsWithoutRemovedOnes = this.tags.filter(tag => slugs.includes(tag.slug));
    const removed = this.tags.length - tagsWithoutRemovedOnes.length;
    if (removed === 0) {
      return 0;
    }

    this.tags = tagsWithoutRemovedOnes;
    await this.firestore.collection<ITagsDoc>('/tags').doc('tags').set({
      tags: this.tags
    });
    return removed;
  }

  /**
   * @returns result of loading, false - there's no tags document in firestore, true - loaded correctly
   */
  private async loadTagsFromFirestore(): Promise<boolean> {
    const tagsSnapshot = await this.firestore.collection<ITagsDoc>('/tags')
    .doc('tags').get().toPromise();

    if (!tagsSnapshot.exists) {
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


// Note
// I am reloading data to make sure I have fresh tags, nobody added to it on other tab or something like that
// As every add or delete is in fact document update, coz I store tags in single document XD (more on this in notes/bad-approach.md)
// It should be here in transaction but it's not possible in firestore
// But I hope it will be consistent
