import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class QrCodeComponent implements OnInit {

  public myAngularxQrCode: string = null;

  constructor(private router: Router, private notifier: NotifierService, private loc: Location) {

    this.myAngularxQrCode = router.getCurrentNavigation().extras.state.example;
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notifier.notify('success', 'Indirizzo copiato negli appunti');

  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  ngOnInit(): void {
  }

  route: ActivatedRoute;

  apriPlanner() {

    let temp = [];
    let n: number;
    let finalPath: string = '';
    temp = this.myAngularxQrCode.split('/');
    n = temp.length;
    finalPath = decodeURIComponent('/mysaloon/' + temp[n - 1])
    this.router.navigate([finalPath], { relativeTo: this.route });

  }

  back() {
    this.loc.back();
  }
}