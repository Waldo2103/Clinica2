import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { EncuestaService } from 'src/app/servicios/encuesta.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-resenias',
  templateUrl: './resenias.component.html',
  styleUrls: ['./resenias.component.css']
})
export class ReseniasComponent implements OnInit {
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
    //ENCUESTA
    this.form = this.fb.group({
      comentario: ['', Validators.required]
    });
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
            puntuacion:data.payload.doc.data().puntuacion,
            comentario:data.payload.doc.data().comentario
          });
        console.log(data.payload.doc.data());
      });
    });
  }
  encuestar=false;
  comentar(e){
    //console.log(e)
    this.encuestar = true;
    this.encuesta.id = e.id;
    this.encuesta.paciente = this.profe;
    this.encuesta.profesional = e.profesional;
  }
  //ENCUESTA
  Submit()
  {


     this.errorMessage = '';
     this.error = false;


     if (this.form.valid) {

      //this.getDatosPedido();

      this.encuesta.puntuacion = this.selectedProfesional;
      this.encuesta.comentario=this.form.get('comentario').value;
      console.log(this.encuesta)

       this.encuestaService.RegistrarPaci(this.encuesta)
         .then(
           res => {                               
               //guardo el elmpeado
               //this.altaHClinica()
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
    this.router.navigate(["/paciente/home"]);
   }
}
