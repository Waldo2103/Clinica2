import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hclinica'
})
export class HclinicaPipe implements PipeTransform {

  transform(value: string): string {
    console.log(value);
    let resul = "";
    if (value !== undefined) {     
      let obj = JSON.parse(value);
      for (let i = 0; i < obj.length; i++) {
        //resul += 
        
      }
    resul = obj;//`Edad: ${obj.edad}; Temperatura: ${obj.temperatura}; Presión:${obj.presion}`;
    }else{
      resul = "N/A";
    }
    

    return resul;
  }

}
