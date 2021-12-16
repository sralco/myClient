import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/Models/Cliente';
import { ClientiService } from 'src/app/Services/clienti.service';
import { Location } from '@angular/common';
import { Esito } from 'src/app/Models/Esito';
import { Consulenza } from 'src/app/Models/Consulenza';
import { ConsulenzeService } from 'src/app/Services/consulenze.service';

@Component({
  selector: 'app-consulenza',
  templateUrl: './consulenza.component.html',
  styleUrls: ['./consulenza.component.scss']
})
export class ConsulenzaComponent implements OnInit {

  titolo = 'Nuovo cliente';
  sesso = 'Donna';
  cliente: Cliente;
  consulenza : Consulenza=new Consulenza();
  idCliente: string;
  btnEnable = true;

  constructor(private location: Location, private service: ClientiService, private consulenzeService: ConsulenzeService, private route: Router, private aRoute: ActivatedRoute) {
    this.cliente = new Cliente();

    this.idCliente = this.aRoute.snapshot.paramMap.get('id');
    if (this.idCliente) {
      this.service.getCliente(this.idCliente,null).subscribe(x => {
        this.cliente = x[0];
        this.sesso = this.cliente.sesso;
        console.log(this.cliente);
        this.titolo=this.cliente.nome + ' ' + this.cliente.cognome;

        this.consulenzeService.getConsulenza(this.idCliente).subscribe(y=>{
          this.consulenza=y;
        }, err=>{
          console.log(err);
        });
      }, err => console.log(err));
    }
  }

  ngOnInit() {
    this.sesso = localStorage.getItem('Sesso');
    if (!this.sesso) {
      localStorage.setItem('Sesso', 'Donna');
      this.sesso = 'Donna';
    }
  }

  goBack() {
    this.location.back();
  }

  salvaCliente() {
    this.btnEnable = false;
    //console.log(JSON.stringify(this.cliente));
    this.consulenza.idCliente=this.cliente.id;

    this.consulenzeService.postConsulenza(this.consulenza).subscribe((x: Esito) => {
      if (x.esito === 'true') {
        this.goBack();
      } else {
        alert(x.messaggio + ' - ' + x.tag);
        this.btnEnable = true;
      }
    }, err=>{
      alert(err);
      console.log(err);
    });
  }


}
