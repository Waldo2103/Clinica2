import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { especialidad } from '../clases/especialidad';
import { delay } from 'rxjs/operators';
import { Profesional } from '../clases/profesional';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) { }
  /**********ESPECIALIDADES****** */
  //Trae Todos
  public getEspecialidades() {
    //console.log("entre a servicio", this.firestore.collection('mercados').snapshotChanges())
    return this.db.collection<especialidad>('especialidades').snapshotChanges()
              .pipe( delay(2000) );
  }
  //Alta
  public createEspecialidad(id:string, data: {idEspecialidad: string, nombre: string}) {
    return this.db.collection('especialidades').doc(id).set(data);
  }
  //Trae 1
  public getEspecialidad(documentId: string) {
    return this.db.collection('especialidades').doc(documentId).snapshotChanges();
  }
  /**********ESPECIALIDADES X USUARIO****** */
  //Trae Todos
  public getEspecialidadesXUsuario() {
    //console.log("entre a servicio", this.firestore.collection('mercados').snapshotChanges())
    return this.db.collection<especialidad>('especialidadesXUsuario').snapshotChanges()
              .pipe( delay(2000) );
  }
  //Trae 1 con los profesionales
  public getEspecialidadXUsuarioWithProf(id) {
    //console.log("entre a servicio", this.firestore.collection('mercados').snapshotChanges())
    return this.db.collection<especialidad>('especialidadesXUsuario'+id+'profesionales').snapshotChanges()
              .pipe( delay(2000) );
  }
  //Alta NO SIRVE SI DEJA DE EJEMPLO PARA COLECCIONES SIMPLES
  public createEspecialidadXUsuario(id:string, data: {idEspecialidad: string, nombre: string}) {
    return this.db.collection('especialidadesXUsuario').doc(id).set(data);
  }
  //Trae 1
  public getEspecialidadXUsuario(idEsp: string) {
    return this.db.collection('especialidadesXUsuario/'+idEsp+'/profesionales').snapshotChanges();
  }
  //Agrega una especialidad x usuario
  public addProfAEspecialidadXUsu(idEsp: string , data: any) {
    return this.db.collection('especialidadesXUsuario/'+idEsp+'/profesionales').add(data);
  }
  //Actualiza lista de prof de una especialidad x usuario
  public updateEspecialidadXUsuario(documentId: string, data: any) {
    return this.db.collection('especialidadesXUsuario').doc(documentId).set(data);
  }
  /************************HORARIOS POR USUARIO**********************************CREO QUE NO VA A HACER FALTA */
  //Trae 1 CREE
  public getHorariosXUsuario(idHor: string) {
    return this.db.collection('horariosXUsuario/'+idHor+'/profesionales').snapshotChanges();
  }
  //Agrega una especialidad x usuario
  public addProfAHorariosXUsu(idEsp: string , data: any) {
    return this.db.collection('horariosXUsuario/'+idEsp+'/profesionales').add(data);
  }

  /****************************************************************************** */
  /*******************************PROFESIONALES******************************** */
  //Alta  SE HACE EN AUTHSERVICE
  
  //Trae 1
  public getProfesional(documentId: string) {
    return this.db.collection('profesionales').doc(documentId).snapshotChanges();
  }
  //Trae Todos
  public getProfesionales() {
    console.log("entre a servicio", this.db.collection('profesionales').snapshotChanges())
    return this.db.collection('profesionales').snapshotChanges();
  }

  //Actualiza 1
  public updateProfesional(documentId: string, data: any) {
    return this.db.collection('profesionales').doc(documentId).set(data);
  }

  // Borra 1
  public deleteProfesional(documentId: string) {
    console.log(documentId);
    return this.db.collection('profesionales').doc(documentId).delete();
  }
  /***************************************************************************** */
}
