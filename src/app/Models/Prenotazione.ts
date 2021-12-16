import { Cliente } from "./Cliente";
import { Servizio } from "./Servizio";

export class Prenotazione {
  gruppo: String;
  salone: String;
  token: String;
  posizione: String;

  dataInizio: string;
  oraInizio: string;
  cliente: Cliente;
  servizi: Servizio[];

}
