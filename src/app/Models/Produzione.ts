export class GruppoServizi {
  id: string;
  gruppo: string;
  numero: number;
  totale: number;
  percentualePassaggi: number;
  totale1: number;
  percentualePassaggi1: number;
  tipo: string;
}


export class Produzione {
  parrucco1: number;
  parrucco2: number;
  estetica1: number;
  estetica2: number;
  rivendita1: number;
  rivendita2: number;

  gruppi: GruppoServizi[];

}
