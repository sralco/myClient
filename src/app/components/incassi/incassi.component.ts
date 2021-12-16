import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Incasso } from 'src/app/Models/incasso';
import { Salone } from 'src/app/Models/Salone';

@Component({
  selector: 'app-incassi',
  templateUrl: './incassi.component.html',
  styleUrls: ['./incassi.component.scss']
})
export class IncassiComponent implements OnInit {

  incassi: Incasso[];

  constructor( public dialog: MatDialog, public dialogRef: MatDialogRef<IncassiComponent>,

    @Inject(MAT_DIALOG_DATA) public incassiP: Incasso[]) {

    this.incassi = Object.assign([], incassiP);

  }

  ngOnInit(): void {
  }

}
