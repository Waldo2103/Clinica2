import { Paciente } from './paciente';
import { Profesional } from './profesional';
import { especialidad } from './especialidad';

export class turno {
    id: string; 
    fecha: string;
    hora:string;
    especialidad: string;
    paciente: string;
    profesional: string;
    atendido:boolean;
    estado:string;
    observaciones:string; 
    constructor() {
        
    }

}