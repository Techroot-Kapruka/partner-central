import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {
  SERVER = '';
  constructor(private httpClient: HttpClient ) {
    this.SERVER = environment.baseURL;
  }

  getAllNotification(resArr: any) {
    // return this.httpClient.post<any>(this.loginUrl, resArr);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'notification/getVendorMessages', resArr, {headers});
  }

}
