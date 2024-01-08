import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})


export class OrderService {

  SERVER = '';

  constructor(private httpClient: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  sendOrders(resArr: any) {
    // return this.httpClient.post<any>(this.loginUrl, resArr);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/viewOrdersByUniquePartner', resArr, {headers});
  }

  sendODOrders(resArr: any) {
    // return this.httpClient.post<any>(this.loginUrl, resArr);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/viewODOrdersByUniquePartner', resArr, {headers});
  }


  getPartnerAll() {
    // return this.httpClient.get<any>(this.loginUrl2);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'partner/viewAllPartnersBusinessName', {headers});
  }

  getSelectedPartnerOrders(data: any) {
    // return this.httpClient.post<any>(this.loginUrl3, data);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/viewOrderByUniqueBusinessName', data, {headers});
  }

  getSelectedOrder(id, part_code) {
    const formData: FormData = new FormData();
    formData.append('order_id', id);
    formData.append('partner_id ', part_code);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/orderById', formData, {headers});
  }

  getLimitedOrders(pageNo, businessName: any, names, searchDate, searchDate2,userRole) {
    console.log(searchDate)
    const formData: FormData = new FormData();
    let part_id = sessionStorage.getItem('partnerId');
    formData.append('pageNo', pageNo);
    formData.append('partner_u_id ', businessName);
    if (searchDate !== null){
      formData.append('searchDate ', searchDate);
      formData.append('searchDate2 ', searchDate2);
    }
    formData.append('userRole ', userRole);
    // formData.append('names ', 'pizzahut');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/ordersByPrefixInPage', formData, {headers});
  }

  ordersODByPrefixInPage(pageNo, businessName: any, names) {
    const formData: FormData = new FormData();
    let part_id = sessionStorage.getItem('partnerId');
    formData.append('pageNo', pageNo);
    formData.append('partner_u_id ', businessName);
    // formData.append('names ', 'pizzahut');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/ordersODByPrefixInPage', formData, {headers});
  }

  getShipmentStatus(payload){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/getODShipmentStatus', payload, {headers});
  }

  generateQRCode(productCode, pnRefNo: any){
    const formData: FormData = new FormData();
    formData.append('productCode', productCode);
    formData.append('pnRefNo', pnRefNo);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/generateProQRCode', formData, {headers});
  }

  getOrderDetails(fromDate, toDate){
    const formData: FormData = new FormData();
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    formData.append('from_date', fromDate);
    formData.append('to_date', toDate);
    return this.httpClient.post<any>(this.SERVER + 'report/supplierOrders', formData, {headers});
  }

  getOrderReport(object){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/orderReport', object, {headers});
  }
}
