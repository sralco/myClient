import { Collaboratore } from "./Collaboratore";

export class Servizio {
  id: string;
  servizio: string;
  prezzo: string;
  gruppo: string;
  gruppoServizi: string;
  durata: number;
  tempoDiPosa: number;
  coloreAppuntamenti: string;
  principale: boolean;
  idCollaboratore: string;
  nomeCollaboratore: string;
  collaboratoriAbilitati:Collaboratore[];
  ordineLavorazione: number;
  obbligatorio: boolean;

  obiettivo: number;
  richiesto:boolean;

  idStrumento:string;

  note:string;
  smontaggio:number;
}
