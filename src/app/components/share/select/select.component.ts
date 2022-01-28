import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpzioniPlanner } from 'src/app/Models/OpzioniPlanner';

export class CoppiaValori {
  value: string;
  label: string;
  foto:string;
}
export class DatiEsterni {
  title: string;
  list: CoppiaValori[];
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent  {

  cc: DatiEsterni;
  altro:string='';
  nuovaArea:string='';
  flagFoto:boolean=false;
  logoUrl:string = '';
  opzioniPlanner: OpzioniPlanner;

  constructor(
    public dialogRef: MatDialogRef<SelectComponent>,

    @Inject(MAT_DIALOG_DATA) public dati: DatiEsterni) {

    this.cc = Object.assign({}, Object.assign({}, dati));
    if (this.cc.title.indexOf('collaborator',0)>=0){
      this.flagFoto=true;
    }

    if (localStorage.hasOwnProperty('OpzioniPlanner')) {
      this.opzioniPlanner = JSON.parse(localStorage.getItem('OpzioniPlanner'));
      if (this.opzioniPlanner.logo && localStorage.hasOwnProperty('GruppoCliente') && localStorage.hasOwnProperty('SaloneCliente')) {
        this.logoUrl = '/images/PersonalizzazioniApp/' + (localStorage.getItem('GruppoCliente') + '/' + localStorage.getItem('SaloneCliente') + '/Skin/' + this.opzioniPlanner.logo).replace(/\s+/g, '_').toLowerCase();
      }
    }

  }

  confermaNuovaArea(){
    let n:CoppiaValori=new CoppiaValori();
    n.label='Nuova';
    n.value=this.nuovaArea;
    this.ok(n);
  }

  cleatTxt() {
      this.altro='';
  }


  ok(s: CoppiaValori): void {
    this.dialogRef.close(s);
  }


}
