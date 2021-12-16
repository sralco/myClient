import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SaloniService } from 'src/app/Services/saloni.service';
import { User } from 'src/app/Models/User';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-nuovo-cliente',
  templateUrl: './nuovo-cliente.component.html',
  styleUrls: ['./nuovo-cliente.component.scss']
})
export class NuovoClienteComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  alert: boolean = false;
  alertText: string = '';
  loading = false;
  gruppo: string = '';
  salone: string = '';

  user: User;

  constructor(private loc: Location, private saloni: SaloniService, private formBuilder: FormBuilder, private route: Router, public dialogRef: MatDialogRef<NuovoClienteComponent>, @Inject(MAT_DIALOG_DATA) public userPubblico: User) {
    this.gruppo = localStorage.getItem('GruppoCliente');
    this.salone = localStorage.getItem('SaloneCliente');
    this.user=userPubblico;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]*$")]],
      email: ['', [Validators.required,]],// Validators.email
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {

    // stop here if form is invalid //this.form.invalid ||
    if (this.f.email.value === '' || this.f.nome.value === '' || this.f.cognome.value === '' || this.f.phone.value === '') {
      alert('Tutti i campi sono obbligatori');
      return;
    }

    this.submitted = true;

    this.loading = true;
    this.user.gruppo = this.gruppo;
    this.user.salone = this.salone;
    this.user.email = this.f.email.value;
    this.user.nome = this.f.nome.value;
    this.user.cognome = this.f.cognome.value;
    this.user.cell = this.f.phone.value;

    this.saloni.addUserClienteFromPlanner(this.user).subscribe(
      (data: User) => {
        if (data.errorMessage !== null && data.errorMessage !== '') {
          this.loading = false;
          this.alert = true;
          this.alertText = data.errorMessage;
        } else {
          console.log(data);
          this.user.id=data.id;
          //localStorage.setItem("UserCliente", JSON.stringify(data));
          this.dialogRef.close(this.user);        }
      },
      error => {
        this.alert = true;
        this.alertText = "Impossibile raggiungere il server"
        this.loading = false;
      });
  }

  removeAlert() {
    this.alert = false;
  }

  back() {
    this.loc.back();
  }

}
