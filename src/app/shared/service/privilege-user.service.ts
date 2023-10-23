import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeUserService {

  SERVER = '';

  constructor(private http: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  viewAllPrivilegeItem() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.get<any>(this.SERVER + 'privilege/viewAllPrivilegeItem', {headers});
  }

  privilegeUserSave(payLoard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'privilege/addPrivilege', payLoard, {headers});
  }

  privilegeUserUpdate(payLoard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'privilege/updatePrivilege', payLoard, {headers});
  }

  getDetails(payloard) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'privilege/viewAllPrivilegesByPartner', payloard, {headers});
  }
  privilegeUserGet(){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.get<any>(this.SERVER + 'users/getAdminUsers', {headers});
  }
  privilegeUserSubmit(payloard){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'users/saveAdmin_UserPrivilege', payloard, {headers});
  }

  privilegeUserAdminUpdate(payloard){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'users/updateUserPrivilege', payloard, {headers});
  }
}
