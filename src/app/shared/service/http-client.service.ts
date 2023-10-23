import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  SERVER = '';

  constructor(private httpClient: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  addUser(newUser: any) {
    return this.httpClient.post<any>(this.SERVER + 'users/saveUser', newUser);
    // return this.httpClient.post<any>(this.SERVER + '/partner/uploadNic', newUser);
  }

  resetPassword(newUser: any) {
    return this.httpClient.post<any>(this.SERVER + 'users/resetPassword', newUser);
  }

  newPassword(newUser: any) {
    return this.httpClient.post<any>(this.SERVER + 'users/newPassword', newUser);
  }

  addDeclinedMessage(declinedComment: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/declinedPartnerByAdmin', declinedComment, {headers});
  }

  getAllUsers() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'partner/viewAllPartners', {headers});
  }

  getAllUsersWithoutPartners() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'users/allUserWithoutPartners', {headers});
  }

  getAllPartnersCategoryWise(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/viewAllPartnersCategoryWise', payload, {headers});
  }

  takeNonApprovedUsers() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'partner/unregisteredPartners', {headers});
  }

  getUnregisteredPartnersCategoryWise(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/getUnregisteredPartnersCategoryWise', payload, {headers});
  }

  uploadBankStatement(bsImage: File, ids: any) {
    const formData: FormData = new FormData();
    formData.append('image', bsImage);
    formData.append('temp_code', ids);
    return this.httpClient.post<any>(this.SERVER + 'partner/savePartnerBankStatement', formData);
  }

  makeApproveUsers(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/approvedPartnerByAdmin', payload, {headers});
  }

  getSelectedPartnerById(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/takePartnerByTempCode', payload, {headers});
  }

  uploardImage(images: File, ids: any) {

    const formData: FormData = new FormData();
    // const userName = sessionStorage.getItem('contactPersonName');
    formData.append('image', images);
    formData.append('temp_code', ids);

    // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/savePartnerImages', formData);
  }

  uploadBrImage(brImage: File, ids: any) {
    const formData: FormData = new FormData();
    formData.append('image', brImage);
    formData.append('temp_code', ids);
    return this.httpClient.post<any>(this.SERVER + 'partner/savePartnerBrImage', formData);
  }

  updatePartner(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/updatePartner', payload, {headers});
  }

  uploardPartnerImage(image: any, id: any) {
    const formData: FormData = new FormData();
    formData.append('temp_code', id);
    formData.append('image', image);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/editPartnerImages', formData, {headers});
  }

  takePendingPartnerCategories() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'partner/getPendingPartnerCategories', {headers});
  }

  takePendingManagerCategories() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.get<any>(this.SERVER + 'categoryprivilege/getPendingManagerCategories', {headers});
  }

  getRequestCategories(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/getRequestCategories', payload, {headers});
  }

  makeApproveCategory(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/approvedPartnerCategory', payload, {headers});
  }

  makeApproveManagerCategory(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'categoryprivilege/approvedManagerCategory', payload, {headers});
  }

  getUserOrAdminProfileDetails(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'users/takeAdminUsersByU_Code', payLoard, {headers});
  }

  updateAdmin(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'users/updateUser', payLoard, {headers});
  }

  otpVerify(payLoard: any) {
    // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'users/verifyOtp', payLoard);
  }

  resendOtp(payLoard: any) {
    // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'users/resendOTP', payLoard);
  }

  saveBankDetails(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/saveBankDetails', payLoard, {headers});
  }

  updatePartnerBusinessDetails(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/updatePartnerBusinessDetails', payLoard, {headers});
  }

  uploadPartnerBankStatement(bsImage: File, temp_code: string) {
    const formData: FormData = new FormData();
    formData.append('image', bsImage);
    formData.append('temp_code', temp_code);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/uploadPartnerBankStatement', formData, {headers});
  }

  getVendorAccDetailsById(temp_code: string) {
    const formData: FormData = new FormData();
    formData.append('temp_code', temp_code);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/getVendorAccDetailsById', formData, {headers});
  }

  getPartnerByUserId(payload) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/getPartnerByUid', payload, {headers});
  }

  getBankDetails(payload) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/getPartnerBank', payload, {headers});
  }

  disablingUser(payload: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'users/disableUser', payload, {headers});

  }

  updateStatus(payload) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/updatePartnerStatus', payload, {headers});
  }

  uploadNic(images: File, ids: string) {
    const formData: FormData = new FormData();
    formData.append('image', images);
    formData.append('temp_code', ids);

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.httpClient.post<any>(this.SERVER + 'partner/uploadNic', formData,{headers});
  }
}
