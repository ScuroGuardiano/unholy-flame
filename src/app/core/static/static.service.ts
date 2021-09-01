import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

export interface IStaticDoc {
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaticService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  public async get(resouceId: string): Promise<string> {
    const doc = await this.firestore.collection<IStaticDoc>('/static').doc(`/${resouceId}`).get().toPromise();
    if (doc.exists && typeof doc.data()?.content === "string") {
      return doc.data()!.content;
    }
    return '';
  }

  public async save(resouceId: string, content: string): Promise<void> {
    await this.firestore
      .collection<IStaticDoc>('/static')
      .doc(`/${resouceId}`)
      .set({ content });
  }
}
