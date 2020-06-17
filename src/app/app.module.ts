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
//import { NgbCalendar, NgbCalendarHebrew, NgbDatepickerI18n, NgbDatepickerI18nHebrew } from '_node_modules/@ng-bootstrap/ng-bootstrap';

//, , , 
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
    CalendarComponent
  ],
  imports: [
    BrowserModule,
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
    BrowserAnimationsModule,
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule

  ],
  providers: [
    AngularFireAuth,
    {provide: NgbCalendar, useClass: NgbCalendarGregorian},
    //{provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nHebrew}
    //NologinGuard,
    //FormBuilder
    //AngularFirestore//
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
