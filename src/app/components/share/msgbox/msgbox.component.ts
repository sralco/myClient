import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-msgbox',
  templateUrl: './msgbox.component.html',
  styleUrls: ['./msgbox.component.css']
})
export class MsgboxComponent {

  testoVisualizzato: string='';
  constructor(
    public dialogRef: MatDialogRef<MsgboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
      this.testoVisualizzato=data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
