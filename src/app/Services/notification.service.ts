import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

export class NotificationService {
    constructor(private http:HttpClient) { }
    subscribe(subscription:any){
    return this.http.post(window.location.origin + 'subscribe',subscription).pipe(map(res=>res));
    }
    triggerMessage(message){
    return this.http.post(window.location.origin + 'message',JSON.parse(message)).pipe(map(res=>res));
    }
    }