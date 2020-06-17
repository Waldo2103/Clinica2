import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../servicios/firebase.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth/auth.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Profesional } from 'src/app/clases/profesional';
import { delay } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
    

  constructor(private firebase: FirebaseService, private formBuilder: FormBuilder, private auth: AuthService) { 
    this.form = this.formBuilder.group({
      especialidad: new FormControl('', Validators.required),
      profesional: new FormControl('', Validators.required),
      dia: new FormControl('', Validators.required),
      horario: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
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

  capturarDia(e){
    //console.log(e)
    //recibo la fecha y la guardo en un formato asignable a date
    let fecha = `${e.year}-${e.month}-${e.day}`;
    
    var Xmas95 = new Date(fecha);
    //saco el dia de la semana
    var weekday = Xmas95.getDay();
    this.diaSeleccionada = weekday.toString();
    //console.log(weekday, "weekday"); // 1
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
  tMañana
  tTarde
  //asigno los dias disponibles
  horariosDisp(weekday){
    console.log(weekday, "weekday"); 
    //recorro todos los prof y lo matcheo con el que se selecciono en el combo
    for(let prof of this.profesT){
      //si son iguales extraigo datos
      if (prof.dni == this.profSeleccionada) {
        console.log("this", JSON.parse(prof.horarios))
        let objHorarios = JSON.parse(prof.horarios);
        if (objHorarios.luok) {
          this.lu = 0;
          if (weekday == 1) {
            this.lu8 = objHorarios.lu8;
          this.lu13 = objHorarios.lu13;
          }
          
        }else{
          this.lu = 1;
        }
        if (objHorarios.maok) {
          this.ma = 0;
          if (weekday == 2) {
          this.ma8 = objHorarios.ma8;
          this.ma13 = objHorarios.ma13;
          }
        }else{
          this.ma = 2;
        }
        if (objHorarios.miok) {
          this.mi = 0;
          if (weekday == 3) {
          this.mi8 = objHorarios.mi8;
          this.mi13 = objHorarios.mi13;
          }
        }else{
          this.mi = 3;
        }
        if (objHorarios.juok) {
          this.ju = 0;
          if (weekday == 4) {
          this.ju8 = objHorarios.ju8;
          this.ju13 = objHorarios.ju13;
          }
        }else{
          this.ju = 4;
        }
        if (objHorarios.viok) {
          this.vi = 0;
          if (weekday == 5) {
          this.vi8 = objHorarios.vi8;
          this.vi13 = objHorarios.vi13;
          }
        }else{
          this.vi = 5;
        }
        if (objHorarios.saok) {
          this.sa = 0;
          if (weekday == 1) {
          this.sa8 = objHorarios.sa8;
          }
        }else{
          this.sa = 6;
        }
        
        //SEPARO TURNO MAÑANA Y TARDE Y LO FRAGMENTO SEGUN SU DURACION

        let objEspecialidades = JSON.parse(prof.especialidades);
        for(let espe of objEspecialidades){
          if (espe.idEspecialidad === this.espeSeleccionada) {
            let duracion = espe.duracion;
            console.log("duracion", duracion)
            this.i;
            
            if (duracion == 30) {
              this.i = 11;
              this.tMañana = ["8:00", "8:30","9:00", "9:30", "10:00", "10:30","11:00",
              "11:30","12:00","12:30","13:00","13:30"];
              this.tTarde = ["13:30","14:00","14:30","15:00","15:30",
              "16:00","16:30","17:00","17:30","18:00","18:30","19:00"];
            } if (duracion == 45) {
              this.i = 7;
              this.tMañana = ["8:00", "8:45","9:30", "10:15", "11:00",
              "11:45","12:30","13:15"];
              this.tTarde = ["13:30","14:15","15:00","15:45",
              "16:30","17:15","18:00","18:45"];
            } if (duracion == 60) {
              this.i = 5;
              this.tMañana = ["8:00", "9:00", "10:00","11:00","12:00","13:00"];
              this.tTarde = ["13:30","14:30","15:30",
              "16:30","17:30","18:30"];
            } if (duracion == 75) {
              this.i = 4;
              this.tMañana = ["8:00", "9:15","10:30","11:45","13:00"];
              this.tTarde = ["13:30","14:45","16:00","17:15","18:30"];
            }

            for (let j = 0; j < this.i; j++) {
              this.turnosM[j] = this.tMañana[j];
              this.turnosT[j] = this.tTarde[j];
            }
            console.log(this.turnosM, this.turnosT)

          }//fin if
        }//fin for
      }
    }
  }
  tomarRadio(e){
    console.log("e",e.target.id)
  }


}
