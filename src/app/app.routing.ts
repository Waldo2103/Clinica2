import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './componentes/home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './componentes/registro/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './componentes/login/login.component';
import { NologinGuard } from './guards/nologin.guard';
import { AuthGuard } from './guards/auth.guard';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SacarTurnoComponent } from './componentes/paciente/sacar-turno/sacar-turno.component';
import { RegistroProfComponent } from './componentes/profesional/registro-prof/registro-prof.component';
import { NoHabComponent } from './componentes/no-hab/no-hab.component';
import { HomePrComponent } from './componentes/profesional/home-pr/home-pr.component';
import { HomePacComponent } from './componentes/paciente/home-pac/home-pac.component';
import { TurnosComponent } from './componentes/profesional/turnos/turnos.component';
import { AtencionComponent } from './componentes/profesional/atencion/atencion.component';
import { ListaTurnosComponent } from './componentes/paciente/lista-turnos/lista-turnos.component';
import { ReseniasComponent } from './componentes/paciente/resenias/resenias.component';
//import { ProfGuard } from './guards/prof.guard';

const routes: Routes =[
    { path: 'home',             component: HomeComponent, canActivate:[AuthGuard] },
    { path: 'paciente/sacarTurno',component: SacarTurnoComponent, canActivate:[AuthGuard] },
    { path: 'paciente/home',component: HomePacComponent, canActivate:[AuthGuard] },
    { path: 'paciente/listaTurnos',component: ListaTurnosComponent, canActivate:[AuthGuard] },
    { path: 'paciente/resenias',component: ReseniasComponent, canActivate:[AuthGuard] },
    { path: 'noHab',component: NoHabComponent },
    { path: 'perfil',     component: ProfileComponent },
    { path: 'registro',           component: SignupComponent },
    { path: 'profesional/registro', component: RegistroProfComponent },
    { path: 'profesional/home', component: HomePrComponent },
    { path: 'profesional/atencion', component: AtencionComponent },
    { path: 'profesional/turnos', component: TurnosComponent, canActivate:[AuthGuard] },
    { path: 'navbar',          component: NavbarComponent, canActivate:[AuthGuard] },
    { path: 'login', component: LoginComponent,canActivate:[NologinGuard] ,data: {animation: 'LoginPage'}},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: '**',redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
