import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TempFiche } from 'src/app/Models/Temp-Fiche';

@Component({
  selector: 'app-pop-fiche',
  templateUrl: './pop-fiche.component.html',
  styleUrls: ['./pop-fiche.component.scss']
})
export class PopFicheComponent implements OnInit {

  t: TempFiche;

  constructor( public dialog: MatDialog, public dialogRef: MatDialogRef<PopFicheComponent>,

    @Inject(MAT_DIALOG_DATA) public tt: TempFiche) {

    this.t = tt;
    //alert(JSON.stringify(tt));

  }

  ngOnInit(): void {
    //alert(JSON.stringify(this.t));

  }

}
