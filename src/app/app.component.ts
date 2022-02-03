import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, ChildActivationStart } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myClient';

  constructor(private router: Router, private swUpdate: SwUpdate, private snackBar: MatSnackBar) {

    swUpdate.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });

    swUpdate.activated.subscribe(event => {
      let ii:number;
      const snackRef = this.snackBar.open('Aggiornamento', 'Riavvia' + ii, {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-primary']
      });
      snackRef.afterDismissed().subscribe(() => {
        window.location.reload();
      });
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        alert('errore di navigazione');
        // Present error to user
        console.log(event.error);
        alert(event.error);
      }
    });

  }

  ngOnInit() {

    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {
        console.log('Aggiornamento...');
        this.swUpdate.activateUpdate();
      });

    }

  }
}
