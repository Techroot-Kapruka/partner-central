import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderShareService {

  private dataArraySubject = new BehaviorSubject<any[]>([]);
  dataArray$ = this.dataArraySubject.asObservable();

  setDataArray(dataArray: any[]) {
    this.dataArraySubject.next(dataArray);
  }
  constructor() { }
}
