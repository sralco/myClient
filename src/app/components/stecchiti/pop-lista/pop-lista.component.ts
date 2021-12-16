import { Inject, OnInit, Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from 'src/app/Models/Cliente';

@Component({
  selector: 'app-pop-lista',
  templateUrl: './pop-lista.component.html',
  styleUrls: ['./pop-lista.component.scss']
})
export class PopListaComponent implements OnInit {

  t: Cliente[];

  constructor( public dialog: MatDialog, public dialogRef: MatDialogRef<PopListaComponent>,

    @Inject(MAT_DIALOG_DATA) public tt: Cliente[]) {

    this.t = tt;
    //alert(JSON.stringify(tt));

  }

  ngOnInit(): void {
    //alert(JSON.stringify(this.t));

  }

}
