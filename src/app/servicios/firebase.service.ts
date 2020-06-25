import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { especialidad } from '../clases/especialidad';
import { delay } from 'rxjs/operators';
import { Profesional } from '../clases/profesional';
import { turno } from '../clases/turno';
import { AuditService } from './audit.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private db: AngularFirestore,
    private audit: AuditService
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
    return this.db.collection<Profesional>('profesionales').snapshotChanges();
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
  /**************************************TURNOS ******************************** */
  //Trae Todos
  public getTurnos(paciente:string) {
    //console.log("entre a servicio", this.firestore.collection('mercados').snapshotChanges())
    return this.db.collection<turno>(`turnos/${paciente}/turnos`).snapshotChanges()
              .pipe( delay(2000) );
  }
  //Alta
  public createTurno(id:string, data: {id: string, fecha: string, hora:string, especialidad: string, paciente: string, profesional: string, atendido:boolean, estado:string, hclinica:string}) {
    //auditamos turnos x espe
        //1- traemos los datos
        let hayUno: boolean = false;
        let listo: boolean = false;
        let idXT;
        let espeXT = {especialidad:"",cantTurnos: 0}
        this.audit.getTurnosXEspe().subscribe(resul=>{
          //let audit
          //recorremos las especialidades con sus turnos
          
          resul.forEach(datos =>{
            //si la espe del nuevo turno coincide le sumo 1
            if (datos.payload.doc.data().especialidad == data.especialidad) {
              hayUno = true;
              idXT = datos.payload.doc.id;
              espeXT = {
                especialidad: datos.payload.doc.data().especialidad,
                cantTurnos: (datos.payload.doc.data().cantTurnos + 1)
              }
              
            }
          });
          
           //
        if(hayUno && !listo) {
          listo = true;
          this.audit.addTurnosXEspe(idXT,espeXT)
          console.log("sumo audit afuera")
          //hayUno = false;
        }
        if (!hayUno) {
          listo = true;
          console.log("creo audit", data.especialidad)
          this.audit.createTurnosXEspe({especialidad:data.especialidad,cantTurnos:1})
        }
        });
       

    return this.db.collection(`turnos/${data.paciente}/turnos`).doc(id).set(data);
  }
  //Trae 1
  public getTurno(documentId: string) {
    return this.db.collection('turnos').doc(documentId).snapshotChanges();
  }
  //Actualiza 1 VER COMO MODIFICAR UN SOLO VALOR
  public updateTurno(documentId: string, data: {id: string, fecha: string, hora: string, paciente: string, especialidad: string, atendido: boolean, estado: string, profesional:string}) {
    return this.db.collection(`turnos/${data.paciente}/turnos`).doc(documentId).set(data);
  }
  /***************************************************************************** */
  /**************************************TURNOS X PROFESIONAL ******************************** */
  //Trae Todos
  public getTurnosXProf(profesional: string) {
    //console.log("entre a servicio", this.firestore.collection('mercados').snapshotChanges())
    return this.db.collection<turno>(`turnosXProf/${profesional}/turnos`).snapshotChanges()
              .pipe( delay(2000) );
  }
  //Alta
  public createTurnoXProf(id:string, data: {id: string, fecha: string, hora:string, especialidad: string, paciente: string, profesional: string, atendido:boolean, estado:string, hclinica:string}) {
    return this.db.collection(`turnosXProf/${data.profesional}/turnos`).doc(id).set(data);
  }
  //Trae 1
  public getTurnoXProf(documentId: string) {
    return this.db.collection('turnosXProf').doc(documentId).snapshotChanges();
  }
   //Actualiza 1 VER COMO MODIFICAR UN SOLO VALOR
   public updateTurnoXProf(documentId: string, data: {id: string, fecha: string, hora: string, paciente: string, especialidad: string, atendido: boolean, estado: string, profesional:string}) {
    return this.db.collection(`turnosXProf/${data.profesional}/turnos`).doc(documentId).set(data);
  }
  /***************************************************************************** */
  /***********************************HClinica************************************ */
  //Actualiza 1 VER COMO MODIFICAR UN SOLO VALOR
  public agregaHCliniciaXProf(documentId: string, data: any) {
    return this.db.collection(`turnosXProf/${data.profesional}/turnos`).doc(documentId).set(data);
  }
  //Actualiza 1 VER COMO MODIFICAR UN SOLO VALOR
  public agregaHClinicia(documentId: string, data: any) {
    return this.db.collection(`turnos/${data.paciente}/turnos`).doc(documentId).set(data);
  }
  //Actualiza 1 VER COMO MODIFICAR UN SOLO VALOR
  public agrega(documentId: string, data: any) {
    return this.db.collection(`turnos/${data.paciente}/turnos`).doc(documentId).set(data);
  }
}
