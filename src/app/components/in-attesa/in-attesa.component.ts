import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TempFiche } from 'src/app/Models/Temp-Fiche';
import { RealtimeService } from 'src/app/Services/realtime.service';
import { SaloniService } from 'src/app/Services/saloni.service';

@Component({
  selector: 'app-in-attesa',
  templateUrl: './in-attesa.component.html',
  styleUrls: ['./in-attesa.component.scss']
})
export class InAttesaComponent implements OnInit {
  temps: TempFiche[];

  constructor( public dialog: MatDialog, public dialogRef: MatDialogRef<InAttesaComponent>,

    @Inject(MAT_DIALOG_DATA) public tempsP: TempFiche[]) {

    this.temps = tempsP;

  }

 ngOnInit(): void {
  }

    // t.cell ? 'cadetblue' : 'red'
    setColor(t: TempFiche): string {
      if (!t.cell && !t.email) {
        return 'red';
      } else if (!t.cell || !t.email) {
        if (!t.cell) {
          return 'lightcoral';
        } else {
          return 'mediumturquoise';
        }
        return 'orange';
      } else {
        return 'cadetblue';
      }
    }

    // t.cell ? '' : 'Cellulare'
    setText(t: TempFiche): string {
      if (!t.cell && !t.email) {
        return 'Cell+Email';
      } else if (!t.cell || !t.email) {
        if (!t.cell) {
          return 'Cellulare';
        } else {
          return 'Email';
        }
        return 'orange';
      } else {
        return '';
      }
    }

}
