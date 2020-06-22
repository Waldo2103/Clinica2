import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { logProf } from '../clases/log-prof';
import { turnosXEspe } from '../clases/turnos-xespe';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(
    private db: AngularFirestore
  ) { }

  /***************************LOGUEO DE PROFESIONALES*********************/
  public getLogProf() {
    return this.db.collection<logProf>('logProf').snapshotChanges()
  }
  //Alta
  public createLogProf(data: {usuario: string, fecha: string, hora: string}) {
    return this.db.collection('logProf').add(data);
  }
/***************************LOGUEO DE PROFESIONALES*********************/
public getTurnosXEspe() {
  return this.db.collection<turnosXEspe>('turnosXEspe').snapshotChanges()
}
//Alta
public createTurnosXEspe(data: {especialidad: string, cantTurnos: number}) {
  return this.db.collection('turnosXEspe').add(data);
}
}
