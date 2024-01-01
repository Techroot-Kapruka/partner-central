import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  SERVER = '';

  constructor(private httpClient: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  callPaymentEndpoint(resArr: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'payment/purchaseInvoices_byBusinessName', resArr, { headers });
  }
  getPaymentByBussiness(resArr: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'payment/purchaseInvoices_byBusinessName', resArr, { headers });
  }
  getVendorWisePaymentList(obj){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'payment/getVendorWisePaymentList', obj, { headers });
  }
  saveVendorWithdrawalDetails(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'payment/saveVendorWithdrawalDetails', payloard, {headers});
  }
  getVendorWiseWithdrawalsList(obj){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'payment/getVendorWithdrawalRequest', obj, { headers });
  }
  getvendorWithdrawalDetails(){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'payment/getvendorWithdrawalDetails',  { headers });
  }
}
