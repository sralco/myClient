import { NumberFormatPipe } from './Pipe/number.pipe'
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/Http';
import { CommonModule, ViewportScroller } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwPaginationModule } from 'jw-angular-pagination';
import { MatSliderModule } from '@angular/material/slider';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DemoMaterialModule } from 'src/app/material-module';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { Router, Scroll, Event} from '@angular/router';
import { Position } from '@angular/compiler';
import { filter } from 'rxjs/operators';
import { QRCodeModule } from 'angularx-qrcode';
import {WebcamModule} from 'ngx-webcam';
import {NgxBarcodeScannerModule} from '@eisberg-labs/ngx-barcode-scanner';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import scrollGridPlugin from "@fullcalendar/scrollgrid";
import { NgxStarRatingModule } from 'ngx-star-rating';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
  scrollGridPlugin
]);
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 15,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

// Componenti
import { HomeComponent } from './components/home/home.component';
import { FicheComponent } from './components/fiche/fiche.component';
import { ProdottiComponent } from './components/prodotti/prodotti.component';
import { NavbarMysaloonComponent } from './components/navbar-mysaloon/navbar-mysaloon.component';
import { NuovaschedatecnicaComponent } from './components/nuovaschedatecnica/nuovaschedatecnica.component';
import { AggiungiserviziComponent } from './components/aggiungiservizi/aggiungiservizi.component';
import { AggiungiprodottiComponent } from './components/aggiungiprodotti/aggiungiprodotti.component';
import { SettingComponent } from './components/setting/setting.component';
import { CollaboratoriComponent } from './components/collaboratori/collaboratori.component';
import { ProduzioneComponent } from './components/produzione/produzione.component';
import { PassaggiComponent } from './components/passaggi/passaggi.component';
import { GruppoSaloniComponent } from './components/gruppo-saloni/gruppo-saloni.component';
import { LoginComponent } from './components/login/login.component';
import { ClientiComponent } from './components/clienti/clienti.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { Spinner1Component } from './components/Spinners/spinner1/spinner1.component';
import { Spinner1centerComponent } from './components/Spinners/spinner1center/spinner1center.component';
import { Spinner2Component } from './components/Spinners/spinner2/spinner2.component';
import { NuoviClientiComponent } from './components/nuovi-clienti/nuovi-clienti.component';
import { IncassoComponent } from './components/incasso/incasso.component';
import { SpeseComponent } from './components/spese/spese.component';
import { OndeComponent } from './components/onde/onde.component';
import { MsgboxComponent } from './components/share/msgbox/msgbox.component';
import { SelectComponent } from './components/share/select/select.component';
import { RegisterComponent } from './components/register/register.component';
import { DettagliCollaboratoriComponent } from './components/dettagli-collaboratori/dettagli-collaboratori.component';
import { FuoriFrequenzaComponent } from './components/fuori-frequenza/fuori-frequenza.component';
import { ParcoClientiComponent } from './components/parco-clienti/parco-clienti.component';
import { ClientiInSaloneComponent } from './components/clienti-in-salone/clienti-in-salone.component';
import { LogEventiComponent } from './components/log-eventi/log-eventi.component';
import { IntervalloDataComponent } from './components/intervallo-data/intervallo-data.component';
import { PopFicheComponent } from './components/passaggi/pop-fiche/pop-fiche.component';
import { StecchitiComponent } from './components/stecchiti/stecchiti.component';
import { PopListaComponent } from './components/stecchiti/pop-lista/pop-lista.component';
import { ClientiServitiComponent } from './components/clienti-serviti/clienti-serviti.component';
import { PopClientiComponent } from './components/dettagli-collaboratori/pop-clienti/pop-clienti.component';
import { SuperComponent } from './components/super/super.component';
import { ProvaComponent } from './components/prova/prova.component';
import { WebcamComponent } from './components/webcam/webcam.component';
import { PlannerComponent } from './components/planner/planner.component';
import { TempoRealeComponent } from './components/tempoReale/tempoReale.component';
import { PrenotazioneComponent } from './components/prenotazione/prenotazione.component';
import { IncassiComponent } from './components/incassi/incassi.component';
import { InAttesaComponent } from './components/in-attesa/in-attesa.component';
import { PassaggiCassaComponent } from './components/passaggi-cassa/passaggi-cassa.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { DettagliEventoComponent } from './components/dettagli-evento/dettagli-evento.component';
import { mysaloonComponent } from './clienti/mysaloon/mysaloon.component';
import { RegistrazioneClientiComponent } from './clienti/registrazione-clienti/registrazione-clienti.component';
import { ConfermaRegistrazioneComponent } from './clienti/conferma-registrazione/conferma-registrazione.component';
import { PrenotazioneClientiComponent } from './clienti/prenotazione-clienti/prenotazione-clienti.component';
import { PrenotazioneCompletataComponent } from './clienti/prenotazione-completata/prenotazione-completata.component';
import { LoginClientiComponent } from './clienti/login-clienti/login-clienti.component';
import { RisultatiCollaboratoreComponent } from './components/risultati-collaboratore/risultati-collaboratore.component';
import { DettagliClienteComponent } from './components/dettagli-cliente/dettagli-cliente.component';
import { UtentiPlannerComponent } from './components/utenti-planner/utenti-planner.component';
import { ProposteComponent } from './components/fiche/proposte/proposte.component';
import { DettagliEventoClienteComponent } from './clienti/dettagli-evento-cliente/dettagli-evento-cliente.component';


// servizi
import { ConstantsService } from 'src/app/Services/constants.service';
import { UsersService } from './Services/users.service';
import { BookService } from './Services/book.service';
import { TempFicheService } from './Services/temp-fiche.service';
import { SchedeTecnicheService } from './Services/schede-tecniche.service';
import { ServiziService } from './Services/servizi.service';
import { ProdottiService } from './Services/prodotti.service';
import { CollaboratoriService } from './Services/collaboratori.service';
import { SaloniService } from './Services/saloni.service';
import { RouteGuardService } from './Services/route-guard.service';
import { PlannerService } from './Services/planner.service';
import { AuthService } from './Services/auth.service';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthClientiService } from './Services/auth-clienti.service';
import { ConfermaAnnullamentoComponent } from './clienti/conferma-annullamento/conferma-annullamento.component';
import { ScattaFotoComponent } from './components/scatta-foto/scatta-foto.component';
import { ConsulenzaComponent } from './components/consulenza/consulenza.component';
import { ObiettiviComponent } from './components/obiettivi/obiettivi.component';
import { NuovaSpesaComponent } from './components/spese/nuova-spesa/nuova-spesa.component';
import { RecuperaPasswordComponent } from './clienti/recupera-password/recupera-password.component';
import { NuovoClienteComponent } from './components/nuovo-cliente/nuovo-cliente.component';
import { ScaricaProdottiComponent } from './components/scarica-prodotti/scarica-prodotti.component';
import { CustomersSatisfactionComponent } from './components/customers-satisfaction/customers-satisfaction.component';
import { MysaloonHomeComponent } from './clienti/mysaloon-home/mysaloon-home.component';
import { InputboxComponent } from './components/inputbox/inputbox.component';


const config = {
  apiKey: "AIzaSyCWhjrXzMj1AXWI1ajBoRSE9VPy6XQTfbY",
  authDomain: "mysaloon-9b4e2.firebaseapp.com",
  projectId: "mysaloon-9b4e2",
  storageBucket: "mysaloon-9b4e2.appspot.com",
  messagingSenderId: "204784302816",
  appId: "1:204784302816:web:b2bd597ffb6d43c3e06e85"
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FicheComponent,
    ProdottiComponent,
    NavbarMysaloonComponent,
    NuovaschedatecnicaComponent,
    AggiungiserviziComponent,
    AggiungiprodottiComponent,
    SettingComponent,
    LoginComponent,
    ClientiComponent,
    ClienteComponent,
    GruppoSaloniComponent,
    CollaboratoriComponent,
    PassaggiComponent,
    ProduzioneComponent,
    NumberFormatPipe,
    Spinner1Component,
    Spinner1centerComponent,
    Spinner2Component,
    NuoviClientiComponent,
    IncassoComponent,
    SpeseComponent,
    OndeComponent,
    RegisterComponent,
    DettagliCollaboratoriComponent,
    FuoriFrequenzaComponent,
    ParcoClientiComponent,
    ClientiInSaloneComponent,
    LogEventiComponent,
    IntervalloDataComponent,
    PopFicheComponent,
    StecchitiComponent,
    PopListaComponent,
    ClientiServitiComponent,
    PopClientiComponent,
    SuperComponent,
    ProvaComponent,
    MsgboxComponent,
    SelectComponent,
    WebcamComponent,
    PlannerComponent,
    PrenotazioneComponent,
    TempoRealeComponent,
    IncassiComponent,
    InAttesaComponent,
    PassaggiCassaComponent,
    QrCodeComponent,
    DettagliEventoComponent,
    DettagliEventoClienteComponent,
    mysaloonComponent,
    RegistrazioneClientiComponent,
    ConfermaRegistrazioneComponent,
    PrenotazioneClientiComponent,
    PrenotazioneCompletataComponent,
    LoginClientiComponent,
    RisultatiCollaboratoreComponent,
    DettagliClienteComponent,
    UtentiPlannerComponent,
    ProposteComponent,
    ConfermaAnnullamentoComponent,
    ScattaFotoComponent,
    ConsulenzaComponent,
    ObiettiviComponent,
    NuovaSpesaComponent,
    RecuperaPasswordComponent,
    NuovoClienteComponent,
    ScaricaProdottiComponent,
    CustomersSatisfactionComponent,
    MysaloonHomeComponent,
    InputboxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ChartsModule,
    ReactiveFormsModule,
    NgbModule,
    JwPaginationModule,
    MatSliderModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    DemoMaterialModule,
    FullCalendarModule,
    NotifierModule.withConfig(customNotifierOptions),
    QRCodeModule,
    WebcamModule,
    NgxBarcodeScannerModule,
    NgxStarRatingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
   
    BookService,
    FormsModule,
    TempFicheService,
    CollaboratoriService,
    SchedeTecnicheService,
    ServiziService,
    ProdottiService,
    UsersService,
    SaloniService,
    PlannerService,
    RouteGuardService,
    PlannerService,
    ConstantsService,
    NumberFormatPipe,
    AuthService,
    AuthClientiService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent],
  entryComponents: [],
  exports: [NumberFormatPipe]
})
export class AppModule { 
  constructor(/* router: Router, viewportScroller: ViewportScroller */) {
    /* router.events.pipe(
      filter((e: Event): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor);
      } else {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0]);
      }
    }); */
  }
}
