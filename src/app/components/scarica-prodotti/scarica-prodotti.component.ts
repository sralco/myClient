import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scarica-prodotti',
  templateUrl: './scarica-prodotti.component.html',
  styleUrls: ['./scarica-prodotti.component.scss']
})
export class ScaricaProdottiComponent implements OnInit {
  value: string;
  isError = false;
  constructor() { }

  ngOnInit(): void {
  }


  onError(error) {
    console.error(error);
    this.isError = true;
  }
}
