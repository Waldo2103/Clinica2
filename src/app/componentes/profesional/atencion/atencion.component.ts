import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { ExporterService } from 'src/app/servicios/exporter.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { EncuestaService } from '../../../servicios/encuesta.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.css']
})
export class AtencionComponent implements OnInit {

  displayedColumns: string[] = ['id', 'paciente', 'especialidad', 'fecha','hora', 'atender'];
  dataSource: MatTableDataSource <Element[]>;//(ELEMENT_DATA);
  atendiendo= false;
  //form
  hClinicaForm: FormGroup;
  focus1=true;focus2;focus3;focus4;focus5;focus6;focus7;focus8;

  //ENCUESTA
  selectedPaciente = 4;
  public form: FormGroup;
  error:boolean;
  errorMessage:string;
  encuesta={
    id: "",
    profesional: "",
    paciente: "",
    puntuacion: 0,
    comentario: ""
  };
  clienteData={};

  constructor(private exporter: ExporterService,
              private firebase: FirebaseService,
              private afAuth: AngularFireAuth,
              private fb: FormBuilder,
              private router: Router,
              private encuestaService: EncuestaService,
    ) {
      this.hClinicaForm = fb.group({
        id: [{value: '', disabled:true}],
        edad: new FormControl(''),
        temperatura: new FormControl(''),
        presion: new FormControl(''),
        addC: new FormControl(''),
        dina1: new FormControl(''),
        dina2: new FormControl(''),
        dina3: new FormControl('')
      });
     }
  user;
  ngOnInit(): void {
    this.user = "profesional";
    //this.traerUser();
    this.traerTurnos();

    //ENCUESTA
    this.form = this.fb.group({
      comentario: ['', Validators.required]
    });
  }
  encuestar = false;
  encuestado = false;
  mostrarEncuesta(){
    this.encuestar = true;
  }

  profe
  traerUser(){
    
    this.profe = this.afAuth.auth.currentUser.email.valueOf();
    //console.log(this.profe)
    
  }

  turnosTodos = [];
  traerTurnos(){
    
    this.firebase.getTurnosXProf(/*this.profe*/'prof@a.com').subscribe(resul => {
      //console.log(this.profe)
      resul.forEach(data =>{
        //console.log(data.payload.doc.data() )
        if(data.payload.doc.data().atendido === false && data.payload.doc.data().estado === 'confirmado'){
          
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
        }
        
      });
      this.dataSource = new MatTableDataSource(this.turnosTodos);
    });
  }
  turno;
  atender(e){
    this.turno = e;
    this.atendiendo = true;
    console.log(this.turno);
    
  }
din1 = ''; din2 = '';din3 = '';//dina1 = ''; dina2 = '';dina3 = '';
addC: string;

disab(){
  (<HTMLInputElement>document.getElementById('add')).removeAttribute("disabled");
}

  addCampo(){
    //console.log("aaaa")
    if (this.din1 === '') {
      this.din1 = this.hClinicaForm.get('addC').value;
    } else if (this.din2 === '') {
      this.din2 = this.hClinicaForm.get('addC').value;
    } else if (this.din3 === '') {
      this.din3 = this.hClinicaForm.get('addC').value;
    }
  }
  

  hclinica;
  altaHClinica(){
    if (this.din3 !== '') {
      this.hclinica = {
        id: this.turno.id,
        hora: this.turno.hora,
        fecha: this.turno.fecha,
        especialidad: this.turno.especialidad,
        atendido: true,
        estado: this.turno.estado,
        paciente: this.turno.paciente,
        profesional: this.turno.profesional,
        hclinica: `edad: ${this.hClinicaForm.get('edad').value},
            temperatura: ${this.hClinicaForm.get('temperatura').value},
            presion: ${this.hClinicaForm.get('presion').value},
            ${this.din1}:${this.hClinicaForm.get('dina1').value},
            ${this.din2}:${this.hClinicaForm.get('dina2').value},
            ${this.din3}:${this.hClinicaForm.get('dina3').value}`
      }
    } else if (this.din2 !== '') {
      this.hclinica = {
        id: this.turno.id,
        hora: this.turno.hora,
        fecha: this.turno.fecha,
        especialidad: this.turno.especialidad,
        atendido: true,
        estado: this.turno.estado,
        paciente: this.turno.paciente,
        profesional: this.turno.profesional,
        hclinica: `edad: ${this.hClinicaForm.get('edad').value},
            temperatura: ${this.hClinicaForm.get('temperatura').value},
            presion: ${this.hClinicaForm.get('presion').value},
            ${this.din1}:${this.hClinicaForm.get('dina1').value},
            ${this.din2}:${this.hClinicaForm.get('dina2').value}`
      }
    } else if (this.din1 !== '') {
      //agrear cambio de estado atendido a true
      this.hclinica = {
        id: this.turno.id,
        hora: this.turno.hora,
        fecha: this.turno.fecha,
        especialidad: this.turno.especialidad,
        atendido: true,
        estado: this.turno.estado, 
        paciente: this.turno.paciente,
        profesional: this.turno.profesional,
        hclinica: `edad: ${this.hClinicaForm.get('edad').value},
            temperatura: ${this.hClinicaForm.get('temperatura').value},
            presion: ${this.hClinicaForm.get('presion').value},
            ${this.din1}:${this.hClinicaForm.get('dina1').value}`
      }
    }else{
      this.hclinica = {
        id: this.turno.id,
        hora: this.turno.hora,
        fecha: this.turno.fecha,
        especialidad: this.turno.especialidad,
        atendido: true,
        estado: this.turno.estado,
        paciente: this.turno.paciente,
        profesional: this.turno.profesional,
        hclinica: `edad: ${this.hClinicaForm.get('edad').value},
            temperatura: ${this.hClinicaForm.get('temperatura').value},
            presion: ${this.hClinicaForm.get('presion').value}`
      }
    }
    
    console.log(this.hclinica);
    this.firebase.agregaHClinicia(this.turno.id,this.hclinica).then(resul =>{
      console.log("OK");
      this.firebase.agregaHCliniciaXProf(this.turno.id,this.hclinica).then(resul =>{
        console.log("OK");
        this.router.navigate(['/profesional/atencion']);
      }).catch()
    }).catch(error=>{console.log(error)})
  }

  actualizarTurno(turno: any){
    
    for(let t of this.turnosTodos){
      if (t.id === turno.id) {
        t.estado = turno.estado;
      }
    }
  }
  //ENCUESTA
  Submit()
  {


     this.errorMessage = '';
     this.error = false;


     if (this.form.valid) {

      //this.getDatosPedido();

      this.encuesta.puntuacion = this.selectedPaciente;
      this.encuesta.comentario=this.form.get('comentario').value;
      this.encuesta.id = this.turno.id;
      this.encuesta.paciente = this.turno.paciente;
      this.encuesta.profesional = this.turno.profesional;


       this.encuestaService.Registrar(this.encuesta)
         .then(
           res => {                               
               //guardo el elmpeado
               this.altaHClinica()
               this.router.navigate(["/home"]);
 
           }
         )
         .catch(error => {
             this.error = true;
             //this.errorMessage = res['Mensaje'];
             if (error) {
               //this.toastService.error('Usuario no encontrado.');
             this.errorMessage='Error al Registrar encuesta.' + error;
             } 
           }
         );
     } else {
       this.errorMessage = 'Debe completar los campos correctamente.';
       this.error = true;
     }

  }



   Cancel(){
    this.router.navigate(["/profesional/atencion"]);
   }
}
