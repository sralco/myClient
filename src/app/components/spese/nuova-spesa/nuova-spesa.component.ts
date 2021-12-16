import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Spesa } from 'src/app/Models/Spesa';
import { SpeseService } from 'src/app/Services/spese.service';

@Component({
  selector: 'app-nuova-spesa',
  templateUrl: './nuova-spesa.component.html',
  styleUrls: ['./nuova-spesa.component.scss']
})
export class NuovaSpesaComponent implements OnInit {

  public searchForm: FormGroup;

  gruppo: string;
  salone: string;

  spesaObj: Spesa = new Spesa();

  tipoPagamentoList = [
    { value: 'Cassa FB', label: 'Cassa FB' },
    { value: 'Contanti', label: 'Contanti' },
    { value: 'Bancomat', label: 'Bancomat' },
    { value: 'Carta', label: 'Carta' },
    { value: 'Assegno', label: 'Assegno' },
    { value: 'Bonifico', label: 'Bonifico' },];

  categorie: string[] = [];
  sottoCategorie: string[] = [];
  descrizioni: string[] = [];
  modelli: Spesa[] = [];

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<NuovaSpesaComponent>, @Inject(MAT_DIALOG_DATA) public spesaPubblica: Spesa, private speseService: SpeseService) {
    this.spesaObj.dataStr = new Date().toLocaleDateString();
    this.spesaObj.tipoPagamento = 'Cassa FB';
    this.gruppo = localStorage.getItem('Gruppo');
    this.salone = localStorage.getItem('Salone');

    this.searchForm = new FormGroup({
      desc: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
    });
  }

  ngOnInit(): void {
    this.speseService.getCategorie(this.gruppo, this.salone).subscribe(x => {
      this.categorie = x;
    }, err => {
      console.log(err);
    });

  }

  salvaSpese(): void {
    this.dialogRef.close(this.spesaObj);
  }

  getSottoCategorie(event) {
    this.speseService.getSottoCategorie(this.gruppo, this.salone, event.value).subscribe(x => {
      this.sottoCategorie = x;
    }, err => {
      console.log(err);
    });
  }

  getDescrizioni(event) {
    this.speseService.getDescrizioni(this.gruppo, this.salone, this.spesaObj.categoria, event.value).subscribe(x => {
      this.descrizioni = x;
    }, err => {
      console.log(err);
    });
  }

  getModelliSpesa(event) {
    const value: string=this.searchForm.get('desc').value;
    console.log(value.length);
    if (value.length > 2) {
      this.speseService.getModelliSpesa(this.gruppo, this.salone, this.searchForm.get('desc').value).subscribe(x => {
        this.modelli = x;
      }, err => {
        console.log(err);
      });
    }
  }

  selezionaSpesa(s:Spesa) {
    console.log(s);
    this.sottoCategorie=[];
    this.sottoCategorie.push(s.sottoCategoria);
    this.spesaObj.categoria=s.categoria;
    this.spesaObj.sottoCategoria=s.sottoCategoria;
    this.spesaObj.descrizione=s.descrizione;
    this.spesaObj.tipoPagamento=s.tipoPagamento;
    this.modelli=[];
    this.clearTxt('desc');
  }

  clearTxt(campo: string) {
      this.searchForm.get(campo).reset('');
      if (campo==='desc'){
        this.modelli=[];
      }
  }


}
