import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,FormControl, Validators} from '@angular/forms';
//import { Encuesta } from '../../clases/Encuesta';
import { Router } from '@angular/router';
import { EncuestaService } from '../../servicios/encuesta.service';
//import { ClienteInterface } from '../app/clases/Cliente';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {
  selectedMesa = 4;
  selectedResto = 4;
  selectedMozo = 4;
  selectedCoci = 4;
  public form: FormGroup;
  error:boolean;
  errorMessage:string;
  encuesta={};
  clienteData={};

  constructor(private fb: FormBuilder,
    private encuestaService: EncuestaService,
    private router:Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      comentario: ['', Validators.required]
    });
  }

  Submit()
  {


     this.errorMessage = '';
     this.error = false;


     if (this.form.valid) {

      this.getDatosPedido();
/*
      this.encuesta.puntuacionMesa=this.selectedMesa;
      this.encuesta.puntuacionRestaurante=this.selectedResto;
      this.encuesta.puntuacionMozo=this.selectedMozo;
      this.encuesta.puntuacionCocinero=this.selectedCoci;
      this.encuesta.comentario=this.form.get('comentario').value;
      this.encuesta.codigoMesa=this.clienteData.mesa;
      this.encuesta.idMozo=this.clienteData.mozo;
      this.encuesta.idCliente=this.clienteData.cliente;
*/
       this.encuestaService.Registrar(this.encuesta)
         .then(
           res => {                               
               //guardo el elmpeado
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

   getDatosPedido()
   {
    const data = localStorage.getItem('encuestaCli');

    this.clienteData=JSON.parse(data);  

   }

   Cancel(){
    this.router.navigate(["/Bienvenida"]);
   }
}