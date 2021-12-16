import { SchedaTecnica } from "./SchedaTecnica";

export class Cliente {
  id: string;
  nome: string;
  cognome: string;
  paese: string;
  cap: string;
  provincia: string;
  cell: string;
  email: string;
  password: string;
  professione: string;
  conosciuto: string;
  indirizzo: string;
  compleanno: string;
  dataReg: string;
  anno: string;
  foto: string;
  sesso: string;
  idUltimaFiche: string;
  dataPrimaFiche: string;
  dataUltimaFiche: string;
  importoUltimaFiche: number;
  classe: string;
  giorniFrequenza: string;
  giorniAssenza: string;
  fuoriFrequenza: string;
  dataUltimoContattato: string;
  serviziFuoriFrequenza: string[];
  servizio: string;
  gruppo: string;
  salone: string;
  schedeTecniche: SchedaTecnica[];
  bloccato: boolean;
  prenotazioniMultiple: boolean;
  confermato: boolean;


  constructor() {
    this.id = '';
    this.nome = '';
    this.cognome = '';
    this.foto = '';
    this.cell = '';
    this.indirizzo = '';
    this.paese = '';
    this.compleanno = '';
    this.email = '';
     this.password = '';
   this.sesso = '';
    this.anno = '';
    this.idUltimaFiche = '';
    this.dataPrimaFiche = '';
    this.dataUltimaFiche = '';
    this.importoUltimaFiche = 0;
    this.classe = '';
    this.giorniFrequenza = '';
    this.giorniAssenza = '';
    this.fuoriFrequenza = '';
    this.servizio = '';
    this.serviziFuoriFrequenza = [];
    this.dataUltimoContattato = '';
    this.gruppo = '';
    this.salone = '';
    this.schedeTecniche = [];
    this.bloccato = false;
    this.confermato = false;
  }

  getFotoPredefinita() {
    const base64 = this.foto;
    const imageName =this.id + '.jpg';
    const imageBlob = this.dataURItoBlob(base64);
    return new File([imageBlob], imageName, { type: 'image/jpg' });

  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpg' });
    return blob;
  }

}
