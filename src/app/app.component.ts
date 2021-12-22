import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { appendFile } from 'fs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myClient';

  constructor(private router: Router, private swUpdate: SwUpdate) {

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
        console.log('Aggiornamento app...');
        window.location.reload();

      });

    }



  }
}
