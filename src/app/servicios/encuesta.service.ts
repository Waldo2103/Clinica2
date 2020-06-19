import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Encuesta } from '../clases/encuesta';

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
  //Trae todas
  public getEncuestas() {
    return this.db.collection<Encuesta>('encuesta').snapshotChanges();
  }
  //Trae 1
  public getEncuesta(documentId: string) {
    return this.db.collection('encuesta').doc(documentId).snapshotChanges();
  }

  RegistrarPaci(objeto: Encuesta){
    return  this.db.collection(`encuestaPaci`).doc(objeto.id).set(objeto);
  }
  //Trae todas
  public getEncuestasPaci() {
    return this.db.collection('encuestaPaci').snapshotChanges();
  }
  //Trae 1
  public getEncuestaPaci(documentId: string) {
    return this.db.collection('encuestaPaci').doc(documentId).snapshotChanges();
  }



}
