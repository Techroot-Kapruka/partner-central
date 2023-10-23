import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {HttpClientService} from '../../../shared/service/http-client.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public alert = false;
  public errAlert = false;
  public message = '';
  public OnetimeClicked = false;

  constructor(private httpClientService: HttpClientService, private router: Router) { }

  ngOnInit(): void {
  }

  resetPassword(){
    let isEmailValid = false;
    let isEmptyField = false;
    const email = (document.getElementById('txtEmail') as HTMLInputElement).value;
    sessionStorage.setItem('sessionEmail', email);
    const obj = {
      userName : email
    };
    isEmailValid = this.checkValidate();
    isEmptyField = this.checkEmptyField();

    if (isEmptyField) {
      if (isEmailValid) {
        this.httpClientService.resetPassword(obj).subscribe(
          data => this.manageUser(data),
          error => this.manageUserError(error)
        );
        this.OnetimeClicked  = true;
      }else {
        Swal.fire(
          'Whoops...!',
          'Invalid Email',
          'error'
        );
      }
    }else {
      Swal.fire(
        'Whoops...!',
        'Please fill all fields',
        'error'
      );
    }
  }

  checkValidate() {

    let validEmail = false;
    let email = (document.getElementById('txtEmail') as HTMLInputElement).value;

    // const emailPartner = (document.getElementById('email') as HTMLInputElement).value;
    const partnerRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const partnerResult = partnerRegex.test(email);
    if (partnerResult) {
      document.getElementById('txtEmail').style.borderColor = 'green';
      document.getElementById('distext').style.display = 'none';
      validEmail = true;
    } else {
      document.getElementById('txtEmail').style.borderColor = 'red';
      document.getElementById('distext').style.display = 'block';
      validEmail = false;

    }
    return validEmail;
  }

  checkEmptyField() {
    let isVEmpty = false;
    let email = (document.getElementById('txtEmail') as HTMLInputElement).value;

    if (email != '') {
      isVEmpty = true;
    } else {
      isVEmpty = false;
    }

    return isVEmpty;
  }

  manageUserError(error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.error.error,
    });
  }
  manageUser(data) {
    if (data.status_code === 200) {
      if (data.message === 'Email Address Invalid.') {
        document.getElementById('txtEmail').style.borderColor = 'red';
        Swal.fire(
          'Whoops...!',
          data.message,
          'error'
        );
      }
      this.alert = true;
      this.message = data.message;
      let url = '/password-verification/' + data.data.user_u_id;
      this.router.navigate([url]);
    }else {
      this.alert = false;
      this.errAlert = true;
      Swal.fire(
        'Whoops ...',
        data.message,
        'error'
      );
    }
  }

}
