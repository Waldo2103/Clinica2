import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
const EXCEL_TYPE =
'application/vnd.openx  mlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

@Injectable()
export class ExporterService {

  constructor() { }

  exportToExcel(json: any[], excelFileName: string):void{
    const worksheet : XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: {'data': worksheet},
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array' });
    // llamar metodo 
    this.saveAsExcel(excelBuffer, excelFileName);
  }

  private saveAsExcel(buffer: any, fileName: string):void{
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXT)
  }

  //INVENTE ROMAN INVENTE
  exportToExcel2(dataBlob):void{
    //let dataBlob = '...kAAAAFAAIcmtzaGVldHMvc2hlZXQxLnhtbFBLBQYAAAAACQAJAD8CAADdGAAAAAA='; // If have ; You should be split get blob data only
    FileSaver.downloadFile(dataBlob);
  }

  private saveAsExcel2(buffer: any, fileName: string):void{
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXT)
  }

}
