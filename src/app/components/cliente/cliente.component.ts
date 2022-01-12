import { Router, ActivatedRoute } from '@angular/router';
import { ClientiService } from './../../Services/clienti.service';
import { Location } from '@angular/common';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
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
  nomeSalone: string;
  saloni: Salone[];
  gruppo: string;

  titolo = 'Nuovo cliente';
  sesso = 'Donna';
  cliente: Cliente;
  idCliente: string;
  btnEnable = false;

  constructor(private saloneService: SaloniService, private location: Location, private service: ClientiService, private route: Router, private aRoute: ActivatedRoute) {

    this.idCliente = this.aRoute.snapshot.paramMap.get('id');

    this.cliente = new Cliente();
    //this.salone = this.saloneService.saloneCorrente;

    this.gruppo = localStorage.getItem("Gruppo");
    console.log('Gruppo')
    console.log(this.gruppo)
    this.nomeSalone = localStorage.getItem("Salone");
    this.salone = JSON.parse(localStorage.getItem("SaloneCorrente"));
    console.log('nomeSalone')
    console.log(this.nomeSalone)

    //if (!this.salone) {
      this.saloneService.getSaloni(this.gruppo).subscribe(x => {
        this.saloni = x;
        console.log(x)
        this.saloni.forEach(salone => {
          console.log(salone.salone)
          console.log(this.nomeSalone)
          if (salone.salone == this.nomeSalone) {
            this.salone = salone;
          }
        })
        if (this.idCliente) {
          //this.service.getCliente(this.idCliente,this.salone).subscribe(x => {
          console.log('salone')
          console.log(this.salone)
          this.service.getClienteDelSalone(this.salone, this.idCliente).subscribe(x => {
            console.log(x)
            this.cliente = x;
            this.sesso = this.cliente.sesso;
            console.log(JSON.stringify(this.cliente));
            console.log(this.cliente.sesso);
            this.titolo = this.cliente.nome + ' ' + this.cliente.cognome;
          }, err => console.error(err));
        }
      }, err => {
        console.log(err)
      })
    //}

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
        if (!this.cliente.id) {
          this.route.navigate(['/clienti/' + x.id]);
        } else {
          this.route.navigate(['/home/']);
        }
      } else {
        alert(x.messaggio + ' - ' + x.tag);
        this.btnEnable = true;
      }
    }, err => {
      alert(err);
      console.log(err);
    });
  }

}
