import { Component, Inject, OnInit, LOCALE_ID } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { MsgboxComponent } from 'src/app/components/share/msgbox/msgbox.component';
import { Appuntamento } from 'src/app/Models/Appuntamento';
import { Prenotazione } from 'src/app/Models/Prenotazione';
import { Salone } from 'src/app/Models/Salone';
import { PlannerService } from 'src/app/Services/planner.service';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from 'src/app/Services/custom-date-adapter';

export class App {
  s: Salone;
  p: Appuntamento;
}

@Component({
  selector: 'app-dettagli-evento',
  templateUrl: './dettagli-evento-cliente.component.html',
  styleUrls: ['./dettagli-evento-cliente.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: "it" },
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
]
})
export class DettagliEventoClienteComponent implements OnInit {
  salone: Salone;
  prenotazione: Appuntamento;
  annullato: boolean = false;
  eliminato: boolean = false;
  loading: boolean = false;
  tel: string = '';

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DettagliEventoClienteComponent>, @Inject(MAT_DIALOG_DATA) public tt: App,
    private service: PlannerService, private notify: NotifierService) {
    this.salone = tt.s;
    this.prenotazione = tt.p;
    this.tel = localStorage.getItem('Telefono');
  }

  ngOnInit(): void {
    if (this.prenotazione.extendedProps.annullato === true) {
      this.annullato = true;
    }
  }

  richiediAnnullamento() {
    const dialogRef = this.dialog.open(MsgboxComponent, {
      minWidth: '100vw !important',
      minHeight: '100vw !important',
      data: 'Confermi la richiesta di annullamento?'
    });
    dialogRef.afterClosed().subscribe(s => {
      if (s) {
        this.loading = true;
        this.prenotazione.extendedProps.gruppo = this.salone.gruppo;
        this.prenotazione.extendedProps.salone = this.salone.salone;
        console.log('prenotazione');
        console.log(this.prenotazione);
        this.service.richiediAnnullamento(this.prenotazione).subscribe(x => {
          if (x.esito === 'true') {
            if (x.messaggio === 'Eliminazione avvenuta') {
              this.eliminato = true;
            } else {
              this.annullato = true;
            }
            //this.dialogRef.close();
          } else {
            alert('Annullamento non riuscito');
          }
          this.loading = false;
        }, err => {
          console.log(err);
          this.loading = false;
          alert('Server non raggiungibile');
        });
      }
    });
  }

  chiama(tel: string) {
    window.location.href = 'tel:' + tel;
  }

}
