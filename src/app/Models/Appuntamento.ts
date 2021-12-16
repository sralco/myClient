export class ExtendProperties {
  idCliente: string;
  servizi: string;
  tempo: string;
  colore: string;
  idServizio: string;
  tempoDiPosa: number;
  gruppo: String;
  salone: String;
  token: String;
  posizione: String;
  nomeCliente: string;
  annullato: boolean;
  esterno: boolean;
  tsr: string;
  richiesto: string;
  errors: string;
}

export class Appuntamento {
  id: string;
  resourceId: string;
  groupId: string;
  start: Date;
  end: Date;
  allDay: boolean;
  isMultipleDay: boolean;
  title: string;
  url: string;
  classNames: string[];
  editable: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: ExtendProperties;
  idServer: string;
  tsr: string;
  richiesto: string;
}
