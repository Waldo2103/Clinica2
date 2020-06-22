import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { ExporterService } from 'src/app/servicios/exporter.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-habilita',
  templateUrl: './habilita.component.html',
  styleUrls: ['./habilita.component.css']
})
export class HabilitaComponent implements OnInit {

  displayedColumns: string[] = ['dni', 'apellido', 'nombre', 'correo','especialidades', 'horarios', 'habilitar'];
  dataSource: MatTableDataSource <Element[]>;//(ELEMENT_DATA);

  constructor(private exporter: ExporterService,
              private firebase: FirebaseService,
              private afAuth: AngularFireAuth
    ) { }
  user;
  ngOnInit(): void {
    this.user = "profesional";
    this.traerUser();
    this.traerProfesionales();
  }

  profe
  traerUser(){
    this.profe = this.afAuth.auth.currentUser.email.valueOf();
  }

  profesT = [];
  traerProfesionales(){
    this.firebase.getProfesionales().subscribe(resul =>{
      this.profesT = [];
      resul.forEach((data: any) => {
        
        
        if (!data.payload.doc.data().habilitado) {
          this.profesT.push(
            {
              id: data.payload.doc.id,
              dni: data.payload.doc.data().dni,
              nombre:  data.payload.doc.data().nombre,
              apellido: data.payload.doc.data().apellido,
              especialidades: data.payload.doc.data().especialidades,//resul,
              habilitado: data.payload.doc.data().habilitado,
              horarios: data.payload.doc.data().horarios,//resul2,
              correo: data.payload.doc.data().correo
          });
        }
      })
      this.dataSource = new MatTableDataSource(this.profesT);
    });
      
  }

  aceptar(e){
    console.log(e)
    if(e.habilitado == false){
      e.habilitado = true;
      this.firebase.updateProfesional(e.id, e).then(resul =>{
        console.log("OK")
      }).catch(error=>{console.log(error)});
      //this.actualizarTurno(e);
    }else{
      console.log(`El profesional está habilitado`)
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
    }else{
      console.log(`El turno ya está ${e.estado}`)
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
