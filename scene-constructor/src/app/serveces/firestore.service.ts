import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import {Scene} from '../models/scene.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private COLLECTION = 'Scene';

  constructor(private fireStore: AngularFirestore) { }

  addNewScene(scene: Scene): Promise<DocumentReference<Scene>> {
    return this.fireStore.collection<any>(this.COLLECTION)
      .add({
        id: scene.id,
        title: scene.title,
        text: scene.text
      });
  }
}
