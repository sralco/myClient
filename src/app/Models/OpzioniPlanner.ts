export class OpzioniPlanner {
  lun: boolean;
  mar: boolean;
  mer: boolean;
  gio: boolean;
  ven: boolean;
  sab: boolean;
  dom: boolean;

  lunInizio: String
  lunFine: String
  marInizio: String
  marFine: String
  merInizio: String
  merFine: String
  gioInizio: String
  gioFine: String
  venInizio: String
  venFine: String
  sabInizio: String
  sabFine: String
  domInizio: String
  domFine: String

  lunPausaInizio: String;
  lunPausaFine: String;
  marPausaInizio: String;
  marPausaFine: String;
  merPausaInizio: String;
  merPausaFine: String;
  gioPausaInizio: String;
  gioPausaFine: String;
  venPausaInizio: String;
  venPausaFine: String;
  sabPausaInizio: String;
  sabPausaFine: String;
  domPausaInizio: String;
  domPausaFine: String;


  oraInizio: string;
  oraFine: string;
  festivi: string[];

  titolo: string;
  testo: string;
  intervallo: number;
  imgSfondo: string;
  logo: string;
  nascondiPrezzi: string;
  nascondiTempi: string;

  gruppo: string;
  salone: string;
  indirizzo: string;
  telefono: string;
  colore:string;
  coloresfondo:string;
}
