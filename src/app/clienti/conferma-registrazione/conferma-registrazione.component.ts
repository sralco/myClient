import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaloniService } from 'src/app/Services/saloni.service';

@Component({
  selector: 'app-conferma-registrazione',
  templateUrl: './conferma-registrazione.component.html',
  styleUrls: ['./conferma-registrazione.component.scss']
})
export class ConfermaRegistrazioneComponent implements OnInit {
  gruppo: string = '';
  salone: string = '';
  testo: string='';

  constructor(private aRoute: ActivatedRoute, private route:Router, private saloni: SaloniService,) {
    this.gruppo = this.aRoute.snapshot.paramMap.get('id1');
    this.salone = this.aRoute.snapshot.paramMap.get('id2');
    const codice = this.aRoute.snapshot.paramMap.get('id3');
    saloni.confermaRegistrazione(codice).subscribe((x:boolean)=>{
      if (x){
        this.testo='Attivazione completata';
      } else {
        this.testo='Attivazione non riuscita';
      }
    }, err=>{
      this.testo='Server non raggiungibile';
    });
   }

  ngOnInit(): void {
  }

  vai(){
    this.route.navigate(['mysaloon/' + this.gruppo], { replaceUrl: true });
  }
}
