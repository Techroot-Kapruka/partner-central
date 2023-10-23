import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./shared/auth/auth.service";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const jwtToken = sessionStorage.getItem('jwtToken');
    // if (jwtToken == ''){
    //   this.router.navigate(['auth/login']);
    //   return false;
    // } else {
    //   return true;
    // }

    if (!jwtToken) {
      this.router.navigate(['auth/login']);
      return false;
    } else {
      if (this.authService.isTokenValid(jwtToken)) {
        return true;
      } else {
        Swal.fire({
          title: 'Session Time Out',
          text: 'Please Log Again to continue',
          icon: 'info',
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['auth/login']);
            return false;
          }
        });
      }
    }
  }
}
