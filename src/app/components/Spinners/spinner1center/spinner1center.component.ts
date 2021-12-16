import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner1center',
  templateUrl: './spinner1center.component.html',
  styleUrls: ['./spinner1center.component.scss']
})
export class Spinner1centerComponent implements OnInit {
  @Input() message = '';
  constructor() { }

  ngOnInit() {
  }

}
