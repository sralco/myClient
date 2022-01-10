import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientiService } from 'src/app/Services/clienti.service';
import { Cliente } from 'src/app/Models/Cliente';
import { Location } from '@angular/common';

@Component({
  selector: 'app-scatta-foto',
  templateUrl: './scatta-foto.component.html',
  styleUrls: ['./scatta-foto.component.scss']
})
export class ScattaFotoComponent implements OnInit {

  flagFoto:boolean = false;

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  private idCliente: string = '';
  public cliente: Cliente;

  constructor(private router: Router, private clientiService: ClientiService, aRoute: ActivatedRoute, private location: Location) {
    this.idCliente = aRoute.snapshot.paramMap.get('id');
    this.cliente = new Cliente();
  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    if (this.idCliente) {
      this.clientiService.getCliente(this.idCliente, null).subscribe(x => {
        this.cliente = x[0];
      }, err => console.error(err));
    }
  }

  public salvaFoto() {
    this.cliente.foto = this.webcamImage.imageAsBase64;
    this.clientiService.salvaFoto(this.cliente).subscribe(x => {
      this.goBack();
    }, err => {
      alert(err);
    })
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.flagFoto = true;
    //this.salvaFoto();
  }

  public scartaFoto(){
    this.flagFoto = false;
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  goBack() {
    this.location.back();
  }
}
