import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from 'src/app/Models/Cliente';

@Component({
  selector: 'app-passaggi-cassa',
  templateUrl: './passaggi-cassa.component.html',
  styleUrls: ['./passaggi-cassa.component.scss']
})
export class PassaggiCassaComponent implements OnInit {
  pageOfItems: Array<any>;
  temps: Cliente[];

  constructor( public dialog: MatDialog, public dialogRef: MatDialogRef<PassaggiCassaComponent>,

    @Inject(MAT_DIALOG_DATA) public tempsP: Cliente[]) {

    this.temps =tempsP;

  }

  ngOnInit(): void {
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

}
