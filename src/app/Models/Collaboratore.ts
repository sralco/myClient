import { OpzioniDelGiorno } from "./OpzioniDelGiorno";
import { OpzioniPlanner } from "./OpzioniPlanner";

export class Collaboratore {
  id: string;
  idServer:string;
  nome: string;
  cognome: string;
  codice: string;
  coloreAppuntamenti: string;
  presenteInAppuntamenti: boolean;
  presenteInFiche: boolean;
  produzione: number;
  incentivi: number;
  ordine:number;
  tipo:string;
  planner:string;
  appuntamento:boolean;
  gruppo:string;
  salone:string;
  obiettivo:string;
  idServizio:string;
  foto:string;
  opzioniPlanner:OpzioniPlanner;
  giorniAbilitati:OpzioniDelGiorno[];
  businessHours:any[];
  
  constructor(){
    this.giorniAbilitati = [];
    this.opzioniPlanner = new OpzioniPlanner();
  }
}
