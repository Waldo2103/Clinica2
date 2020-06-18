import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  constructor(
    private db: AngularFirestore
  ) { }

  Registrar(objeto){
    return  this.db.collection(`encuesta`).doc(objeto.id).set(objeto);
  }
}
