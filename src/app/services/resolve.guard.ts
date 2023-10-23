import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataService} from "./data.service";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class ResolveGuard implements Resolve<string>{
  constructor(private dataService: DataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.dataService.getData();
  }
}
