import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-customers-satisfaction',
  templateUrl: './customers-satisfaction.component.html',
  styleUrls: ['./customers-satisfaction.component.scss']
})
export class CustomersSatisfactionComponent implements OnInit {

  rating3: number;
  public form: FormGroup;

  constructor(private fb: FormBuilder){
    this.rating3 = 0;
    this.form = this.fb.group({
      rating1: ['', Validators.required],
      rating2: [4]
    });
  }

  ngOnInit(): void {
  }

}
