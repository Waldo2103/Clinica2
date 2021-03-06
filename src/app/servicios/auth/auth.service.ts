import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Paciente, PacienteAConfirmar } from "../../clases/paciente";
import { AngularFireStorage } from '@angular/fire/storage';
import { Profesional, ProfesionalAConfirmar } from '../../clases/profesional';

import {map}from "rxjs/operators";
import {isNullOrUndefined} from "util";
import { Router } from '@angular/router';
import { Admin, AdminAConfirmar } from '../../clases/admin';

//import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /*profesionales = [];
  pacien = [];
  admin = [];*/
  //autenticado;

  constructor(public afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router
    ) {

  }
  /***************************USER LOGUEADO PARA NAVBAR******************************** */
  logueado():boolean{
    
    //BUSCAMOS USER LOGUEADO
    let usuario = this.afAuth.auth.currentUser.email.valueOf()
    if (usuario !== "") {
      return true
    }
     return true
    
  }
  /**************************************************************************************** */
/********************************TODO RELACIONADO A REGISTRO DE USUARIO*********************************************** */
  registeruser(email: string, pass: string){
    return new Promise((resolve,reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email,pass)
      .then( userData => resolve(userData),
      err => reject (err));
    })
  }
//PACIENTE
  RegistrarClienteDatos(usuario: Paciente) {//, clave: string) {
    const d: PacienteAConfirmar = usuario as PacienteAConfirmar;
    //d.clave = clave;
    console.log("entre al servicio maaaann")
    return this.db.collection('pacientes').add({
      apellido: d.apellido,
      dni: d.dni,
      //clave: d.clave,
      correo: d.correo,
      foto: d.foto,
      nombre: d.nombre
    });
  }
  //PROFESIONAL
  RegistrarProfesionalDatos(usuario: Profesional) {//, clave: string) {
    const d: ProfesionalAConfirmar = usuario as ProfesionalAConfirmar;
    //d.clave = clave;
    console.log("entre al servicio profesional")
    return this.db.collection('profesionales').add({
      //foto: d.foto,
      correo: d.correo,
      apellido: d.apellido,
      nombre: d.nombre,
      dni: d.dni,
      //foto: d.foto,
      especialidades: d.especialidades,
      horarios: d.horarios,
      habilitado: false
    });
  }

  //ADMIN
  RegistrarAdminDatos(usuario: Admin) {//, clave: string) {
    const e: AdminAConfirmar = usuario as AdminAConfirmar;
    //d.clave = clave;
    return this.db.collection('admin').add({
      //foto: d.foto,
      correo: e.correo,
      perfil: 'admin',
      //foto: d.foto,
    });
  }

   //Tarea para subir archivo
   public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }
  /******************************************************************************* */

  login(email: string, pass: string){
    return new Promise((resolve,reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email,pass)
      .then( userData => resolve(userData),
      err => reject (err));
    })
  }

  logout() {
    return this.afAuth.auth.signOut();
  }


  //Obtiene los datos del usuario en caso de que esté logueado. 
  getAuth(){
    return this.afAuth.authState.pipe( auth => auth );
  }

  updateProfile(newName:string, photoURL: string){    
    return this.afAuth.auth.currentUser.updateProfile({
      displayName: newName,
      photoURL: photoURL
    });
  }





}
