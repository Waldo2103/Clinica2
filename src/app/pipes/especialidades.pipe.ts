import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'especialidades'
})
export class EspecialidadesPipe implements PipeTransform {

  transform(value: string): string {
    let obj = JSON.parse(value);
    //parseo como mostrar las especialidades
    let resul = "";
    for(let espe of obj){
      if (espe.ok === true) {
        resul += espe.nombre + "; ";
      }
    }
    return resul;
  }

}
