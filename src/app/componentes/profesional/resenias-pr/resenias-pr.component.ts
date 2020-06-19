import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { EncuestaService } from 'src/app/servicios/encuesta.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-resenias-pr',
  templateUrl: './resenias-pr.component.html',
  styleUrls: ['./resenias-pr.component.css']
})
export class ReseniasPrComponent implements OnInit {
  
  user="profesional";
  //ENCUESTA
  selectedProfesional = 4;
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

  constructor(
    private fire: FirebaseService,
    private encuestaService: EncuestaService,
    private fb: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth,
    ) { }

  ngOnInit(): void {
    this.traerUser();
    this.traerResenias();
    this.traerReseniasPA();
    
  }
  profe
  traerUser(){
    this.profe = this.afAuth.auth.currentUser.email.valueOf();
  }

  encuestas = [];
  traerResenias(){
    this.encuestaService.getEncuestas().subscribe(resul =>{
      
      resul.forEach(data=>{
        this.encuestas.push(
          {
            id: data.payload.doc.data().id,
            profesional:data.payload.doc.data().profesional,
            paciente:data.payload.doc.data().paciente,
            puntuacion:data.payload.doc.data().puntuacion,
            comentario:data.payload.doc.data().comentario
          });
        //console.log();
      });
    });
  }

  encuestasPA = [];
  traerReseniasPA(){
    this.encuestaService.getEncuestasPaci().subscribe(resul =>{
      
      resul.forEach(data=>{
        this.encuestasPA.push(
          {
            id: data.payload.doc.data().id,
            paciente:data.payload.doc.data().paciente,
            puntuacion:data.payload.doc.data().puntuacion,
            comentario:data.payload.doc.data().comentario
          });
        //console.log();
      });
    });
  }

}
