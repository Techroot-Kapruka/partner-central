
import {delay} from 'rxjs/internal/operators';
import {of} from 'rxjs';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getData(){
    return of('WebTechTalk').pipe(delay(1500));
  }
}
