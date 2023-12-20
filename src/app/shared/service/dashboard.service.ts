import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  SERVER = '';


  constructor(private httpClient: HttpClient) {
    this.SERVER = environment.baseURL;
  }


  getAllOrderCount() {
    const data = {
      businessName: 'ChamalCompany'
    };
    // return this.httpClient.post<any>(this.orderCount, data);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/orderCountByBusinessName', data, {headers});
  }

  getPartnerCount(data: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'partner/partnerCount', {headers});

  }

  getPartnerCountCatWise(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/getPartnerCountCatWise', payloard, {headers});
  }

  getApprovalPendingPartnerCount(data: any) {
    const role = sessionStorage.getItem('userRole');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'partner/pendingApprovelPartnerCount', {headers});
  }

  getReceivedShipmentCount(businessName, UserID) {
    // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    // return this.httpClient.get<any>(this.SERVER + 'shipment/getRecevivedShipmentCount', {headers});

    const formData: FormData = new FormData();
    formData.append('businessName', businessName);
    formData.append('categoryUID ', UserID);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/getRecevivedShipmentCount', formData, {headers});
  }

  getPendingShipmentCount() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'shipment/getPendingApprovelShipmentCount', {headers});
  }

  getPendingShipmentCountCatWise() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'shipment/getPendingApprovelShipmentCountCatWise', {headers});
  }

  getLatestFiveOrder(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/latestOrdersDetails', payloard, {headers});
  }

  getLatestFiveOrderAsAdmin(payloard: any) {
    // return this.httpClient.post<any>(this.loginUrl8, payloard);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/latestOrdersDetails', payloard, {headers});
  }

  getSpecialGiftCount() {
    // return this.httpClient.get<any>(this.secilaGift);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'product/allProductCount', {headers});
  }

  getSpecialGiftCountByPartner(data: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/partnerProductCount', data, {headers});
  }

  getSpecialGiftCountByCatManager(data: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/catManagerWiseProductCount', data, {headers});
  }

  getOrderCountByAdmin() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'orders/fullOrderCount', {headers});
  }

  getOrderCountByBusinessName(data: any) {
    // return this.httpClient.post<any>(this.orderCount, data);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'orders/orderCountByPartner', data, {headers});
  }

  getApprovelPendingProductCount() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'product/allPendingApprovelProductCount', {headers});
  }

  getApprovelPendingProductCountCategoryWise(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getApprovelPendingProductCountCategoryWise', payloard, {headers});
  }

  latestProductsAdmin() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'product/latestProducts', {headers});
  }

  latestProductsPartner(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/latestProductByPartner', payloard, {headers});
  }

  getLatesInvoices(payloard: any) {
    const isAdmin = sessionStorage.getItem('userRole');
    if (isAdmin === 'ROLE_PARTNER') {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
      // return this.httpClient.get<any>('http://192.168.16.101:8090/api/partnerCentral/payment/latestInvoices');
      return this.httpClient.post<any>(this.SERVER + 'payment/latestInvoices/bySupplier', payloard, {headers});
    } else if (isAdmin === 'ROLE_ADMIN' || isAdmin === 'ROLE_SUPER_ADMIN') {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
      // return this.httpClient.get<any>('http://192.168.16.101:8090/api/partnerCentral/payment/latestInvoices');
      return this.httpClient.get<any>(this.SERVER + 'payment/latestInvoices', {headers});
    }
  }

  getApprovedPartnerAsLogin(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/takePartnerByPartnerUId', payLoard, {headers});
  }

  getApproveProductCountFormQa(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getQaNotApprovedProductsCount', payLoard, {headers});
  }


  getQaApprovedLatestProductsByQa(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'product/getQaApprovedLatestProducts', payLoard, {headers});
  }

  getShopName(payload) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/getShopName', payload, {headers});
  }

  getWeeklyOrderCount(){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'orders/getWeeklyOrderCount', {headers});
  }
}
