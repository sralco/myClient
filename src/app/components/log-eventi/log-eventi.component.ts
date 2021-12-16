import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Salone } from 'src/app/Models/Salone';

@Component({
  selector: 'app-log-eventi',
  templateUrl: './log-eventi.component.html',
  styleUrls: ['./log-eventi.component.scss']
})
export class LogEventiComponent implements OnInit {

  salone: Salone;
  totaleEliminati: number;
  
  constructor( public dialog: MatDialog, public dialogRef: MatDialogRef<LogEventiComponent>,

    @Inject(MAT_DIALOG_DATA) public saloneP: Salone) {

    this.salone = Object.assign({}, saloneP);

  }

  ngOnInit(): void {
  }

}
