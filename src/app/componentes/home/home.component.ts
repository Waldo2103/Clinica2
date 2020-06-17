import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/internal/operators/map';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    model = {
        left: true,
        middle: false,
        right: false
    };

    focus;
    focus1;

    public profesionales: any[] = [];
    pacien = [];
    admin = [];
    autenticado;
    usuario

    constructor(private db: AngularFirestore, private router: Router, public afAuth: AngularFireAuth, private authServ: AuthService) { }

    ngOnInit() {
            
        this.traerAutenticado()
    }
    

    traerAutenticado(){
        this.usuario = this.afAuth.auth.currentUser.email.valueOf();
        this.db.collection('profesionales').snapshotChanges().subscribe((resul) => {
          
            resul.forEach((productData: any) => {
                if (productData.payload.doc.data().correo === this.usuario) {
                    this.autenticado = {
                        correo:productData.payload.doc.data().correo,
                        habilitado:productData.payload.doc.data().habilitado
                    }
                    
                    if (this.autenticado.habilitado === true) {
                        this.router.navigate(['/profesional/home']);
                    }else{
                        this.router.navigate(['/noHab']);
                    }
                }
            });
          });
      
          this.db.collection('pacientes').snapshotChanges().subscribe((resul) => {
            resul.forEach((productData: any) => {
              if (productData.payload.doc.data().correo === this.usuario) {
                this.router.navigate(['/paciente/home']);
            }
            });
          });
      
          this.db.collection('admin').snapshotChanges().subscribe((resul) => {
                
            resul.forEach((productData: any) => {
              if (productData.payload.doc.data().correo === this.usuario) {
                this.router.navigate(['/admin/home']);
            }
            });
          });
    }
}
