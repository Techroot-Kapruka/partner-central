import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsProductService {

  SERVER = '';


  constructor(private httpClient: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  getSumProductViewTotal(object: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'analyticsProduct/getSumProductViewTotal', object, {headers});
  }

  getSumProductAddToCart(object: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'analyticsProduct/getSumProductAddToCart', object, {headers});
  }

  getSumProductOrderTotal(object: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'analyticsProduct/getSumProductOrderTotal', object, {headers});
  }

  getListProductView(object: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'analyticsProduct/getProductViewList', object, {headers});
  }


}
