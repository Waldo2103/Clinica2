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
import { ReseniasPrComponent } from './componentes/profesional/resenias-pr/resenias-pr.component';
import { RegistroAdmComponent } from './componentes/admin/registro-adm/registro-adm.component';
import { HomeAdmComponent } from './componentes/admin/home-adm/home-adm.component';
import { HabilitaComponent } from './componentes/admin/habilita/habilita.component';
import { LogueoComponent } from './componentes/admin/estadisticas/logueo/logueo.component';
//import { ProfGuard } from './guards/prof.guard';

const routes: Routes =[
    { path: 'home',             component: HomeComponent, canActivate:[AuthGuard], data: { animation: 'PrincipalPage'} },
    { path: 'admin/registro',component: RegistroAdmComponent, canActivate:[AuthGuard] },
    { path: 'admin/home',component: HomeAdmComponent, canActivate:[AuthGuard] },
    { path: 'admin/habilita',component: HabilitaComponent, canActivate:[AuthGuard] },
    { path: 'admin/estadisticas/logueo',component: LogueoComponent, canActivate:[AuthGuard] },
    { path: 'paciente/registro',           component: SignupComponent },
    { path: 'paciente/sacarTurno',component: SacarTurnoComponent,data: {animation: 'One'} },
    { path: 'paciente/home',component: HomePacComponent, canActivate:[AuthGuard] },
    { path: 'paciente/listaTurnos',component: ListaTurnosComponent,data: {animation: 'Two'} },
    { path: 'paciente/resenias',component: ReseniasComponent, canActivate:[AuthGuard],data: {animation: 'Three'} },
    { path: 'noHab',component: NoHabComponent },
    { path: 'perfil',     component: ProfileComponent },
    
    { path: 'profesional/registro', component: RegistroProfComponent },
    { path: 'profesional/home', component: HomePrComponent },
    { path: 'profesional/atencion', component: AtencionComponent,data: {animation: 'Two'} },
    { path: 'profesional/turnos', component: TurnosComponent, canActivate:[AuthGuard],data: {animation: 'One'} },
    { path: 'profesional/resenias', component: ReseniasPrComponent, canActivate:[AuthGuard],data: {animation: 'Three'} },
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
