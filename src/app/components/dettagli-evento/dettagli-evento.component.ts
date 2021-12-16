import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Esito } from 'src/app/Models/Esito';
import { Salone } from 'src/app/Models/Salone';
import { PlannerService } from 'src/app/Services/planner.service';
import { SaloniService } from 'src/app/Services/saloni.service';

@Component({
  selector: 'app-dettagli-evento',
  templateUrl: './dettagli-evento.component.html',
  styleUrls: ['./dettagli-evento.component.scss']
})
export class DettagliEventoComponent implements OnInit {

  evento: any;

  constructor(private saloneService: SaloniService, private plannerSer: PlannerService, public dialog: MatDialog, public dialogRef: MatDialogRef<DettagliEventoComponent>,

    @Inject(MAT_DIALOG_DATA) public tempsP: any) {

    this.evento = tempsP;

  }

  ngOnInit(): void {
  }

  elimina() {
    if (confirm('Eliminare questo appuntamento?')) {

      let salone = this.saloneService.saloneCorrente;
      if (!salone) {
        const a: string[] = localStorage.getItem('PlannerCorrente').split(';');
        salone = new Salone();
        salone.gruppo = a[0];
        salone.salone = a[1];
        salone.destinazione = a[2];
        salone.indirizzo = a[3];
        salone.porta = a[4];

      }
      console.log(this.evento);
      this.plannerSer.deleteEvent(salone, this.evento.event.id).subscribe((x: Esito) => {
        if (x.esito === 'True') {
          this.dialogRef.close(true);
        } else {
          alert(x.messaggio);
        }
      }, err => {
        alert('Server non raggiungibile');
      });
    }
  }
}
