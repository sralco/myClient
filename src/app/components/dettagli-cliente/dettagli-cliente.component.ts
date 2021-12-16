import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Cliente } from 'src/app/Models/Cliente';
import { Salone } from 'src/app/Models/Salone';
import { ClientiService } from 'src/app/Services/clienti.service';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class AppClass {
  c:Cliente;
  s:Salone;
}

@Component({
  selector: 'app-dettagli-cliente',
  templateUrl: './dettagli-cliente.component.html',
  styleUrls: ['./dettagli-cliente.component.scss']
})

export class DettagliClienteComponent implements OnInit {

  idCliente:string;
  cliente:Cliente;
  salone:Salone;
  appClass:AppClass;

  constructor( public dialog: MatDialog, public dialogRef: MatDialogRef<DettagliClienteComponent>,@Inject(MAT_DIALOG_DATA) public tt: AppClass,private service: ClientiService, private saloneService:SaloniService, private router: Router, private aRoute:ActivatedRoute, private loc: Location, private notify:NotifierService) {
   this.appClass=tt;
    this.idCliente=aRoute.snapshot.paramMap.get('id');
    this.salone=saloneService.saloneCorrente;
    if (!this.salone){
      this.salone=JSON.parse(localStorage.getItem('SaloneCorrente'));
    }
   }

  ngOnInit(): void {
/*     this.service.getClienteDelSalone(this.salone,this.idCliente).subscribe((x:Cliente)=>{
      this.cliente=x;
    },err=>{
      console.log(err);
      this.notify.notify('warn','Impossibile raggiungere il server');
    });
 */  }

  back(){
    this.loc.back();
  }

}
