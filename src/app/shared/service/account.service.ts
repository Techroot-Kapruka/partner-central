import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  SERVER = '';

  constructor(private http: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  getPoList(payload: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'Erp/getPurchaseOrderBySupplier', payload , {headers});
  }
}
