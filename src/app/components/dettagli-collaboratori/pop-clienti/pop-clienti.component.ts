import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TempFiche } from 'src/app/Models/Temp-Fiche';
import { Component, Inject, OnInit } from '@angular/core';
import { Cliente } from 'src/app/Models/Cliente';

export class appClass {
  c:Cliente[];
  Servizio: string;
  Collaboratore: string;
}

@Component({
  selector: 'app-pop-clienti',
  templateUrl: './pop-clienti.component.html',
  styleUrls: ['./pop-clienti.component.scss']
})
export class PopClientiComponent implements OnInit {

  t: appClass;

  constructor( public dialog: MatDialog, public dialogRef: MatDialogRef<PopClientiComponent>,

    @Inject(MAT_DIALOG_DATA) public tt: appClass) {

    this.t = tt;
    //alert(JSON.stringify(tt));

  }

  ngOnInit(): void {
    //alert(JSON.stringify(this.t));

  }
}
