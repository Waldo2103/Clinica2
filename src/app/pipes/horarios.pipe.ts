import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horarios'
})
export class HorariosPipe implements PipeTransform {

  transform(value: string): string {
    //parseo los horarios
    let hora = JSON.parse(value);
    let resul2 = "";
    //console.log(horas)
      if (hora.luok === true) {
        resul2 += "Lunes; ";
      }
      if (hora.maok === true) {
        resul2 += "Martes; ";
      }
      if (hora.miok === true) {
        resul2 += "Miércoles; ";
      }
      if (hora.juok === true) {
        resul2 += "Jueves; ";
      }
      if (hora.viok === true) {
        resul2 += "Viernes; ";
      }
      if (hora.saok === true) {
        resul2 += "Sábado; ";
      }
    return resul2;
  }

}
