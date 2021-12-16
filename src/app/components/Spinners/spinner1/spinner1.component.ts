import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-spinner1',
  templateUrl: './spinner1.component.html',
  styleUrls: ['./spinner1.component.scss']
})


export class Spinner1Component implements OnInit {

  @Input() message = '';

constructor() { }

  ngOnInit() {
  }

}

