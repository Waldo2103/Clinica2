import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../servicios/firebase.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Profesional } from 'src/app/clases/profesional';
import { turno } from 'src/app/clases/turno';
import { AuditService } from 'src/app/servicios/audit.service';
import { finished } from 'stream';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sacar-turno',
  templateUrl: './sacar-turno.component.html',
  styleUrls: ['./sacar-turno.component.css']
})
export class SacarTurnoComponent implements OnInit {

  focus1;
  colas = [];
  public espeSeleccionada = "0";
  public profSeleccionada = "0";
  public diaSeleccionada = "0";

  public espeSelec = "";
  public profSelec = "";
  public diaSelec = "";

  public user;

  //para traer especialidades
  especialidadesT

  //para traer espe x usu
  profesionalesT

  //Form
  form: FormGroup;

  //CALENDARIO creo variables para todos los dias, asi poder deshabilitar si el prof no trabaja  toda la semana
  lu = 0;
  ma = 0;
  mi = 0;
  ju = 0;
  vi = 0;
  sa = 0;
  mostrarCalen = false;
  mostrarCalend(){
    if (this.mostrarCalen) {
      this.mostrarCalen = false;
    } else {
      this.mostrarCalen = true
    }
  }

  public d;
  
  isDisabled = (date: NgbDate, current: {month: number}) =>  {
    this.d = new Date(date.year, date.month - 1, date.day);
    return this.d.getDay() === 0 || this.d.getDay() === this.lu || this.d.getDay() === this.ma 
    || this.d.getDay() === this.mi || this.d.getDay() === this.ju || this.d.getDay() === this.vi 
    || this.d.getDay() === this.sa ;

  }
  date: Date = new Date(); 
  dia;
  mes;
  anio;
  today;
  maxDate;
  model1;

  
  //para traer HORARIOS
    

  constructor(private afAuth: AngularFireAuth, private firebase: FirebaseService, private formBuilder: FormBuilder,
              private audit: AuditService, private router: Router
    ) { 
    this.form = this.formBuilder.group({
      //id: new FormControl('', Validators.required),
      especialidad: new FormControl('', Validators.required),
      profesional: new FormControl('', Validators.required),
      /*fecha: new FormControl('', Validators.required),
      hora: new FormControl('', Validators.required),
      paciente: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required)*/
    });
  }

  ngOnInit(): void {
    this.traerUser();
    this.traerProfesionales();
    this.traerEspecialidades();
    this.user = "paciente";
    this.getToday();
  }

  async traerEspecialidades(){
    await this.firebase.getEspecialidades().subscribe((productsSnapshot) => {
      this.especialidadesT = [];
      productsSnapshot.forEach((productData: any) => {
        this.especialidadesT.push(
          {
            idEspecialidad: productData.payload.doc.data().idEspecialidad,
            nombre:  productData.payload.doc.data().nombre,
        });
      })
    });
  }

  async traerEspecialidadXUsuario(idEsp){
    await this.firebase.getEspecialidadXUsuario(idEsp).subscribe((profesionalesSnapshot) => {
      this.profesionalesT = [];
      profesionalesSnapshot.forEach((data: any) => {
        this.profesionalesT.push(
          {
            dni: data.payload.doc.data().dni,
            nombre:  data.payload.doc.data().nombre,
            apellido:  data.payload.doc.data().apellido
        });
      })
    });
  }
  
  capturarEspe(){
    this.espeSelec = this.espeSeleccionada;
    this.traerEspecialidadXUsuario(this.espeSelec);
    this.horariosDisp('0');
  }
  
  capturarProf(){
    this.mostrarCalen = false;
    this.profSelec = this.profSeleccionada;
    this.horariosDisp('0');
  }
  fecha
  capturarDia(e){
    //console.log(e)
    //recibo la fecha y la guardo en un formato asignable a date
    this.fecha = `${e.year}-${e.month}-${e.day}`;
    
    var Xmas95 = new Date(this.fecha);
    //saco el dia de la semana
    var weekday = Xmas95.getDay();
    this.diaSeleccionada = weekday.toString();
    //console.log(weekday, "weekday"); // 1
    this.diaS = weekday;
    this.horariosDisp(weekday);
  }
 
  /***********************CALENDARIO****************************************/
  getToday(){
    this.dia = this.date.getDate();
    this.mes = this.date.getMonth() + 1;
    this.anio = this.date.getFullYear();
    this.today = {year: this.anio, month: this.mes, day: this.dia};
    this.maxDate ={year: this.anio, month: this.mes, day: this.dia + 13}
    //console.log(this.today);
  }
  displayMonths = 2;
  navigation = 'none';
  showWeekNumbers = false;
  outsideDays = 'visible';

  /************************HORARIOS Y DISPONIBILIDAD*****************************************/
  
  profesT;
  //Traemos todos para conseguir dni del solicitado
  traerProfesionales(){
    this.firebase.getProfesionales().subscribe(resul =>{
      this.profesT = [];
      resul.forEach((data: any) => {
        
        this.profesT.push(
          {
            dni: data.payload.doc.data().dni,
            nombre:  data.payload.doc.data().nombre,
            apellido: data.payload.doc.data().apellido,
            especialidades: data.payload.doc.data().especialidades,
            habilitado: data.payload.doc.data().habilitado,
            horarios: data.payload.doc.data().horarios,
            correo: data.payload.doc.data().correo
        });
        //console.log("traer profesionales completos",this.profesT);
      })
    });
  }
  //PROPIEDADES NECESARIAS
  turnosM=[];
  turnosT=[];
  i=30;
  //horarios
  lu8;ma8;mi8;ju8;vi8;sa8;
  lu13;ma13;mi13;ju13;vi13;
  
  //horario de los turnos
  tManiana
  tTarde
  //profesional que se asignara al turno(correo)
  profe
  //asigno los dias disponibles
  horariosDisp(weekday){
    //recorro todos los prof y lo matcheo con el que se selecciono en el combo
    for(let prof of this.profesT){
      //si son iguales extraigo datos
      if (prof.dni == this.profSeleccionada) {
        this.profe = prof.correo;
        this.traerTurnos();
        //console.log("this", JSON.parse(prof.horarios))
        let objHorarios = JSON.parse(prof.horarios);
        if (objHorarios.luok) {
          this.lu = 0;
          if (weekday == 1) {
            this.lu8 = objHorarios.lu8;
          this.lu13 = objHorarios.lu13;
          } else {
            this.lu8 = null;
          this.lu13 = null;
          }
          
        }else{
          this.lu = 1;
        }
        if (objHorarios.maok) {
          this.ma = 0;
          if (weekday == 2) {
          this.ma8 = objHorarios.ma8;
          this.ma13 = objHorarios.ma13;
          } else {
            this.ma8 = null;
          this.ma13 = null;
          }
        }else{
          this.ma = 2;
        }
        if (objHorarios.miok) {
          this.mi = 0;
          if (weekday == 3) {
          this.mi8 = objHorarios.mi8;
          this.mi13 = objHorarios.mi13;
          } else {
            this.mi8 = null;
          this.mi13 = null;
          }
        }else{
          this.mi = 3;
        }
        if (objHorarios.juok) {
          this.ju = 0;
          if (weekday == 4) {
          this.ju8 = objHorarios.ju8;
          this.ju13 = objHorarios.ju13;
          } else {
            this.ju8 = null;
          this.ju13 = null;
          }
        }else{
          this.ju = 4;
        }
        if (objHorarios.viok) {
          this.vi = 0;
          if (weekday == 5) {
          this.vi8 = objHorarios.vi8;
          this.vi13 = objHorarios.vi13;
          } else {
            this.vi8 = null;
          this.vi13 = null;
          }
        }else{
          this.vi = 5;
        }
        if (objHorarios.saok) {
          this.sa = 0;
          if (weekday == 6) {
          this.sa8 = objHorarios.sa8;
          } else {
            this.sa8 = null;
          }
        }else{
          this.sa = 6;
        }
        
        //SEPARO TURNO MAÑANA Y TARDE Y LO FRAGMENTO SEGUN SU DURACION

        let objEspecialidades = JSON.parse(prof.especialidades);
        for(let espe of objEspecialidades){
          if (espe.idEspecialidad === this.espeSeleccionada) {
            let duracion = espe.duracion;
            //console.log("duracion", duracion)
            this.i;
            
            if (duracion == 30) {
              this.i = 11;
              this.tManiana = ["8:00", "8:30","9:00", "9:30", "10:00", "10:30","11:00",
              "11:30","12:00","12:30","13:00","13:30"];
              this.tManiana = this.turnosLibres(this.tManiana);

              
              this.tTarde = ["13:30","14:00","14:30","15:00","15:30",
              "16:00","16:30","17:00","17:30","18:00","18:30","19:00"];
              this.tTarde = this.turnosLibres(this.tTarde)
            } if (duracion == 45) {
              this.i = 7;
              this.tManiana = ["8:00", "8:45","9:30", "10:15", "11:00",
              "11:45","12:30","13:15"];
              this.tManiana = this.turnosLibres(this.tManiana);
              
              this.tTarde = ["13:30","14:15","15:00","15:45",
              "16:30","17:15","18:00","18:45"];
              this.tTarde = this.turnosLibres(this.tTarde)
            } if (duracion == 60) {
              this.i = 5;
              this.tManiana = ["8:00", "9:00", "10:00","11:00","12:00","13:00"];
              this.tManiana = this.turnosLibres(this.tManiana);

              this.tTarde = ["13:30","14:30","15:30",
              "16:30","17:30","18:30"];
              this.tTarde = this.turnosLibres(this.tTarde)
            } if (duracion == 75) {
              this.i = 4;
              this.tManiana = ["8:00", "9:15","10:30","11:45","13:00"];
              this.tManiana = this.turnosLibres(this.tManiana);

              this.tTarde = ["13:30","14:45","16:00","17:15","18:30"];
              this.tTarde = this.turnosLibres(this.tTarde)
            }

            for (let j = 0; j < this.i; j++) {
              this.turnosM[j] = this.tManiana[j];
              this.turnosT[j] = this.tTarde[j];
            }
            //console.log(this.turnosM, this.turnosT)

          }//fin if
        }//fin for
      }
    }
  }
  turnoOK:turno = new turno;
  mostrarTurno = false;
  tomarRadio(e){
    this.traerEspe();
    this.mostrarTurno = true;
    //console.log("e",e.target.id)
    this.turnoOK.id = `${this.usuario}-${this.profe}-${this.fecha}`; 
    this.turnoOK.fecha = this.fecha;
    this.turnoOK.hora = e.target.id
    this.turnoOK.especialidad = this.especialidadU;
    this.turnoOK.paciente = this.usuario;
    this.turnoOK.profesional = this.profe;
    this.turnoOK.atendido = false;
    this.turnoOK.estado = 'pendiente'; // pendiente - confirmado - cancelado - rechazado
    this.turnoOK.hclinica = "";
    //console.log(this.turnoOK)
  }

  //TRAIGO PACIENTE
  usuario
  traerUser(){
    this.usuario = this.afAuth.auth.currentUser.email.valueOf();
  }
  //TRAIGO ESPECIALIDAD DE COMBO(NOMBRE)
  especialidadU;
  traerEspe(){
    for(let espe of this.especialidadesT){
      if(espe.idEspecialidad == this.espeSeleccionada){
        this.especialidadU = espe.nombre;
      }
    }

  }
  //TRAIGO TODOS LOS TURNOS
  turnosTodos = [];
  traerTurnos(){
    this.firebase.getTurnosXProf(this.profe).subscribe(resul => {
      resul.forEach(data =>{
        this.turnosTodos.push(
          {
            id: data.payload.doc.data().id,
            fecha: data.payload.doc.data().fecha,
            hora: data.payload.doc.data().hora
          }
        );
      });
    });
  }

  //ESTO NO SE SI LO VOY A HACER --->VALIDO QUE DIA Y HORARIO TURNO NO ESTEN OCUPADOS PARA ESE PROF trayendo todos los turnos y verificando que no exista
  //ELIMINO LOS TURNOS YA OTORGADOS
  turnosLibres(tMoT: turno[]){
    //lo comparo con el turno actual
    for(let turno of this.turnosTodos){
      for (let i = 0; i <= tMoT.length; i++) {
        if (turno.hora === tMoT[i] && turno.fecha === this.fecha) {
          tMoT.splice(i, 1);
        }
      }
    }
    return tMoT;
  }
  //TURNOS X DIA VARIABLES
  espeXD = {dia:"",cantTurnos: 0}
  idXD;
  hayUno: boolean = false;
  listo: boolean = false;
  diaS;
  //CANT TURNOS X PROF VARIABLES
  turXP = {profesional:"",cantTurnos: 0}
  idTXP;
  hayUnoTXP: boolean = false;
  listoTXP: boolean = false;
  
  //profe X DIA VARIABLES
  diaXP = {dia:"",cantProfe: 0, profesionales: []}
  idDXP;
  hayUnoDXP: boolean = false;
  listoDXP: boolean = false;
  arrayProf: Array<any>;
  existeEnArray: boolean = false;
  sacarTurno(){
    console.log(this.turnoOK)
    let turnoFire = {id: this.turnoOK.id, fecha: this.turnoOK.fecha, hora:this.turnoOK.hora,
       especialidad: this.turnoOK.especialidad, paciente: this.turnoOK.paciente, profesional: this.turnoOK.profesional,
        atendido:this.turnoOK.atendido, estado:this.turnoOK.estado, hclinica:this.turnoOK.hclinica}
    this.firebase.createTurnoXProf(turnoFire.id,turnoFire).then(resul=>{
      alert("Turno Creado!");
      this.firebase.createTurno(turnoFire.id,turnoFire).then(resul2=>{
        console.log("turno creado en ambas tablas")
        //auditamos turnos x dia
        //1- traemos los datos
        
        this.audit.getTurnosXDia().subscribe(resul=>{
          //let audit
          //recorremos las especialidades con sus turnos
          
          resul.forEach(data =>{
            //si la espe del nuevo turno coincide le sumo 1
            if (data.payload.doc.data().dia == this.diaS) {
              this.hayUno = true;
              this.idXD = data.payload.doc.id;
              this.espeXD = {
                dia: data.payload.doc.data().dia,
                cantTurnos: (data.payload.doc.data().cantTurnos + 1)
              }
              
            }
          });
          if(this.hayUno&& !this.listo) {
            this.listo = true;
            this.audit.addTurnosXDia(this.idXD,this.espeXD)
            console.log("sumo audit afuera")
            //hayUno = false;
          }
          if (!this.hayUno) {
            this.listo = true;
            console.log("creo audit", this.diaS)
            this.audit.createTurnosXDia({dia:this.diaS,cantTurnos:1})
          }
          
        });// FIN auditamos turnos x dia
        //auditamos turnos x prof
        //1- traemos los datos
        
        this.audit.getTurnosXProfe().subscribe(resul=>{
          //let audit
          //recorremos las especialidades con sus turnos
          
          resul.forEach(data =>{
            //si la espe del nuevo turno coincide le sumo 1
            if (data.payload.doc.data().profesional == this.profe) {
              this.hayUnoTXP = true;
              this.idTXP = data.payload.doc.id;
              this.turXP = {
                profesional: data.payload.doc.data().profesional,
                cantTurnos: (data.payload.doc.data().cantTurnos + 1)
              }
              
            }
          });
          if(this.hayUnoTXP && !this.listoTXP) {
            this.listoTXP = true;
            this.audit.addTurnosXProfe(this.idTXP,this.turXP)
            console.log("sumo audit afuera turxp")
            //hayUno = false;
          }
          if (!this.hayUnoTXP) {
            this.listoTXP = true;
            console.log("creo audit turxp", this.profe)
            this.audit.createTurnosXProfe({profesional:this.profe,cantTurnos:1})
          }
          
        });// FIN auditamos turnos x prof
        //auditamos dias x prof
        //1- traemos los datos
        
        this.audit.getDiasXProfe().subscribe(resul=>{
          //let audit
          //recorremos las especialidades con sus turnos
          
          resul.forEach(data =>{
            //si la espe del nuevo turno coincide le sumo 1
            if (data.payload.doc.data().dia == this.diaS) {
              if (data.payload.doc.data().profesionales !==  []) {
                for(let prof of data.payload.doc.data().profesionales){
                  if (prof === this.profe) {
                    this.existeEnArray = true;
                    
                  }
                }
              }
              this.arrayProf = data.payload.doc.data().profesionales;
              if (!this.existeEnArray) {
                this.arrayProf.push(this.profe);
              }
                    
                    this.hayUnoDXP = true;
                    this.idDXP = data.payload.doc.id;
                    this.diaXP = {
                      dia: data.payload.doc.data().dia,
                      cantProfe: (data.payload.doc.data().cantProfe + 1),
                      profesionales: this.arrayProf
                    }
              
              
            }
          });
          if(this.hayUnoDXP && !this.listoDXP) {
            if (this.arrayProf == []) {
              this.arrayProf = [this.profe];
            }
            this.listoDXP = true;
            this.audit.addDiasXProfe(this.idDXP,this.diaXP)
            console.log("sumo audit afuera turxp", this.diaXP)
            //hayUno = false;
          }
          if (!this.hayUnoDXP && !this.listoDXP) {
            this.listoDXP = true;
              this.arrayProf = [this.profe];
            console.log("creo audit diaxp", this.arrayProf)
            this.audit.createDiasXProfe({dia:this.diaS,cantProfe:1, profesionales:this.arrayProf})
          }
          
        });// FIN auditamos dias x prof

        this.router.navigate['/paciente/listaTurnos']
      }).catch(error=>{
        console.log(error)
      })
      //mandar a listado
    }).catch(error=>{
      console.log("TURNOS POR PROF",error)
    })
        
  }

}
