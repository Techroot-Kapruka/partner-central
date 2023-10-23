import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  SERVER = '';

  constructor(private http: HttpClient) {
    this.SERVER = environment.baseURL;
  }

  uploardFile(file: File , partnerId): Observable<any> {

    const formData: FormData = new FormData();
    const userName = sessionStorage.getItem('contactPersonName');
    formData.append('file', file);
    formData.append('fileName', userName);

    // return this.http.post<any>(this.loginUrl3, formData);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'amazonS3/file/upload', formData, { headers });
  }
  uploardFileExcel(file: File , partnerId): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('vendorId', partnerId);

    // return this.http.post<any>(this.loginUrl3, formData);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
    return this.http.post<any>(this.SERVER + 'Excel/readExcel', formData, { headers });
  }
  saveBulk(tableArray: any[]): Observable<any>{
  const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('jwtToken'));
  return this.http.post<any>(this.SERVER + 'Excel/saveProductFromBulk', tableArray, { headers });
}
}
