import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.prod";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PriceChangeService {

  SERVER = '';

  constructor(private httpClient: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  getAllPendingApprovalPriceChangeListByVendor(payLoard: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'priceChange/getAllPendingApprovalPriceChangeListByVendor', payLoard, {headers});
  }

  approvedChangePrice(payLoard: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'priceChange/approvedChangePrice', payLoard, {headers});
  }

  getAllTakeChangeProductPriceList() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'priceChange/getAllPendingApprovalPriceChangeList', {headers});
  }

  changeSellingPrice(payLoad: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'priceChange/changeSellingPrice', payLoad, {headers});
  }
}
