import { Component, OnInit, ViewChild, forwardRef, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { CalendarOptions, Calendar, EventInput, BusinessHoursInput } from '@fullcalendar/core';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimeGridWeek from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { ScrollGrid } from '@fullcalendar/scrollgrid';
import { MatDialog } from '@angular/material/dialog';
import { LOCALE_ID } from '@angular/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { PlannerService } from 'src/app/Services/planner.service';
import { Appuntamento, ExtendProperties } from 'src/app/Models/Appuntamento';
import * as moment from 'moment/moment';
import { Esito } from 'src/app/Models/Esito';
import { Collaboratore } from 'src/app/Models/Collaboratore';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from 'src/app/Services/constants.service';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SaloniService } from 'src/app/Services/saloni.service';
import { Salone } from 'src/app/Models/Salone';
import { Location } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { OpzioniPlanner } from 'src/app/Models/OpzioniPlanner';
import { DettagliEventoComponent } from '../dettagli-evento/dettagli-evento.component';
import { AuthService } from 'src/app/Services/auth.service';
import { User } from 'src/app/Models/User';
import { interval, Subscription } from 'rxjs';
import localeItalian from '@angular/common/locales/it';
import { CustomDateAdapter } from 'src/app/Services/custom-date-adapter';
import { OpzioniDelGiorno } from 'src/app/Models/OpzioniDelGiorno';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeItalian, 'it');

export class InfoClick {
   public resourceId: string;
   public startDate: Date;
   public visible: boolean;
   constructor(resourceId: string, startDate: Date, visible: boolean) {
      this.resourceId = resourceId;
      this.startDate = startDate;
      this.visible = visible;
   }
}

@Component({
   selector: 'app-planner',
   templateUrl: './planner.component.html',
   styleUrls: ['./planner.component.scss'],
   providers: [
      { provide: LOCALE_ID, useValue: "it" },
      { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
      { provide: DateAdapter, useClass: CustomDateAdapter },
   ],
   /* 
      providers: [
         // The locale would typically be provided on the root module of your application. We do it at
         // the component level here, due to limitations of our example generation script.
         //{ provide: MAT_DATE_LOCALE, useValue: 'it' },
   
         // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
         // `MatMomentDateModule` in your applications root module. We provide it at the component level
         // here, due to limitations of our example generation script.
         {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
         },
         //{ provide: MAT_DATE_FORMATSpi, useValue: MAT_MOMENT_DATE_FORMATS },
      ], */
})
export class PlannerComponent implements OnInit, OnDestroy {

   @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
   @ViewChild('picker') picker: MatDatepicker<Date>;
   //@ViewChild('datePicker') datePicker: MatInput;
   @ViewChild('pop') add: ElementRef;
   calendarOptions: CalendarOptions;
   eventsModel: any;
   currentId = '5';
   calendarApi: Calendar;

   currentClick = new InfoClick('', new Date(), false);
   currentSelection = '0';

   calendarEvents: EventInput[] = [];
   //used to provide the calendar component with data
   eventsCalendar: any[] = [];
   //used to store initial data
   events: any[] = [];
   initialized = false;
   scroll: number = 0
   dataCorrente: Date;
   calendarResources = [
      {
         id: 'A2', title: 'Giovanni',
         businessHours: {
            startTime: '11:00',
            endTime: '17:00',
            daysOfWeek: [1, 3, 5] // Mon,Wed,Fri
         }
      },
      { id: 'A4', title: 'Giggino', }, //eventColor: 'green' },
      { id: 'A7', title: 'Nicola', }, //eventColor: 'orange' },
      { id: 'A8', title: 'Maria' }
   ];
   salone: Salone;
   opzioni: OpzioniPlanner;
   user: User;
   saloneSelezionato: Salone;
   selezionandoSalone: boolean = false;
   saloni: Salone[] = [];

   businessHours: OpzioniDelGiorno[];

   private updateSubscription: Subscription;

   constructor(private router: Router, private plannerSer: PlannerService, public dialog: MatDialog, private _snackBar: MatSnackBar, private saloneService: SaloniService, private loc: Location, private auth: AuthService) {
      this.dataCorrente = new Date();
      const app = localStorage.getItem('user');
      if (app) {
         this.user = JSON.parse(app);
         if (this.user.tipo === 'Receptionist') {

         } else if (this.user.tipo === 'Collaboratore') {
            router.navigate(['dettagliCollaboratore']);
         }
      }

      if (localStorage.getItem('DataPlanner') && localStorage.getItem('DataPlanner') !== '') {
         this.dataCorrente = new Date(JSON.parse(localStorage.getItem('DataPlanner')));
      }

      this.saloneSelezionato = this.saloneService.saloneCorrente;
      if (!this.saloneSelezionato) {
         const a: string[] = localStorage.getItem('PlannerCorrente').split(';');
         this.saloneSelezionato = new Salone();
         this.saloneSelezionato.gruppo = a[0];
         this.saloneSelezionato.salone = a[1];
         this.saloneSelezionato.destinazione = a[2];
         this.saloneSelezionato.indirizzo = a[3];
         this.saloneSelezionato.porta = a[4];
         this.saloneSelezionato.posizionePlanner = a[5];

      }

      this.saloneSelezionato.opzioniPlanner = JSON.parse(localStorage.getItem('OpzioniPlanner'));

      if (this.saloneSelezionato.opzioniPlanner.oraInizio === '') {
         this.saloneSelezionato.opzioniPlanner.oraInizio = '08:00';
         this.saloneSelezionato.opzioniPlanner.oraFine = '20:00';
         this.saloneSelezionato.opzioniPlanner.lun = true;
         this.saloneSelezionato.opzioniPlanner.mar = true;
         this.saloneSelezionato.opzioniPlanner.mer = true;
         this.saloneSelezionato.opzioniPlanner.gio = true;
         this.saloneSelezionato.opzioniPlanner.ven = true;
         this.saloneSelezionato.opzioniPlanner.sab = true;
         this.saloneSelezionato.opzioniPlanner.dom = false;
      }

      const giorno: OpzioniDelGiorno = new OpzioniDelGiorno(this.saloneSelezionato.opzioniPlanner);

      this.calendarOptions = {
         schedulerLicenseKey: '0449068578-fcs-1612134483',
         plugins: [resourceTimeGridPlugin, interactionPlugin, resourceTimeGridWeek,],
         refetchResourcesOnNavigate: false,
         datesAboveResources: true,
         resourceOrder: 'ordine',
         //timeZone: 'UTC',
         initialDate: this.dataCorrente,
         resources: function (fetchInfo, successCallback, failureCallback) {
            /* let data=fetchInfo.startStr;*/

            let salone = saloneService.saloneCorrente;
            if (!salone) {
               const a: string[] = localStorage.getItem('PlannerCorrente').split(';');
               salone = new Salone();
               salone.gruppo = a[0];
               salone.salone = a[1];
               salone.destinazione = a[2];
               salone.indirizzo = a[3];
               salone.porta = a[4];
               salone.posizionePlanner = a[5];
            }

            plannerSer.getCollaboratori(salone).subscribe(res => {
               console.log('getCollaboratori');
               console.log(res);
               let resourceArray = [];
               let bh = [];
               if (res) {
                  /* for (let item of res) {
                    resourceArray.push({ id: item.id, title: item.nome });
                  } */
                  res.forEach((x, index) => {
                     console.log('bbbbb')
                     if (x.giorniAbilitati.length > 0) {
                        x.giorniAbilitati.forEach(y => {
                           let dow = [moment(y.data).day()];
                           console.log('data')
                           console.log(y.data)
                           console.log(dow)

                           if (bh.length == 0) {
                              bh[+x.id] = [
                                 {
                                    startTime: y.oraInizio,
                                    endTime: y.pausaInizio,
                                    daysOfWeek: dow
                                 },
                                 {
                                    startTime: y.pausaFine,
                                    endTime: y.oraFine,
                                    daysOfWeek: dow
                                 }
                              ]
                           } else {
                       
                              bh.splice(+x.id, 0, bh[+x.id].concat([
                                 {
                                    startTime: y.oraInizio,
                                    endTime: y.pausaInizio,
                                    daysOfWeek: dow
                                 },
                                 {
                                    startTime: y.pausaFine,
                                    endTime: y.oraFine,
                                    daysOfWeek: dow
                                 }
                              ]))
                           }
                           
                           console.log(bh)
                        })
                        
                     }
                     resourceArray.push({
                        id: x.id,
                        title: x.nome,
                        ordine: x.ordine,
                        businessHours: bh[+x.id]
                     })
                  })

                /*   res.forEach((x, index) => {
                     console.log('aaaa');
                     resourceArray.push({
                        id: x.id,
                        title: x.nome,
                        ordine: x.ordine,
                        businessHours: bh[+x.id]
                     })
                  }) */
                  resourceArray.sort((a, b) => a.ordine - b.ordine);
                  console.log(resourceArray)
                  successCallback(resourceArray);
               }
            },
               error => {
                  this.openSnackBar('Errore nella connessione al server');
                  alert('Errore nella connessione al server');
               }
            )
         },
         events: this.calendarEvents,

         businessHours: giorno.getBusinessHours(),
         //selectMirror:true,
         initialView: 'resourceTimeGridDay',
         dragScroll: true,
         slotDuration: '00:05:00',
         //displayEventTime: false,
         slotLabelInterval: { minutes: this.saloneSelezionato.opzioniPlanner.intervallo },
         locale: 'it-IT',
         nowIndicator: true,
         scrollTime: '00:00',
         slotMinTime: this.saloneSelezionato.opzioniPlanner.oraInizio,
         slotMaxTime: this.saloneSelezionato.opzioniPlanner.oraFine,
         height: '85%',
         expandRows: true,
         //contentHeight: '400',
         //stickyFooterScrollbar: true,
         //stickyHeaderDates:true,
         dayMinWidth: 100, // per rendere stiky le intestazioni di riga e permettere lo scorrimento orizzontale ma bisogna impostare height:'auto'
         allDaySlot: false,
         firstDay: 1,
         slotLabelFormat:
         {
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
         },
         //selectable: true,
         //selectHelper:true,
         //snapMinutes: 60,
         dateClick: this.handleDateClick.bind(this),
         select: function (info) {
            //alert('selected ' + info.startStr + ' to ' + info.endStr);
         },
         eventClick: this.handleEventClick.bind(this),
         eventDrop: this.handleEventDragStop.bind(this),
         eventResize: this.handleResize.bind(this),
         slotEventOverlap: false,
         displayEventEnd: false,
         headerToolbar: false,
         /* headerToolbar:  {
           right: 'today,  prev, next',
           //center: 'title',
         }, */
         footerToolbar: {
            left: 'resourceTimeGrid6Day,resourceTimeGridDay'
         },
         views: {
            resourceTimeGrid6Day: {
               type: 'resourceTimeGrid',
               duration: { days: 7 },
               buttonText: '7 giorni',
            },
            resourceTimeGridDay: {
               type: 'resourceTimeGridDay',
               duration: { days: 1 },
               buttonText: 'Giorno'
            }
         },
         datesSet: this.handleChangeCalendar.bind(this),
         eventDidMount: function (info) {
            info.el.style.borderColor = 'white';
            info.el.style.boxShadow = '0 10px 10px 0 rgba(110, 57, 57, 0.2), 0 10px 10px 0 rgba(0, 0, 0, 0.19)';
            info.el.style.borderRadius = '7px 7px 15px';
            info.el.style.padding = '5px';
            info.el.style.borderWidth = '2px';
            info.el.style.backgroundImage = 'linear-gradient(to bottom, ' + info.el.style.backgroundColor + ', white)';

            let title = info.el.querySelector('.fc-event-title');
            title.setAttribute("style", "text-transform:capitalize;");

            //let div = info.el.querySelector('.fc-event-title');
            //div.appendChild
            //div.style.text-transform = 'capitalize';
            //let div = getElementsByClassName.('.fc-event-title')

            let time = info.el.querySelector('.fc-event-time');
            //let time = info.el.querySelector('.fc-event-main');
            if (time) {
               /* var span = document.createElement('img');
               span.className = 'fullcalendar-event-close';
               span.style.position = 'absolute';
               span.style.right = '0';
               span.src = 'assets/delete-16.png';

               let node = document.createTextNode('x');
               span.appendChild(node);
               time.appendChild(span);
 */
               if (info.event.extendedProps.tsr?.trim() === 'R') {
                  var span2 = document.createElement('img');
                  span2.className = 'fullcalendar-event-close';
                  span2.style.position = 'absolute';
                  span2.style.right = '0';
                  span2.style.width = '20px';
                  span2.src = 'assets/Richiesto.png';

                  let node3 = document.createTextNode('x2');
                  span2.appendChild(node3);
                  time.appendChild(span2);
               } else {

                  if (!info.event.extendedProps.esterno) {
                     var span1 = document.createElement('img');
                     span1.className = 'fullcalendar-event-close';
                     span1.style.position = 'absolute';
                     span1.style.right = '0';
                     span1.src = 'assets/esterno.png';

                     let node1 = document.createTextNode('x1');
                     span1.appendChild(node1);
                     time.appendChild(span1);
                  }
               }

               /* info.el.querySelector(".fullcalendar-event-close").addEventListener("click", function () {
                  if (confirm('Eliminare l appuntamento?')) {

                     let salone = saloneService.saloneCorrente;
                     if (!salone) {
                        const a: string[] = localStorage.getItem('PlannerCorrente').split(';');
                        salone = new Salone();
                        salone.gruppo = a[0];
                        salone.salone = a[1];
                        salone.destinazione = a[2];
                        salone.indirizzo = a[3];
                        salone.porta = a[4];

                     }
                     plannerSer.deleteEvent(salone, info.event.id).subscribe((x: Esito) => {
                        if (x.esito === 'True') {
                           info.event.remove();
                        } else {
                           alert(x.messaggio);
                        }
                     }, err => {
                        alert('Server non raggiungibile');
                     });
                  }
               }); */
            }
         },

      };
      console.log(this.calendarOptions)

      // need for load calendar bundle first
      forwardRef(() => Calendar);
   }

   getResourceBusinessHours(x: Collaboratore) {
      console.log('bbbbb')
      if (x.giorniAbilitati.length > 0) {
         x.giorniAbilitati.forEach(y => {
            console.log('bbbb')
            let dow = [moment(y.data).day()];
            let bh = [];

            bh.push([
               {
                  startTime: y.oraInizio,
                  endTime: y.pausaInizio,
                  daysOfWeek: dow
               },
               {
                  startTime: y.pausaFine,
                  endTime: y.oraFine,
                  daysOfWeek: dow
               }
            ])

            console.log(bh)
            return bh

         })

      }
   }

   ngAfterViewInit() {
      //laoding events based on calendarApi
      this.calendarApi = this.fullcalendar.getApi();
      if (this.calendarApi && !this.initialized) {
         this.initialized = true;
         this.loadEvents();
      }
   }

   ngOnInit() {


      this.saloneService.getSaloni(this.saloneSelezionato.gruppo).subscribe(x => {
         this.saloni = x;
      }, (err => {
         //this.notifier.notify('warning', 'Errore nella connessione al server');
      })
      );

      this.updateSubscription = interval(10000).subscribe(val => {
         console.log('Sto prelevando \n ' + this.calendarApi.currentData.currentDate)
         const ora: number = this.calendarApi.currentData.currentDate.getHours();
         // if (ora > 21) {
         //    this.calendarApi.currentData.currentDate.setHours(20, 0, 0, 0);
         // }
         /*       if (ora<3){
                 console.log(this.calendarApi.currentData.currentDate.getDate());
                 this.calendarApi.currentData.currentDate.setDate(this.calendarApi.currentData.currentDate.getDate()-1);
               }
          */      //this.prelevaDati(new Date(this.calendarApi.currentData.currentDate.getTime() - (1000 * 60 * 60 * 24)),  this.calendarApi.currentData.currentDate);
         this.prelevaDati(this.calendarApi.view.currentStart, this.calendarApi.view.currentEnd);
         this.weeklyEndDate = moment(this.calendarApi.view.currentEnd).subtract(1, 'days').toDate();
      });



   }

   ngOnDestroy() {
      this.updateSubscription.unsubscribe()
   }

   selezionandoSaloneFlag() {
      this.selezionandoSalone = true;
   }

   selezionaSalone(salone) {
      this.saloneSelezionato = salone;
      this.selezionandoSalone = false;
      this.calendarApi.refetchResources();
      this.loadEvents();
      this.prelevaDati(this.calendarApi.view.currentStart, this.calendarApi.view.currentEnd);
      localStorage.setItem('PlannerCorrente', this.saloneSelezionato.gruppo + ';' + this.saloneSelezionato.salone + ';' + this.saloneSelezionato.destinazione + ';' + this.saloneSelezionato.indirizzoIP + ';' + this.saloneSelezionato.porta + ';' + this.saloneSelezionato.posizionePlanner);
      localStorage.setItem('OpzioniPlanner', JSON.stringify(this.saloneSelezionato.opzioniPlanner));
      window.location.reload();
   }

   selezSalone() {
      this.selezionandoSalone = !this.selezionandoSalone;
   }

   handleChangeCalendar(info) {
      this.prelevaDati(info.start, info.end);
   }

   prelevaDati(dataInizio: Date, dataFine: Date) {
      this.calendarEvents = [];
      this.eventsCalendar = [];
      if (!dataFine) {
         dataFine = dataInizio;
      }

      const dd: Date = moment(dataInizio, 'YYYY-MM-DD').toDate();
      let start: Date = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate());
      const dd1: Date = moment(dataFine, 'YYYY-MM-DD').toDate();
      let end: Date = new Date(dd1.getFullYear(), dd1.getMonth(), dd1.getDate());

      console.log(start.toLocaleDateString())
      console.log(end.toLocaleDateString())

      this.plannerSer.getPlanner(this.saloneSelezionato, start.toLocaleDateString(), end.toLocaleDateString(), '').subscribe((data: Appuntamento[]) => {
         this.events = data;
         this.assignResources();
         this.loadEvents();
      }, err => {
         this.openSnackBar('Errore nella connessione al server');
      });
      // if (this.scroll >= 0) {
      //    document.querySelector('.fc-scrollgrid-section-liquid .fc-scroller').scrollTop = this.scroll;
      // }

      // this.plannerSer.getPlanner(this.saloneSelezionato, start.toLocaleDateString(), end.toLocaleDateString(), '').subscribe((data: Appuntamento[]) => {
      //    this.events = data;
      //    console.log(this.events);
      //    if (!this.events) {
      //       this.plannerSer.getPlanner(this.saloneSelezionato, start.toLocaleDateString(), end.toLocaleDateString(), '').subscribe((data1: Appuntamento[]) => {
      //          this.events = data1;
      //          this.assignResources();
      //          this.loadEvents();
      //       });
      //    } else {
      //       this.assignResources();
      //       this.loadEvents();//calling the loadEvents Function as soon as the data are stored
      //    }

      /* if (this.scroll >= 0) {
         document.querySelector('.fc-scrollgrid-section-liquid .fc-scroller').scrollTop = this.scroll;
      } */
      // }, err => {
      //    this.openSnackBar('Errore nella connessione al server');
      // });
   }

   assignResources() {
      this.events.forEach((e) => {
         console.log(e)
         let ext: ExtendProperties = {
            idCliente: e.idCliente,
            servizi: e.servizi,
            tempo: e.tempo,
            colore: e.backgroundColor,
            idServizio: e.idServizio,
            tempoDiPosa: e.tempoDiPosa,
            gruppo: this.saloneSelezionato.gruppo,
            salone: this.saloneSelezionato.salone,
            //titolo: e.title.replace('Cliente Occasionale', 'Cliente occ.'),
            //servizi: e.
            token: '',
            posizione: this.saloneSelezionato.destinazione,
            nomeCliente: e.nomeCliente,
            annullato: false,
            esterno: e.esterno,
            tsr: e.tsr,
            richiesto: e.richiesto,
            errors: e.errors,
         };
         let calendarevent: EventInput = {
            startEditable: e.editable === -1 ? true : false,
            id: e.id,
            resourceId: e.resourceId,
            title: decodeURIComponent(e.title).replace('Cliente Occasionale', 'Cliente occ.'),
            start: new Date(e.start),
            end: new Date(e.endTime),
            allDay: e.allDay,
            isMultipleDay: e.isMultipleDay,
            groupId: e.groupId,
            backgroundColor: e.backgroundColor ? e.backgroundColor : 'green',
            resourceEditable: e.editable === -1 ? true : false,
            extendedProps: ext,
            editable: true,
            textColor: e.textColor
         }
         //calendarevent.extendedProps.servizi=e.servizi;
         this.eventsCalendar.push(calendarevent);
      });
   }


   cambiaView(testo) {
      this.calendarOptions.initialView = testo;
   }

   handleResize(info) {
      //console.log(info.prevEvent); // data before the drop
      //console.log(info.startDelta); // how far start was moved
      //console.log(info.endDelta); // how far end was moved
      //console.log(info.jsEvent);

      let e: Appuntamento = new Appuntamento;
      e.id = info.event.id;
      e.resourceId = '';
      e.title = info.event.title;
      e.start = info.event.startStr;
      e.end = info.event.endStr;
      e.extendedProps = info.event.extendedProps;

      this.plannerSer.updateAppuntamento(this.saloneSelezionato, e).subscribe((x: Esito) => {
         if (x.esito === 'True') {
         } else {
            alert(x.messaggio);
            info.revert();
         }
      }, err => {
         alert('Server non raggiungibile');
         info.revert();
      });
   }

   onClick(event) {

      /* //determine popup X and Y position to ensure it is not clipped by screen borders
      const popupHeight = 400, // hardcode these values
        popupWidth = 300;    // or compute them dynamically

      let popupXPosition,
        popupYPosition

      if (event.clientX + popupWidth > window.innerWidth) {
        popupXPosition = event.pageX - popupWidth;
      } else {
        popupXPosition = event.pageX;
      }

      if (event.clientY + popupHeight > window.innerHeight) {
        popupYPosition = event.pageY - popupHeight;
      } else {
        popupYPosition = event.pageY;
      }
      popupXPosition = event.pageX; */

      if (event.clientX > 49 && event.clientY > 128) {
         this.currentClick.visible = true;

         this.add.nativeElement.style.visibility = 'visible';
         this.add.nativeElement.style.zIndex = '999';
         this.add.nativeElement.style.position = 'absolute';
         this.add.nativeElement.style.top = event.pageY + 'px';
         this.add.nativeElement.style.left = event.pageX + 'px';
      }
   }

   handleDateClick(info) {
      /* console.log(info);
      console.log(info.date.toISOString() + '------------------------------');
      console.log(info.dateStr + '------------------------------');
      console.log(info.allDay + '------------------------------');
      console.log(info.dayEl + '------------------------------');
      console.log(info.jsEvent);
      console.log(info.resource.id);
      console.log('Current view: ' + info.view.type); */
      // info.dayEl.style.backgroundColor = 'red';

      this.currentClick.resourceId = info.resource.id
      this.currentClick.startDate = info.dateStr;
      let endDate: Date = moment(info.dateStr, 'YYYY-MM-DD HH:mm').toDate();
      endDate = new Date(endDate.getTime() + this.saloneSelezionato.opzioniPlanner.intervallo * 60000);

      const a = {
         start: info.dateStr,
         end: endDate,
         allDay: false,
         resourceId: info.resource.id,
      };

      if (this.currentSelection === info.dateStr + info.resource.id) {
         this.currentSelection = '';
         this.fullcalendar.getApi().unselect();

         localStorage.setItem('IdCollaboratorePrefissato', info.resource.id);
         localStorage.setItem('OraPrefissata', info.dateStr);
         localStorage.setItem('DataPrefissata', info.dateStr);

         this.router.navigate(['/prenotazione/']);
      } else {
         this.fullcalendar.getApi().select(a);
         this.currentSelection = info.dateStr + info.resource.id;
      }

      return;
   }

   handleEventClick(info) {
      console.log(info);
      const resources = info.event.getResources();
      const resourceIds = resources.map(resource => resource.id);
      //console.log(resourceIds[0]);

      info.jsEvent.preventDefault(); // Evita che il browser avvii la navigazione anche se l'url ?? vuota
      if (info.event.url) {
         window.open(info.event.url);
      }

      this.showEvento(info);

      // This is where it resets the highlight when user clicks on another event
      //let time = info.el.querySelector(".fc-event-container a").css("background-color", "#3788d8");
      // This is where i set the background color of the event when user clicks
      //let time1 = info.el.querySelector(info.el).css("background-color", "#00da4a");

   }

   showEvento(info) {
      const dialogRef = this.dialog.open(DettagliEventoComponent, {
         width: '95%',
         maxWidth: '350px',
         data: info
      });
      dialogRef.afterClosed().subscribe(s => {
         console.log(s);
         if (s) {
            info.event.remove();
         }
      });

   }

   handleEventDragStop(info) {
      //console.log(info.delta); // how far it was moved

      let resourceId: string = '';
      if (info.newResource) {
         resourceId = info.newResource.id;
      } else {
         if (info.delta.milliseconds > 0) {
         }
      }
      let e: Appuntamento = new Appuntamento;
      e.id = info.event.id;
      e.resourceId = resourceId;
      e.title = info.event.title;
      e.start = info.event.startStr;
      e.end = info.event.endStr;
      e.extendedProps = info.event.extendedProps;

      this.plannerSer.updateAppuntamento(this.saloneSelezionato, e).subscribe((x: Esito) => {
         if (x.esito === 'True') {
         } else {
            alert(x.messaggio);
            info.revert();
         }
      }, err => {
         alert('Server non raggiungibile');
         info.revert();
      });
   }


   // Resource annidati (gruppo e sottogruppo)
   /*   calendarEvents: EventInput[] = [
       { title: 'group', start: new Date(), resourceId: 'a1', groupId: 'a' },
       { title: 'group', start: '12/17/2019 08:00:00', resourceId: 'a1', groupId: 'a', rendering: 'background' },
       { title: 'group', start: new Date(), resourceId: 'a2', groupId: 'a' },
       { title: 'Event Now', start: new Date(), resourceId: 'b2' }
     ];
    */
   /*calendarResources: [
     {
       id: 'a',
       title: 'Room A',
       children: [
         {
           id: 'a1',
           title: 'Room A1'
         },
         {
           id: 'a2',
           title: 'Room A2'
         }
       ]
     },
     {
       id: 'b',
       title: 'Room b',
       children: [
         {
           id: 'b1',
           title: 'Room b1'
         },
         {
           id: 'b2',
           title: 'Room b2'
         }
       ]
     }
   ];*/

   /*calendarResources: [
     {
       id: 'a',
       title: 'Room A'
     },
     {
       id: 'a1',
       parentId: 'a',
       title: 'Room A1'
     },
     {
       id: 'a2',
       parentId: 'a',
       title: 'Room A2'
     }
   ];*/

   //used to load the events of the calendar
   loadEvents() {
      //to store events in the calendar
      this.calendarApi.refetchResources();
      this.calendarEvents = this.eventsCalendar;

      this.calendarApi.removeAllEventSources(); //obligatory
      this.calendarApi.addEventSource(this.calendarEvents); //obligatory
   }

   //to go to a specific date the user chose
   gotoDate(data: Date) {
      //the if condition is to prevent possible error
      if (this.calendarApi) {
         this.calendarApi.gotoDate(data);
         localStorage.setItem('DataPlanner', JSON.stringify(data));
         //this.scroll = document.querySelector('.fc-scrollgrid-section').scrollTop;
         //this.prelevaDati(this.calendarApi.currentData.currentDate, this.calendarApi.currentData.currentDate);
      }
   }

   cambiaGiorno(direzione: string) {
      const element = document.querySelector('.fc-scrollgrid-section-liquid .fc-scroller');
      if (element) {
         this.scroll = element.scrollTop;
      }
      if (direzione === 'avanti') {
         this.dataCorrente = new Date(this.dataCorrente.setDate(this.dataCorrente.getDate() + 1));
      } else if (direzione === 'indietro') {
         this.dataCorrente = new Date(this.dataCorrente.setDate(this.dataCorrente.getDate() - 1));
      } else if (direzione === '') {
         this.dataCorrente = new Date();
      }
      this.gotoDate(this.dataCorrente);
   }

   weeklyEndDate: Date;

   cambiaSettimana(direzione: string) {
      const element = document.querySelector('.fc-scrollgrid-section-liquid .fc-scroller');
      if (element) {
         this.scroll = element.scrollTop;
      }
      if (direzione === 'avanti') {
         const start = moment(this.calendarApi.view.currentStart).add(7, 'days').toDate();
         const end = moment(this.calendarApi.view.currentEnd).add(7, 'days').toDate();
         this.calendarApi.setOption('visibleRange', {
            start: start,
            end: end
         });
         console.log('avanti')
         this.gotoDate(start);

      } else if (direzione === 'indietro') {
         const start = moment(this.calendarApi.view.currentStart).subtract(7, 'days').toDate();
         const end = moment(this.calendarApi.view.currentEnd).subtract(7, 'days').toDate();
         this.calendarApi.setOption('visibleRange', {
            start: start,
            end: end
         });
         this.gotoDate(start);
      } else if (direzione === '') {
         this.dataCorrente = new Date();
         this.gotoDate(this.dataCorrente);
      }
      this.calendarApi.render();
      this.weeklyEndDate = moment(this.calendarApi.view.currentEnd).subtract(1, 'days').toDate();


   }

   openDialog() {
      const dialogRef = this.dialog.open(InfoClick);

      dialogRef.afterClosed().subscribe(result => {
         //console.log(`Dialog result: ${result}`);
         this.fullcalendar.getApi().unselect();
      });
   }

   horizontalPosition: MatSnackBarHorizontalPosition = 'start';
   verticalPosition: MatSnackBarVerticalPosition = 'top';

   openSnackBar(testo: string) {
      this._snackBar.open(testo, 'x', {
         duration: 1500,
         horizontalPosition: this.horizontalPosition,
         verticalPosition: this.verticalPosition,
      });
   }

   openDatePicker() {
      this.picker.open();
   }
   updateDate(event) {
      this.dataCorrente = moment(event.value, 'dd/MM/yyyy').toDate();
      this.gotoDate(this.dataCorrente);
   }

   resetDatiPrefissati() {
      localStorage.setItem('IdCollaboratorePrefissato', '');
      localStorage.setItem('OraPrefissata', '');
   }



   back() {
      localStorage.setItem('DataPlanner', '');
      this.loc.back();
   }

   logout() {
      this.auth.logOut();
   }

}
