import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaloniService } from 'src/app/Services/saloni.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({ 
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})

export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  alert: boolean = false;
  alertText: string = '';

  constructor(
    private saloni: SaloniService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    // redirect to home if already logged in
    /*if (this.auth.isUserLoggedIn) {
        this.router.navigate(['/saloni']);
    }*/
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      uid: ['', Validators.required],
      pwd: ['', [Validators.required, Validators.minLength(2)]],
      token: ['', Validators.required],
      super: [false],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.saloni.addUser(this.form.value).subscribe(
      data => {
        if (data.token === 'Codice errato') {
          this.loading = false;
          this.alert = true;
          this.alertText = 'Il codice operatore non è valido'
        } else if (data.token === 'Utente presente') {
          this.loading = false;
          this.alert = true;
          this.alertText = 'Utente già registrato'
        } else {
          localStorage.setItem("GruppoSaloni", this.form.value.uid)
          this.router.navigate(['../login'], { relativeTo: this.route });
        }
      },
      error => {
        this.alert = true;
        this.alertText = "Impossibile raggiungere il server"
        this.loading = false;
        console.log(error);
      });
  }

  removeAlert() {
    this.alert = false;
  }

}
