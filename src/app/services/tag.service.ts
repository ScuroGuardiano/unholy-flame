import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import slugify from 'slugify';
import TagAlreadyExistsError from '../errors/tag-already-exists-error';
import ITag from '../tags/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private firestore: AngularFirestore) { }

  public async addTag(name: string) {
    const slug = slugify(name, { lower: true });
    const doc = await this.firestore.collection<ITag>('/tags').doc(slug).get().toPromise();
    if (doc.exists) {
      throw new TagAlreadyExistsError(name);
    }

    await this.firestore.collection<ITag>('/tags').doc(slug).set({slug, name});
    return;
  }

  public async deleteTag(slug: string) {
    await this.firestore.collection<ITag>('/tags').doc(slug).delete();
  }

  public getTags(limit = 10, offset = 0) {
    return this.firestore.collection<ITag>('/tags',
      ref => ref.orderBy('slug').startAt(offset).limit(limit))
    .get()
    .pipe(
      take(1),
      map(tagsSnap => {
        return tagsSnap.docs.map<ITag>(tag => {
          return {
            id: tag.id,
            slug: tag.data().slug,
            name: tag.data().name
          };
        });
      })
    );
  }
}
