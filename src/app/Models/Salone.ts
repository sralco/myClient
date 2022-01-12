import { ChartDataSets } from 'chart.js';
import { Appuntamento } from './Appuntamento';
import { LogEvento } from './LogEvento';
import { OpzioniPlanner } from './OpzioniPlanner';

export class Salone {
  id: string;
  gruppo: string;
  salone: string;
  token: string;
  indirizzoPlanner: string;
  posizionePlanner: string;
  ragioneSociale: string;
  indirizzoSalone: string;
  indirizzo: string;
  idGoogleMap: string;
  cap: string;
  paese: string;
  provincia: string;
  partitaIva: string;
  tel: string;
  cell: string;
  telefono: string;
  email: string;

  dataAttivazione: Date;
  dataRinnovo: Date;
  ultimoAccesso: Date;

  abilitato: boolean;



  indirizzoIP: string;
  porta: string;
  cartella: string;
  template: string;
  posizione: string;
  aperto: string;
  classeAccordion: string;
  attesa: boolean;
  destinazione: string;
  ultimaSincronizzazione: string;
  idArea: string;
  consulente: string;

  produzione1: number;
  produzione2: number;
  incasso1: number;
  incasso2: number;
  passaggi1: number;
  passaggi2: number;
  spese1: number;
  spese2: number;
  media1: number;
  media2: number;
  nuoviClienti1: number;
  nuoviClienti2: number;
  clientiMovimentati1: number;
  clientiMovimentati2: number;

  annoCorrente: number[];
  annoPrecedente: number[];

  logEventi: LogEvento[];

  ChartData: ChartDataSets[] = [
    { data: [], label: 'Corrente' },
    { data: [], label: 'Precedente' },
  ];

  ChartClientiData: ChartDataSets[] = [
    { data: [], label: 'Corrente' },
  ];

  opzioniPlanner: OpzioniPlanner;
  prenotazioniAttive: Appuntamento[];

  inizializza() {
    this.produzione1 = 0;
    this.produzione2 = 0;
    this.incasso1 = 0;
    this.incasso2 = 0;
    this.passaggi1 = 0;
    this.passaggi2 = 0;
    this.spese1 = 0;
    this.spese2 = 0;
    this.media1 = 0;
    this.media2 = 0;
    this.nuoviClienti1 = 0;
    this.nuoviClienti2 = 0;
    this.clientiMovimentati1 = 0;
    this.clientiMovimentati2 = 0;
    this.classeAccordion = 'collapse multi-collapse';
    this.consulente = '';
    this.idArea = '';
    this.opzioniPlanner = new OpzioniPlanner();
    this.prenotazioniAttive=[];
  }
}
