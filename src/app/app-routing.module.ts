import { ClienteComponent } from './components/cliente/cliente.component';
import { ClientiComponent } from './components/clienti/clienti.component';
import { SettingComponent } from './components/setting/setting.component';
import { AggiungiprodottiComponent } from './components/aggiungiprodotti/aggiungiprodotti.component';
import { AggiungiserviziComponent } from './components/aggiungiservizi/aggiungiservizi.component';
import { FicheComponent } from './components/fiche/fiche.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NuovaschedatecnicaComponent } from './components/nuovaschedatecnica/nuovaschedatecnica.component';
import { RouteGuardService } from './Services/route-guard.service';
import { GruppoSaloniComponent } from './components/gruppo-saloni/gruppo-saloni.component';
import { CollaboratoriComponent } from './components/collaboratori/collaboratori.component';
import { PassaggiComponent } from './components/passaggi/passaggi.component';
import { ProduzioneComponent } from './components/produzione/produzione.component';
import { NuoviClientiComponent } from './components/nuovi-clienti/nuovi-clienti.component';
import { IncassoComponent } from './components/incasso/incasso.component';
import { SpeseComponent } from './components/spese/spese.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OndeComponent } from './components/onde/onde.component';
import { DettagliCollaboratoriComponent } from './components/dettagli-collaboratori/dettagli-collaboratori.component';
import { FuoriFrequenzaComponent } from './components/fuori-frequenza/fuori-frequenza.component';
import { ParcoClientiComponent } from './components/parco-clienti/parco-clienti.component';
import { ClientiInSaloneComponent } from './components/clienti-in-salone/clienti-in-salone.component';
import { StecchitiComponent } from './components/stecchiti/stecchiti.component';
import { SuperComponent } from './components/super/super.component';
import { WebcamComponent } from './components/webcam/webcam.component';
import { PlannerComponent } from './components/planner/planner.component';
import { PrenotazioneComponent } from './components/prenotazione/prenotazione.component';
import { TempoRealeComponent } from './components/tempoReale/tempoReale.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { mysaloonComponent } from './clienti/mysaloon/mysaloon.component';
import { RouteGuardClientiService } from './Services/route-guard-clienti.service';
import { RegistrazioneClientiComponent } from './clienti/registrazione-clienti/registrazione-clienti.component';
import { ConfermaRegistrazioneComponent } from './clienti/conferma-registrazione/conferma-registrazione.component';
import { PrenotazioneClientiComponent } from './clienti/prenotazione-clienti/prenotazione-clienti.component';
import { PrenotazioneCompletataComponent } from './clienti/prenotazione-completata/prenotazione-completata.component';
import { LoginClientiComponent } from './clienti/login-clienti/login-clienti.component';
import { DettagliClienteComponent } from './components/dettagli-cliente/dettagli-cliente.component';
import { UtentiPlannerComponent } from './components/utenti-planner/utenti-planner.component';
import { ConfermaAnnullamentoComponent } from './clienti/conferma-annullamento/conferma-annullamento.component';
import { ScattaFotoComponent } from './components/scatta-foto/scatta-foto.component';
import { ConsulenzaComponent } from './components/consulenza/consulenza.component';
import { ObiettiviComponent } from './components/obiettivi/obiettivi.component';
import { RecuperaPasswordComponent } from './clienti/recupera-password/recupera-password.component';
import { ScaricaProdottiComponent } from './components/scarica-prodotti/scarica-prodotti.component';
import { CustomersSatisfactionComponent } from './components/customers-satisfaction/customers-satisfaction.component';
import { MysaloonHomeComponent } from './clienti/mysaloon-home/mysaloon-home.component';


const routes: Routes = [
  { path: '', redirectTo: 'saloni', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'fiche/:id', component: FicheComponent },
  { path: 'schedaTecnica/:id', component: NuovaschedatecnicaComponent },
  { path: 'aggiungiServizi/:idTempFiche', component: AggiungiserviziComponent },
  { path: 'aggiungiProdotti/:idTempFiche', component: AggiungiprodottiComponent },
  { path: 'clienti', component: ClientiComponent },
  { path: 'clienti/:id', component: ClientiComponent },
  { path: 'cliente', component: ClienteComponent },

  {
    path: 'onde', component: OndeComponent,
    /*
    children: [
       { path: '', redirectTo: 'saloni', pathMatch: 'full' },
       { path: 'saloni', component: GruppoSaloniComponent },
       { path: 'saloni/:id', component: GruppoSaloniComponent, runGuardsAndResolvers: 'paramsOrQueryParamsChange' },
       { path: 'collaboratori', component: CollaboratoriComponent },
     ]*/
  },

  { path: 'login', component: LoginComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'cliente/:id', component: ClienteComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'collaboratori', component: CollaboratoriComponent, canActivate: [RouteGuardService] },
  { path: 'parcoclienti', component: ParcoClientiComponent, canActivate: [RouteGuardService] },
  { path: 'dettagliCollaboratore', component: DettagliCollaboratoriComponent},
  { path: 'passaggi', component: PassaggiComponent, canActivate: [RouteGuardService] },
  { path: 'produzione', component: ProduzioneComponent, canActivate: [RouteGuardService] },
  { path: 'nuoviClienti', component: NuoviClientiComponent, canActivate: [RouteGuardService] },
  { path: 'incasso', component: IncassoComponent, canActivate: [RouteGuardService] },
  { path: 'spese', component: SpeseComponent, canActivate: [RouteGuardService] },
  { path: 'dettaglicollaboratori', component: DettagliCollaboratoriComponent, canActivate: [RouteGuardService] },
  { path: 'fuorifrequenza', component: FuoriFrequenzaComponent, canActivate: [RouteGuardService] },
  { path: 'clientiinsalone', component: ClientiInSaloneComponent, canActivate: [RouteGuardService] },
  { path: 'stecchiti', component: StecchitiComponent, canActivate: [RouteGuardService] },
  { path: 'scattafoto/:id', component: ScattaFotoComponent},
  { path: 'super/:id', component: SuperComponent, canActivate: [RouteGuardService] },
  { path: 'saloni', component: GruppoSaloniComponent, canActivate: [RouteGuardService] },
  { path: 'planner', component: PlannerComponent, canActivate: [RouteGuardService] },
  { path: 'utentiplanner', component: UtentiPlannerComponent, canActivate: [RouteGuardService] },
  { path: 'prenotazione', component: PrenotazioneComponent, canActivate: [RouteGuardService] },
  { path: 'dettaglicliente/:id', component: DettagliClienteComponent, canActivate: [RouteGuardService] },
  { path: 'web', component: WebcamComponent },
  { path: 'qrcode', component: QrCodeComponent },
  { path: 'realtime', component: TempoRealeComponent, canActivate: [RouteGuardService] },
  { path: 'loginclienti/:id1/:id2', component: LoginClientiComponent },
  { path: 'registrazionecliente', component: RegistrazioneClientiComponent},
  { path: 'passwordDimenticata', component: RecuperaPasswordComponent},
  { path: 'confermaregistrazione/:id1/:id2/:id3', component: ConfermaRegistrazioneComponent},
  { path: 'mysaloon/home/:id', component: MysaloonHomeComponent},
  { path: 'mysaloon/:id', component: mysaloonComponent},

  { path: 'prenotazioneclienti/:id', component: PrenotazioneClientiComponent, canActivate: [RouteGuardClientiService] },
  { path: 'prenotazionecompletata', component: PrenotazioneCompletataComponent, canActivate: [RouteGuardClientiService] },
  { path: 'confermaannullamento', component: ConfermaAnnullamentoComponent },
  { path: 'consulenza/:id', component: ConsulenzaComponent },
  { path: 'obiettivi', component: ObiettiviComponent },
  { path: 'scaricaprodotti', component: ScaricaProdottiComponent },
  { path: 'customerssatisfaction', component: CustomersSatisfactionComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
