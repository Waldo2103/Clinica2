import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../servicios/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { Profesional } from '../../../clases/profesional';
import { FirebaseService } from '../../../servicios/firebase.service';
import { especialidad } from '../../../clases/especialidad';

import { ReCaptcha2Component } from 'ngx-captcha';

@Component({
  selector: 'app-registro-prof',
  templateUrl: './registro-prof.component.html',
  styleUrls: ['./registro-prof.component.css']
})
export class RegistroProfComponent implements OnInit {

  test : Date = new Date();
    focus1;
    focus2;
    focus3;
    focus4;
    focus5;
    focus6;
    form: FormGroup;

    usuario = new Profesional();
    especialidades: any = [];
    horariosObj: any = {
      luok: false,
        lu8: false,
        lu13: false,
      maok: false,
        ma8: false,
        ma13: false,
      miok: false,
        mi8: false,
        mi13: false,
      juok: false,
        ju8: false,
        ju13: false,
      viok: false,
        vi8: false,
        vi13: false,
      saok: false,
        sa8: false
    };
    //PARA SUBIR FOTO
    public mensajeArchivo = 'No hay un archivo seleccionado';
    public datosFormulario = new FormData();
    public nombreArchivo = '';
    public URLPublica = '';
    public URLs = [];
    public porcentaje = 0;
    public finalizado = false;
    //public foto1 = new FormData();
    //public foto2 = new FormData();
    public array = [];

  validation_messages = {
    'mail': [
      { type: 'required', message: 'Debe ingresar un email.' },
      { type: 'email', message: 'Debe ingresar un email válido.' }
    ],
    'password': [
      { type: 'required', message: 'Debe ingresar una contraseña.' }
    ],
    'password2': [
      {type:'required', message:'Lo ingresado debe coincidir con la contraseña anterior.'}
    ]
  };

 mail:string;
 password:string;
 password2:string;
  modalText: string;

  //Para captcha
  @ViewChild('captchaElem',{static:true}) captcha: ReCaptcha2Component;
  @ViewChild('inputEmail',{static:true}) inputEmail: ReCaptcha2Component;
  @ViewChild('inputPassword',{static:true}) inputPasword: ReCaptcha2Component;
  key:string;

  constructor(
    private authService: AuthService,
    private firebase: FirebaseService,
    private router: Router, 
    private formBuilder: FormBuilder,
    private fb: FormBuilder
    ) { 
      this.key = '6Ld8pqUZAAAAAJJ-Z89Y3jyK1wDmukJMK7gEg5ec';

      this.form = this.formBuilder.group({
        mail: new FormControl('', Validators.compose([
          Validators.required,
          Validators.email
        ])),
        password: new FormControl('', Validators.required),
        password2: new FormControl('', Validators.required),
        nombre: new FormControl('', Validators.required),
        apellido: new FormControl('', Validators.required),
        dni: new FormControl('', Validators.required),
        //foto: new FormControl('', Validators.required),
        especialidades: new FormControl(),
        horarios: new FormControl()//['', Validators.required]
      });
      /*this.especialidadesForm = this.fb.group({
        checkArray: this.fb.array([])
      });*/

      this.especialidadForm = this.fb.group({
        idEspecialidad: new FormControl('', Validators.required),
        nombre:  new FormControl('', Validators.required),
        recaptcha: new FormControl('', Validators.required)
      });

      this.horariosForm = this.fb.group({
        lunes: new FormControl(),
        martes: new FormControl(),
        miercoles: new FormControl(),
        jueves: new FormControl(),
        viernes: new FormControl(),
        sabado: new FormControl(),
      });

      
    }

ngOnInit() {
    this.traerEspecialidades();
}
ngOnChange(){
  
}
loguear(user: any){
  //this.resulService.createLog(user);
}
public especialidadesT: Array<especialidad> = [];


public async RegistrarProfesional(){
    //Subo foto para despues pasarle la ruta a la base
    
    this.URLPublica = `{
        foto1: ${this.array[0]},
        foto2: ${this.array[1]}
    }`
    //console.log(this.URLPublica)
    //Controlo los dias checkeados
    this.horariosObj.luok = this.lunesOK
    this.horariosObj.maok = this.martesOK
    this.horariosObj.miok = this.miercolesOK
    this.horariosObj.juok = this.juevesOK
    this.horariosObj.viok = this.viernesOK
    this.horariosObj.saok = this.sabadoOK
    //AGREGO EL CLIENTE A LA BASE
    this.usuario = {
        correo: this.form.get('mail').value,
        nombre: this.form.get('nombre').value,
        apellido: this.form.get('apellido').value,
        dni: this.form.get('dni').value,
        //foto: this.URLPublica,
        especialidades: JSON.stringify( this.especialidades),
        horarios: JSON.stringify(this.horariosObj),
        habilitado: false
        };
    //AGREGO EL USUARIO AL LISTADO DE ESPECIALIDADES X USUARIO
    this.addUserAEspecialidad();
    this.authService.RegistrarProfesionalDatos(this.usuario).then(auth => {
        console.log("dvolvio servicio a REGISTRAR Profesional")
        this.usuario = new Profesional();
        alert( '¡Usted ha sido registrado!');
    }).catch(err => {
        alert('Error en el registro.');
        console.log(err);
    });
}
//AGREGA UN USUARIO A LA LISTA DE ESPECIALIDADES QUE SELECCIONO
addUserAEspecialidad(){
  //this.especialidadesT
  //this.especialidades
  //console.log(this.especialidades)
  let data = {
    dni:this.form.get('dni').value,
    nombre: this.form.get('nombre').value,
    apellido: this.form.get('apellido').value
  }
  for(let esp of this.especialidades){
    this.firebase.addProfAEspecialidadXUsu(esp.idEspecialidad,data).then(resul =>{

    }); 
  }
}

//PARA SUBIR FOTO
  //Evento que se gatilla cuando el input de tipo archivo cambia
  public cambioArchivo(event) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        (<HTMLButtonElement>document.getElementById("subirOK")).disabled = false;
        this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
        this.nombreArchivo = event.target.files[i].name;
        this.datosFormulario.delete('foto');
        this.datosFormulario.append('foto', event.target.files[i], event.target.files[i].name)
      }
    } else {
      (<HTMLButtonElement>document.getElementById("subirOK")).disabled = true;
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }
  //Sube el archivo a Cloud Storage
  
  public subirArchivo() {
    this.URLPublica = ''
    let archivo = this.datosFormulario.get('foto');
    let referencia = this.authService.referenciaCloudStorage(this.nombreArchivo);
    let tarea = this.authService.tareaCloudStorage(this.nombreArchivo, archivo);
    //Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {
      this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;
      }
    });
    referencia.getDownloadURL().subscribe((URL) => {
      this.URLPublica = URL;
      console.log(this.URLPublica);
      while (this.URLPublica === '') {
        (<HTMLButtonElement>document.getElementById("subirOK")).disabled = true;
      }
      this.array.push(this.URLPublica);
      (<HTMLButtonElement>document.getElementById("subirOK")).disabled = false;
    });
    
  }

OnSubmitRegister(){
    //console.log("entre a onsubmitregister")
  if (this.form.get('password').value === this.form.get('password2').value) {
    this.authService.registeruser(this.form.get('mail').value, this.form.get('password').value).then( authService => {
      let f = new Date;
        var fec: string = f.getDate()+"/"+f.getMonth()+"/"+f.getUTCFullYear()+" - "+f.getUTCHours()+":"+f.getUTCMinutes()+":"+f.getUTCSeconds();
        let data = { email: this.form.get('mail').value,fec}
        this.loguear(data);
        localStorage.setItem("email", this.form.get('mail').value);
        //AGREGO EL CLIENTE A LA BASE
        this.RegistrarProfesional()
      this.router.navigate(['/login']);
    }).catch(error => {
      //(<HTMLButtonElement>document.getElementById('btnModal')).click();
      if (error.code === 'auth/email-already-in-use') {
        this.modalText = "El usuario ya existe!";
        console.log(this.modalText)
        //this.toastService.error('Usuario no encontrado.');
      } else if (error.code === 'auth/wrong-password') {
        this.modalText = "Contraseña incorrecta.";
        console.log(this.modalText)
        //this.toastService.error('Contraseña incorrecta.');
      } else {
        console.log(error.code,". ERROR CODE")
        this.modalText = "Ocurrió un error con el servidor";
        console.log(this.modalText)
      }
    }/*err=> alert('los datos son incorrectos', err.code)*/);
  } else {
    this.modalText = "Las contraseñas no coinciden.";
    console.log(this.modalText)
    //(<HTMLButtonElement>document.getElementById('btnModal')).click();
  }
  
}
/*********************************************************************************************
 * *******************************************************************************************
 */
//Manejo de especialidades

//especialidadesForm: FormGroup;
especialidadForm: FormGroup;
ok: boolean[] = [] ;
existe:boolean;
check(e){
  let id = e.target.id;
  for(let es of this.especialidades){
    //si alguna coincide con la que se "checkeo" le paso el valor de checked
    if (id === es.idEspecialidad) {
      for(let esp of this.especialidadesT){
        if (esp.idEspecialidad === id) {
          es.ok =  e.target.checked;
          //this.existe = true;
        }
      }
    }
  }
if (e.target.checked) {
  this.ok[e.target.id] = true;
  
  
}else{
  this.ok[e.target.id] = false;
}
}
onCheckboxChange(e) {
  let idYdura = e.target.id.split(",") ;
  let id = idYdura[0];
  let duracion = idYdura[1];

  if (this.especialidades !== []) {
    console.log("entre porque NO esta []")
    //recorro especialidades ya agregadas al usuario
  for(let es of this.especialidades){
    //si alguna coincide con la que se "checkeo" le paso el valor de checked
    if (id === es.idEspecialidad) {
      for(let esp of this.especialidadesT){
        if (esp.idEspecialidad === id) {
          //es.ok =  e.target.checked;
          this.existe = true;
        }
      }
    }
  }
  }
  
  //sino existia ya lo agrego
    if (!this.existe) {
      this.especialidades.push({
        idEspecialidad: id,
        nombre: e.target.value,
        ok:  e.target.checked,
        duracion: duracion
      });
    }
    console.log(this.especialidades,e.target, "especialidades que se agregaran al porf")
  }
  /*if (e.target.checked) {
     this.especialidadesT.push(
        {
          idEspecialidad: productData.payload.doc.data().idEspecialidad,
          nombre:  productData.payload.doc.data().nombre,
      });
    checkArray.push(new FormControl(e.target.value));
  } else {
    let i: number = 0;
    checkArray.controls.forEach((item: FormControl) => {
      if (item.value == e.target.value) {
        checkArray.removeAt(i);
        return;
      }
      i++;
    });
  }
}*/
/*submitForm() {
  let array = [];
  array = this.especialidadesForm.value
  array = array['checkArray'];
  console.log(this.especialidadesForm.value);
  this.especialidades = `{`;
  let i = 0;
  for(let espe of array){
    
    if (i === array.length) {
      this.especialidades = this.especialidades + i + ':' + espe + '}'
    }
    this.especialidades = this.especialidades + i + ':' + espe + ','

    i = i+1
  }
  
  console.log(this.especialidades)
}*/

async traerEspecialidades(){
  await this.firebase.getEspecialidades().subscribe((productsSnapshot) => {
    this.especialidadesT = [];
    productsSnapshot.forEach((productData: any) => {
      this.especialidadesT.push(
        {
          idEspecialidad: productData.payload.doc.data().idEspecialidad,
          nombre:  productData.payload.doc.data().nombre,
      });
      //console.log(this.listado[0].open = true);
    })
  });
}
especialidadA = new especialidad();
altaEspecialidades(){
 
  //AGREGO EL CLIENTE A LA BASE
  this.especialidadA = {
    idEspecialidad: this.especialidadForm.get('idEspecialidad').value,
    nombre:  this.especialidadForm.get('nombre').value,
    };
    this.firebase.createEspecialidad(this.especialidadA.idEspecialidad, this.especialidadA).then(auth => {
    alert( '¡Especialidad cargado!');
}).catch(err => {
    alert('Error en alta de especialidad.');
    console.log(err);
});
}
/*******************************************************************************************************
 * ****************************************************************************************************
 * MANEJO DE HORARIOS
 */
lunes: boolean = false;
martes: boolean = false;
miercoles: boolean = false;
jueves: boolean = false;
viernes: boolean = false;
sabado: boolean = false;

horariosForm: FormGroup;

cargaHorarios(){
  console.log()
}

lunesOK: boolean;
martesOK: boolean;
miercolesOK: boolean;
juevesOK: boolean;
viernesOK: boolean;
sabadoOK: boolean;

checkValue(event: any){
  //console.log(this.lunesOK,event.target.checked , event.target.id);
  let id = event.target.id
  this.horariosObj[id] =  event.target.checked;

  console.log(this.horariosObj)
  
}

}
