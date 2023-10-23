import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment.prod';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  SERVER = '';

  constructor(private http: HttpClient, private router: Router) {
    this.SERVER = environment.baseURL;
  }

  send_login(login: any) {
    return this.http.post<any>(this.SERVER + 'authenticate', login);
  }

  getImageByPartner(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'partner/getPartnerProfilePicture', payloard, {headers});
  }
  getImageByPartnerBR(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'partner/getPartnerBR', payloard, {headers});
  }
  getImageByPartnerBankStatement(payloard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'partner/getPartnerBankStatement', payloard, {headers});
  }

  isSessionExpired(): boolean {
    // Implement session expiration logic
    const expirationDate = new Date(sessionStorage.getItem('sessionExpiration'));
    return expirationDate < new Date();
  }

  isTokenValid(jwtToken: string): boolean {
    const tokenParts = jwtToken.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    if (!payload.exp) {
      return false;
    }
    const expirationTime = new Date(payload.exp * 1000);
    const now = new Date();

    if (expirationTime <= now) {
      return false;
    }
    return true;
  }
}
