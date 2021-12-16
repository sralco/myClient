import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class Data {
  titolo:string;
  testo:string;
  placeholder:string;
}

@Component({
  selector: 'app-inputbox',
  templateUrl: './inputbox.component.html',
  styleUrls: ['./inputbox.component.scss']
})
export class InputboxComponent {

mydata:Data;

  constructor(
    public dialogRef: MatDialogRef<InputboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data) {
    this.mydata = data;
  }

  keyDownFunction(event, testo) {
    if (event.keyCode === 13) {
      this.dialogRef.close(testo);
    }
  }


}
