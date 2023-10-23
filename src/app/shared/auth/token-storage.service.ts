import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private roles: Array<string> = [];

  constructor(private router: Router) {
  }

  signOut() {
    window.sessionStorage.clear();
  }

  getNewToken() {
    return localStorage.getItem('jwtToken');
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUsername(username: string) {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): string {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public saveAuthorities(authorities: string[]) {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];
    if (sessionStorage.getItem(TOKEN_KEY)) {
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority);
      });
    }
    return this.roles;
  }

  public ifExistsToken(token: any) {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('jwtToken');
    const token_id = sessionStorage.getItem('jwtToken');

    if (token.jwtToken != null) {
      const lengthPree = token.prefixList.length;
      let productPrefix = [];
      for (let i = 0; i < lengthPree; i++) {
        productPrefix.push(token.prefixList[i]);
      }

      if (token_id == null) {
        sessionStorage.setItem('jwtToken', token.jwtToken);
      }
      const partnerId = token.partnerId;
      sessionStorage.setItem('partnerId', partnerId);
      sessionStorage.setItem('productPrefix', JSON.stringify(productPrefix));
      const userId = token.user_id;
      const userRole = token.roles[0].role;
      const businessName = token.businessName;
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('userRole', userRole);
      sessionStorage.setItem('businessName', businessName);
      sessionStorage.setItem('contactPersonName', token.contactPersonName);
      sessionStorage.setItem('temp_code', token.temp_code);
      sessionStorage.setItem('is_verifyOtp', token.is_verifyOtp);
      sessionStorage.setItem('contact_number', token.contactNo);
      // sessionStorage.setItem('user_name', token.contactNo);
      sessionStorage.setItem('email', token.userName);
      sessionStorage.setItem('sessionVal', '0');
      const ur = sessionStorage.getItem(userRole);
      // this.router.navigate(['/dashboard/default']);
      console.log(token.is_verifyOtp);
      if(userRole === 'ROLE_GUEST' && token.is_verifyOtp === 0){
        this.router.navigate(['/user-verification/' + token.user_id]);
      }else if(userRole === 'ROLE_GUEST' && token.is_verifyOtp === 1){
        this.router.navigate(['/users/guest']);
      }else {
        this.router.navigate(['/dashboard/default']);
      }
      // if (userRole === 'ROLE_GUEST') {
      //   this.router.navigate(['/users/guest']);
      // } else {
      //   this.router.navigate(['/dashboard/default']);
      // }
    } else {
      Swal.fire({
        // Kindly await administrative approval to access your account
        icon: 'error',
        title: token.message,
      });
    }
  }
}

