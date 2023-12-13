import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';
import {OrderService} from '../../shared/service/order.service';
import {NgZone} from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class OrderMethods {

  SERVER = '';

  constructor(private httpClient: HttpClient, private orderService: OrderService, private zone: NgZone) {
    this.SERVER = environment.baseURL;
  }

  findRealStatus(shipStatus, status, purchaseApprovalID) {
    try {
      let realStatus = status;
      if (purchaseApprovalID !== 'NA') {
        realStatus = 'READY TO SHIP';
      }
      if (shipStatus === 'Shipped') {
        realStatus = 'SHIPPED';
      } else if (shipStatus === 'Shipment Received') {
        realStatus = 'SHIPMENT RECEIVED';
      }
      return realStatus;
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }
}
