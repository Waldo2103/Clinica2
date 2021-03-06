import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { ExporterService } from 'src/app/servicios/exporter.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-lista-turnos',
  templateUrl: './lista-turnos.component.html',
  styleUrls: ['./lista-turnos.component.css']
})
export class ListaTurnosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'profesional', 'especialidad', 'fecha','hora', 'atendido', 'estado', 'rechazar'];
  dataSource: MatTableDataSource <Element[]>;//(ELEMENT_DATA);

  constructor(private exporter: ExporterService,
              private firebase: FirebaseService,
              private afAuth: AngularFireAuth
    ) { }
  user;
  ngOnInit(): void {
    this.user = "paciente";
    this.traerUser();
    this.traerTurnos();
  }

  profe
  traerUser(){
    this.profe = this.afAuth.auth.currentUser.email.valueOf();
  }

  turnosTodos = [];
  traerTurnos(){
    //console.log("entre");
    this.firebase.getTurnos(this.profe).subscribe(resul => {
      resul.forEach(data =>{
        //console.log(data.payload.doc.data());
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
  
  rechazar(e){
    if(e.estado !== "cancelado"){
      e.estado = "cancelado";
      this.firebase.updateTurno(e.id, e).then(resul =>{
        console.log("OK")
        this.firebase.updateTurnoXProf(e.id, e).then(resul=>{
          console.log("OK2");
        }).catch(error =>{console.log(error)});
      }).catch(error=>{console.log(error)});
     // this.actualizarTurno(e);
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
    console.log(this.dataSource.data)
    this.exporter.exportToExcel(this.dataSource.data, 'turnos');
  }

  exportarAsXlsxFilter():void{
    this.exporter.exportToExcel(this.dataSource.filteredData, 'turnos_filtrados');
  }

}
