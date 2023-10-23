import { HTTP_INTERCEPTORS, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {catchError, timeout} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('bearerToken');

    if (token) {
      const authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });

      // Set the token expiration time in milliseconds (e.g., 30 minutes)
      const tokenExpirationTimeMs = 60 * 1000;

      return next.handle(authReq).pipe(
        timeout(tokenExpirationTimeMs),
        catchError(error => {
          if (error.name === 'TimeoutError') {
            // Token has expired, redirect to login page
            this.router.navigate(['auth/login']).then(r => true);
            return throwError('Token expired');
          }
          return throwError(error);
        })
      );
    }

    return next.handle(req);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
