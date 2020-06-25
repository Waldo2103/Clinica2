import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
//import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';
import { AuditService } from '../../../../servicios/audit.service';
import { ExporterService } from '../../../../servicios/exporter.service';
import * as FileSaver from 'file-saver';
import * as jsPDF from 'jspdf'; 

import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.component.html',
  styleUrls: ['./logueo.component.css']
})
export class LogueoComponent implements OnInit {
  @ViewChild('canvas') canvas:ElementRef;
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{
      ticks: {
        beginAtZero: true
      }}] },
    plugins: {
      datalabels: {
        anchor: '10',
        align: '10',
      }
    }
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012']; //EJE X
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  //variables para datos de la bd
  turXEspe = [];
  espes = []
  tur = []

  public barChartData: ChartDataSets[] = [ //EJE Y
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  exportAsConfig: ExportAsConfig = {
    type: 'png', // the type you want to download
    elementIdOrContent: 'canvas', // the id of html/table element
  }

  constructor(
    private audit: AuditService,
    private exporter: ExporterService,
    private exportAsService: ExportAsService
  ) { }

  ngOnInit() {
    this.graf2();
    this.logUser();
  }
  logProf = []
  logUser(){
    this.logProf = []
    this.audit.getLogProf().subscribe(resul =>{
      resul.forEach( data =>{
        this.logProf.push(
          {
            profesional: data.payload.doc.data().usuario,
            fecha: data.payload.doc.data().fecha,
            hora: data.payload.doc.data().hora,
          }
        );
      }      
      )
    });
  }

  graf2(){
    this.name = "TurnosXEspe";
    this.turXEspe = [];
    this.tur =[];
    this.espes = [];
    this.audit.getTurnosXEspe().subscribe(resul=>{
      resul.forEach(data=>{
        this.turXEspe.push(
          {
            especialidad: data.payload.doc.data().especialidad,
            cantTurnos: data.payload.doc.data().cantTurnos,
          }
        );
        this.espes.push(data.payload.doc.data().especialidad);
        this.tur.push(data.payload.doc.data().cantTurnos );
      });
    });
    this.barChartLabels = this.espes;
    this.barChartData = [{data: this.tur, label:"Cantidad de Turnos"}];
  }
  turXDia = [];
  dia = []
  graf3(){
    this.name = "TurnosXDia";
    this.turXDia = [];
    this.tur =[];
    this.dia = [];
    this.audit.getTurnosXDia().subscribe(resul=>{
      resul.forEach(data=>{
        this.turXDia.push( 
          {
            dia: data.payload.doc.data().dia,
            cantTurnos: data.payload.doc.data().cantTurnos,
          }
        );
        this.dia.push(this.parsearDia( data.payload.doc.data().dia));
        this.tur.push(data.payload.doc.data().cantTurnos);
      });
    });
    console.log(this.dia, this.tur)
    this.barChartLabels = this.dia;//["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]//
    this.barChartData = [{data: this.tur, label:"Cantidad de Turnos"}];
  }
  turXProf = []
  prof = []
  graf4(){
    this.name = "TurnosXProfe";
    this.turXProf = [];
    this.tur =[];
    this.prof = [];
    this.audit.getTurnosXProfe().subscribe(resul=>{
      resul.forEach(data=>{
        this.turXProf.push( 
          {
            profesional: data.payload.doc.data().profesional,
            cantTurnos: data.payload.doc.data().cantTurnos,
          }
        );
        this.prof.push(data.payload.doc.data().profesional);
        this.tur.push(data.payload.doc.data().cantTurnos);
      });
    });
    this.barChartLabels = this.prof;
    this.barChartData = [{data: this.tur, label:"Cantidad de Turnos"}];
  }
  profXDia = [];
  cantProf = []
  graf5(){
    this.name = "DiasXProfe";
    this.profXDia = [];
    this.dia =[];
    this.cantProf = [];
    this.audit.getDiasXProfe().subscribe(resul=>{
      resul.forEach(data=>{
        this.profXDia.push(
          {
            dia: data.payload.doc.data().dia,
            cantProfe: data.payload.doc.data().cantProfe,
          }
        );
        this.dia.push(this.parsearDia( data.payload.doc.data().dia));
        this.cantProf.push(data.payload.doc.data().cantProfe);
      });
    });
    console.log(this.dia)
    this.barChartLabels = this.dia;//["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]//this.dia;
    this.barChartData = [{data: this.cantProf, label:"Cantidad de Profesionales"}];
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  /********************************************************************************************************* */
  name; //el nombre del archivo y le asigno un valor en cada funcion graf
  image(){
    this.exportAsService.save(this.exportAsConfig, this.name).subscribe(() => {
      // save started
    });
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    this.exportAsService.get(this.exportAsConfig).subscribe(content => {
      console.log(content);
    });
    /*var canvas = <HTMLCanvasElement> document.getElementById("canvas");

    canvas.toBlob(function(blob) {
    FileSaver.saveAs(blob, `${this.name}.png`);
    });*/
   
  }
  pdf(){
    let content=this.canvas.nativeElement;  
    var dataURL = document.getElementsByTagName('canvas')[0].toDataURL()//(<HTMLCanvasElement> document.getElementById("canvas")).toDataURL();
    let doc = new jsPDF();  
    //var dataURL = canvas.toDataURL();
    doc.addImage(dataURL, 'JPEG', 0, 0);
  doc.save(this.name+".pdf");

  }
  
  exportarUser(){
    this.name = "LogueProfesionales";
    this.excel()
  }

  excel(){
    let tabla //= new MatTableDataSource(this.) turXEspe-turXDia-turXProf-profXDia
    switch (this.name) {
      
      case 'LogueProfesionales':
        //this.logUser()
        console.log("entre");
        tabla = new MatTableDataSource(this.logProf)
        break;

      case 'TurnosXEspe':
         tabla = new MatTableDataSource(this.turXEspe)
        break;
      case 'TurnosXDia':
        tabla = new MatTableDataSource(this.turXDia)
        break;
      case 'TurnosXProfe':
        tabla = new MatTableDataSource(this.turXProf)
        break;
      case 'DiasXProfe':
      tabla = new MatTableDataSource(this.profXDia)
        break;
    }
    this.exporter.exportToExcel(tabla.data, this.name);
  }
 

  /******************************************************************************************************* */


  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
  }
  public parsearDia(diaN:string){
    let dias = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    diaN = dias[(parseInt(diaN)-1)];
    return diaN;
  }
  public lineChartColors: Color[] = [
    /*{ // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },*/
    { 
      backgroundColor:["#FF7360", "#6FC8CE", "#FAFFF2", "#FFFCC4", "#B9E8E0"] 
    }
  ];
}
