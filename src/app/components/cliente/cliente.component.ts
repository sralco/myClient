import { Router, ActivatedRoute } from '@angular/router';
import { ClientiService } from './../../Services/clienti.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/Models/Cliente';
import { Esito } from 'src/app/Models/Esito';
import { Salone } from 'src/app/Models/Salone';
import { SaloniService } from 'src/app/Services/saloni.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  salone: Salone;

  titolo = 'Nuovo cliente';
  sesso = 'Donna';
  cliente: Cliente;
  idCliente: string;
  btnEnable = false;

  constructor(private saloneService:SaloniService, private location: Location, private service: ClientiService, private route: Router, private aRoute: ActivatedRoute) {
    this.cliente = new Cliente();
    this.salone = this.saloneService.saloneCorrente;
    if (!this.salone) {
      this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    }
    console.log(this.salone)

    this.idCliente = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.idCliente)
    if (this.idCliente) {
      this.service.getCliente(this.idCliente,this.salone).subscribe(x => {
        console.log(x)
        this.cliente = x[0];
        this.sesso = this.cliente.sesso;
        console.log(JSON.stringify(this.cliente));
        console.log(this.cliente.sesso);
        this.titolo=this.cliente.nome + ' ' + this.cliente.cognome;
      }, err => console.error(err));
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
    this.cliente.sesso = this.sesso;
    console.log(JSON.stringify(this.cliente));
    this.service.salvaClienteAccess(this.cliente).subscribe((x: Esito) => {
      if ((x.id !== '') && (x.esito === 'Ok')) {
        this.cliente.id = x.id;
        console.log('IdCliente restituito: ' + this.cliente.id);
        if (!this.idCliente) {
          this.route.navigate(['/clienti/' + x.id]);
        } else {
          this.route.navigate(['/home/']);
        }
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
