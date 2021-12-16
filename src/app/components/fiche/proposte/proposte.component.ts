import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Proposta } from 'src/app/Models/Proposta';
import { ProposteService } from 'src/app/Services/proposte.service';

@Component({
  selector: 'app-proposte',
  templateUrl: './proposte.component.html',
  styleUrls: ['./proposte.component.scss']
})
export class ProposteComponent implements OnInit {
  @ViewChild('menu') menuTriggers: MatMenuTrigger;
  proposte:Proposta[]=[];

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ProposteComponent>,@Inject(MAT_DIALOG_DATA) public tt: Proposta[], private service:ProposteService) {
    this.proposte=tt
    console.log(tt);
  }
  ngOnInit(): void {
  }

  public openMenu(input: Proposta): void
  {
      this.menuTriggers.menuData = { data: input };
      console.log(this.menuTriggers.menuData);
      this.menuTriggers.openMenu();
  }

  rifiutaProposta(){
    const p:Proposta=this.menuTriggers.menuData.data;
    console.log(p);
    this.service.rifiutaProposta(p).subscribe(x=>{
      if (x.esito==='true'){
        this.dialogRef.close();
      }else{
        alert('Impossibile confermare l\'operazione');
      }
    },err=>{
      console.log(err);
      alert('Impossibile confermare l\'operazione');
    })
  }
  chiudi(){
    this.dialogRef.close();
  }
}
