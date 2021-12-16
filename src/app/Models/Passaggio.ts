import { ProdottoInTempFiche } from "./ProdottoInTempFiche";

export class Passaggio {
  id: string;
  idCliente: string;
  cliente: string;
  cell: string;
  data: Date;
  importo: number;
  pagamento: string;
  gruppo: string;
  salone: string;

  prodotti: ProdottoInTempFiche[];
}
