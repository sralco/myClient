import { ProdottoInTempFiche } from './ProdottoInTempFiche';

export class TempFiche {
  id: string;
  idCliente: string;
  nominativo: string;
  ingresso: string;
  totaleFiche: string;
  guardaRoba: string;
  testoServizi: string;
  testoProdotti: string;
  classe: string;
  cell: string;
  email: string;
  numeroFiche: string;
  servizi: ProdottoInTempFiche[];
  prodotti: ProdottoInTempFiche[];

  constructor() {
    this.id = '';
    this.idCliente = '';
    this.nominativo = '';
    this.ingresso = '';
    this.totaleFiche = '';
    this.guardaRoba = '';
    this.testoServizi = '';
    this.testoProdotti = '';
    this.classe = '';
    this.cell = '';
    this.email = '';
    this.numeroFiche='';

  }
}
