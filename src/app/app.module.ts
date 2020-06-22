import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbCalendar, NgbCalendarHebrew, NgbDatepickerI18n, NgbDatepickerI18nHebrew, NgbCalendarGregorian } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

//import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { SignupComponent } from './componentes/registro/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './componentes/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './componentes/home/home.module';
import { LoginComponent } from './componentes/login/login.component';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire'; 
import { AngularFirestoreModule} from '@angular/fire/firestore'; 
import { AngularFireStorageModule} from '@angular/fire/storage';
import { firebaseConfig } from '../environments/environment';

import {AngularFireAuth}from '@angular/fire/auth';
import {AngularFirestore}from '@angular/fire/firestore';
import { NologinGuard } from './guards/nologin.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { SacarTurnoComponent } from './componentes/paciente/sacar-turno/sacar-turno.component';
import { RegistroProfComponent } from './componentes/profesional/registro-prof/registro-prof.component';
import { NoHabComponent } from './componentes/no-hab/no-hab.component';
import { HomePrComponent } from './componentes/profesional/home-pr/home-pr.component';
import { HomePacComponent } from './componentes/paciente/home-pac/home-pac.component';
import { CalendarComponent } from './extra/calendar/calendar.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TurnosComponent } from './componentes/profesional/turnos/turnos.component';
//import { NgbCalendar, NgbCalendarHebrew, NgbDatepickerI18n, NgbDatepickerI18nHebrew } from '_node_modules/@ng-bootstrap/ng-bootstrap';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2CompleterModule, CompleterService } from '@akveo/ng2-completer';

import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { ExporterService } from './servicios/exporter.service';
import { AtencionComponent } from './componentes/profesional/atencion/atencion.component';
import { ListaTurnosComponent } from './componentes/paciente/lista-turnos/lista-turnos.component';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';
import { ReseniasComponent } from './componentes/paciente/resenias/resenias.component';
import { ReseniasPrComponent } from './componentes/profesional/resenias-pr/resenias-pr.component';
import { RegistroAdmComponent } from './componentes/admin/registro-adm/registro-adm.component';
import { HabilitaComponent } from './componentes/admin/habilita/habilita.component';
import { HomeAdmComponent } from './componentes/admin/home-adm/home-adm.component';
import { EspecialidadesPipe } from './pipes/especialidades.pipe';
import { HorariosPipe } from './pipes/horarios.pipe';
import { HclinicaPipe } from './pipes/hclinica.pipe';
import { LogueoComponent } from './componentes/admin/estadisticas/logueo/logueo.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    SacarTurnoComponent,
    RegistroProfComponent,
    NoHabComponent,
    HomePrComponent,
    HomePacComponent,
    CalendarComponent,
    TurnosComponent,
    AtencionComponent,
    ListaTurnosComponent,
    EncuestaComponent,
    ReseniasComponent,
    ReseniasPrComponent,
    RegistroAdmComponent,
    HabilitaComponent,
    HomeAdmComponent,
    EspecialidadesPipe,
    HorariosPipe,
    HclinicaPipe,
    LogueoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    AngularFireAuthModule,
    //AngularFireAuth,
    //AngularFirestore,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    NgxCaptchaModule,
    Ng2SmartTableModule,
    Ng2CompleterModule,
    ChartsModule
  ],
  providers: [
    AngularFireAuth,
    {provide: NgbCalendar, useClass: NgbCalendarGregorian},
    ExporterService
    //{provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nHebrew}
    //NologinGuard,
    //FormBuilder
    //AngularFirestore//
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
