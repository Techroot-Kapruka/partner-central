import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class ShipmentNewService {

  SERVER = '';

  constructor(private httpClient: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  searchProductGet(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/viewProductForShipment', payLoard, {headers});
  }

  saveShipment(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/saveShipment', payLoard, {headers});
  }

  HoldShipment(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/holdShipment', payLoard, {headers});
  }

  getAllTakeShippedShipment() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'shipment/takeShippedShipment', {headers});
  }

  getAllTakeHoldShipment() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'shipment/takeHoldShipment', {headers});
  }

  getShipmentUsingId(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/takeShipmentByShipmentId', payLoard, {headers});
  }

  unHoldAndsaveShipment(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/updateHoldShipment', payLoard, {headers});
  }

  getShipmentReceived(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/noteAsReceivedShipment', payLoard, {headers});
  }

  getShipmentReceivedWithRejected(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/rejectedShipmentItem', payLoard, {headers});
  }

  getAllTakeHoldShipment22(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/takeHoldShipmentByVendor', payLoard, {headers});
  }

  takeReceivedShipmentByVendorId(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/takeReceivedShipmentByVendor', payLoard, {headers});
  }

  getShipmentByVendorId(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/takeShippedShipmentByVendor', payLoard, {headers});
  }

  getRecivedShipmentByVendorId(payLoard: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/takeReceivedShipmentByVendor', payLoard, {headers});
  }

  takeReceivedShipment(){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'shipment/takeReceivedShipment', {headers});
  }

  generateQRCode(data: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/generateQRCode', data, {headers});
  }

  updateShipmentItemsIsPriceChange(data: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/updateIsPriceChange', data, {headers});
  }

  getShipmentDetails(fromDate, toDate){
    const formData: FormData = new FormData();
    formData.append('fromDate', fromDate);
    formData.append('toDate ', toDate);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'shipment/getShipmentDetails', formData, {headers});
  }
}
