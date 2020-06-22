import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, ActivatedRoute,  } from '@angular/router';
import {Subscription} from "rxjs";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth/auth.service';
import { AuditService } from 'src/app/servicios/audit.service';
import { logProf } from 'src/app/clases/log-prof';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Profesional } from 'src/app/clases/profesional';
import { error } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    // animation triggers go he
  ]
})
export class LoginComponent implements OnInit {
  focus;
  focus1;
  form: FormGroup;
  enLogin: boolean = true;
  //rolesEnum = Roles;

  userbtn: string = "";
  passbtn: string = "";

  completarUser(user : number){
    if (user == 1) {
      this.userbtn = "cvega@cvega.com";
      this.passbtn = "cvega1";
      //this.form.valid = true
      //this.form.get('mail').value ="";
    } else if (user == 2) {
      this.userbtn = "admin@admin.com";
      this.passbtn = "admin1";
    }
  }

  validation_messages = {
    'mail': [
      { type: 'required', message: 'Debe ingresar un email.' },
      { type: 'email', message: 'Debe ingresar un email válido.' },
      //{ type: 'exist', message: 'Usuario no encontrado.' }
    ],
    'password': [
      { type: 'required', message: 'Debe ingresar una contraseña.' },
      //{ type: 'valid', message: 'Clave incorrecta.' }
    ]
  };
  modalText: any;


  constructor(private authService: AuthService,
    private fire: FirebaseService,
    private router: Router, 
    private formBuilder: FormBuilder,
    private audit: AuditService
    ) {
    
      this.form = this.formBuilder.group({
        mail: new FormControl('', Validators.compose([
          Validators.required,
          Validators.email
        ])),
        password: new FormControl('', Validators.required)
      });

  }

  ngOnInit() {
  }

  ocultarNavBar(){
  }

  loguear(user){
    this.fire.getProfesionales().subscribe(resul =>{
      resul.forEach(data=>{
        console.log(data.payload.doc.data().correo,"dsas",user.usuario)
        if (data.payload.doc.data().correo === user.usuario) {
          this.audit.createLogProf(user).then(resul =>{
            console.log(resul)
          }).catch(error => console.log(error));
        }
      });
    });
    
   
  }
  
  onSubmitLogin() {

    this.userbtn = this.form.get('mail').value
    this.passbtn = this.form.get('password').value

    this.authService.login(this.userbtn, this.passbtn)
      .then(res => {
        let f = new Date;
        var fec: string = f.getDate()+"/"+f.getMonth()+"/"+f.getUTCFullYear();
        var hor: string = f.getUTCHours()+":"+f.getUTCMinutes()+":"+f.getUTCSeconds();
        let data = {usuario :"", fecha : "", hora : ""};
        data.usuario = this.userbtn;
        data.fecha = fec;
        data.hora = hor;
        this.loguear(data);
        //localStorage.setItem("email", this.userbtn);
        this.router.navigate(['/home']);
      })
      .catch(error => {
        //(<HTMLButtonElement>document.getElementById('btnModal')).click();
        if (error.code === 'auth/user-not-found') {
          console.log(error.code)
          //this.toastService.error('Usuario no encontrado.');
        } else if (error.code === 'auth/wrong-password') {
           console.log(error.code)
          //this.modalText = "Contraseña incorrecta.";
          //this.toastService.error('Contraseña incorrecta.');
        } else {
          console.log(error.code)
          //this.modalText = "Ocurrió un error con el servidor";
        }
      });
  }

}
