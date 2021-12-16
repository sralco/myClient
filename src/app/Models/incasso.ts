export class Incasso {
  contanti: number;
  bancomat: number;
  carta: number;
  prepagate: number;
  onLine: number;
  assegni: number;
  altro: number;
  insoluti: number;

  constructor() {
    this.contanti = 0;
    this.bancomat = 0;
    this.carta = 0;
    this.prepagate = 0;
    this.onLine = 0;
    this.assegni = 0;
    this.altro = 0;
    this.insoluti = 0;
  }
}
