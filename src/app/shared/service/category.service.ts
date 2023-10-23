import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  SERVER = '';

  constructor(private http: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  saveCategory(data: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'category/save', data, {headers});
    // return this.http.post<any>(this.SERVER + 'category/save', data, [this]);
  }

  getAllCategory(sendData: any) {
    // return this.http.post<any>(this.loginUrl34, sendData);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'category/getIdList', sendData, {headers});
  }

  saveSubCategory(subCatData: any) {
    // return this.http.post<any>(this.loginUrl3, subCatData);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'category/save', subCatData, {headers});
  }

  LatestCategoryGet() {
    // return this.http.post<any>(this.loginUrl3, subCatData);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.get<any>(this.SERVER + 'category/takeCategories', {headers});
  }

  UpdateCategory(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'category/editCategory', payLoard, {headers});
  }

  getCategoryForEdit() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.get<any>(this.SERVER + 'category/takeSubCategories', {headers});
  }

  updateSubCategory(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'category/editCategory', payLoard, {headers});
  }

  getSubSubSubCategoryForEdit() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.get<any>(this.SERVER + 'category/takeSubSubSubCategories', {headers});
  }

  getSubSubCategoryFOrEdit() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.get<any>(this.SERVER + 'category/takeSubSubCategories', {headers});
  }
  getCategoryByCorePartnerId(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'partner/takePartnerCategoryByPartnerIdAndPCategoryCode', payLoard, {headers});
  }

  callMakeYourCategoryRequest(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'partner/updatePartnerCategory', payLoard, {headers});
  }

  categoryAdminRequest(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'categoryprivilege/updateCategoryForManagers', payLoard, {headers});
  }

  getPendingCategoryByPartner(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'partner/takePartnerCategoryNoneApproved', payLoard, {headers});
  }

  getPendingCategoryByCategoryManager(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'categoryprivilege/takePendingCategory', payLoard, {headers});
  }

  getApprovedCategoryByCategoryManager(payLoard: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'categoryprivilege/takeApprovedCategory', payLoard, {headers});
  }

  deletePendingCategoryByPartner(payLoard: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'partner/deleteNonApprovedPartnerCategory', payLoard, {headers});
  }

  deletePendingCategoryByUser(payLoard: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'categoryprivilege/removePendingCategory', payLoard, {headers});
  }

  getAllCategoriesDetails(){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.get<any>(this.SERVER + 'category/getAllCategoriesDetails', {headers});
  }

  getCategoryByCode(payload: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'category/takeCategory', payload , {headers});
  }

  searchByPath(payload: any){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'category/searchByKeyword', payload , {headers});
  }
}
