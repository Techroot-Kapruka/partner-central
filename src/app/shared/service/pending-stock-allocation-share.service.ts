import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class PendingStockAllocationShareService {

  private dataArraySubject = new BehaviorSubject<any[]>([]);
  dataArray$ = this.dataArraySubject.asObservable();

  setDataArray(dataArray: any[]) {
    this.dataArraySubject.next(dataArray);
  }
  constructor() { }
}
