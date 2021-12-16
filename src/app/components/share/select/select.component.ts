import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

  constructor(
    public dialogRef: MatDialogRef<SelectComponent>,

    @Inject(MAT_DIALOG_DATA) public dati: DatiEsterni) {

    this.cc = Object.assign({}, Object.assign({}, dati));
    if (this.cc.title.indexOf('collaborator',0)>=0){
      this.flagFoto=true;
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
