import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { ExporterService } from 'src/app/servicios/exporter.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';



/**
 * @title Table with filtering
 */

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'paciente', 'especialidad', 'fecha','hora', 'atendido', 'estado', 'aceptar', 'rechazar'];
  dataSource: MatTableDataSource <Element[]>;//(ELEMENT_DATA);

  constructor(private exporter: ExporterService,
              private firebase: FirebaseService,
              private afAuth: AngularFireAuth
    ) { }
  user;
  ngOnInit(): void {
    this.user = "profesional";
    this.traerUser();
    this.traerTurnos();
  }

  profe
  traerUser(){
    this.profe = this.afAuth.auth.currentUser.email.valueOf();
  }

  turnosTodos = [];
  traerTurnos(){
    this.firebase.getTurnosXProf(this.profe).subscribe(resul => {
      resul.forEach(data =>{
        this.turnosTodos.push(
          {
            id: data.payload.doc.data().id,
            fecha: data.payload.doc.data().fecha,
            hora: data.payload.doc.data().hora,
            paciente: data.payload.doc.data().paciente,
            especialidad: data.payload.doc.data().especialidad,
            atendido: data.payload.doc.data().atendido,
            estado: data.payload.doc.data().estado,
            profesional: data.payload.doc.data().profesional
          }
        );
      });
      this.dataSource = new MatTableDataSource(this.turnosTodos);
    });
  }

  aceptar(e){
    if(e.estado == "pendiente"){
      e.estado = "confirmado";
      this.firebase.updateTurno(e.id, e).then(resul =>{
        console.log("OK")
        this.firebase.updateTurnoXProf(e.id, e).then(resul=>{
          console.log("OK2");
        }).catch(error =>{console.log(error)});
      }).catch(error=>{console.log(error)});
      //this.actualizarTurno(e);
    }else{
      console.log(`El turno está ${e.estado}`)
    }
    
  }
  
  rechazar(e){
    if(e.estado !== "rechazado"){
      e.estado = "rechazado";
      this.firebase.updateTurno(e.id, e).then(resul =>{
        console.log("OK")
        this.firebase.updateTurnoXProf(e.id, e).then(resul=>{
          console.log("OK2");
        }).catch(error =>{console.log(error)});
      }).catch(error=>{console.log(error)});
      //this.actualizarTurno(e);
    }else{
      console.log(`El turno ya está ${e.estado}`)
    }
    
  }

  actualizarTurno(turno: any){
    
    for(let t of this.turnosTodos){
      if (t.id === turno.id) {
        t.estado = turno.estado;
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportarAsXlsx():void{
    this.exporter.exportToExcel(this.dataSource.data, 'turnos');
  }

  exportarAsXlsxFilter():void{
    this.exporter.exportToExcel(this.dataSource.filteredData, 'turnos_filtrados');
  }

}
