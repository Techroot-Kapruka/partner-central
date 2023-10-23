import { Component, OnInit } from '@angular/core';
import {HttpClientService} from '../../../shared/service/http-client.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  public passwordErrorMessage = '';
  public alert = false;
  public message = '';
  public errAlert = false;
  public OnetimeClicked = false;
  public userEmail = '';

  constructor(private httpClientService: HttpClientService, private router: Router) {
    this.userEmail = sessionStorage.getItem('sessionEmail');

  }
  ngOnInit(): void {
  }
  saveNewPassword(){
    let ispasswordValid = false;
    let isConfirmPasswordValid = false;
    let isEmpty = false;
    let passwordTxt = (document.getElementById('password') as HTMLInputElement).value;
    let obj = {
      userName : this.userEmail,
      password : passwordTxt
    };
    ispasswordValid = this.checkPasswordValidate();
    isConfirmPasswordValid = this.checkConfirmPassword();
    isEmpty = this.checkEmptyField();
    if (isEmpty) {
      if (ispasswordValid){
        if (isConfirmPasswordValid){
          this.httpClientService.newPassword(obj).subscribe(
            data => this.manageUser(data),
            error => this.manageUserError(error)
          );
          this.OnetimeClicked  = true;
        }else {
          Swal.fire(
            'Whoops...!',
            'Password Not Match.',
            'error'
          );
        }
      } else {
        Swal.fire(
          'Whoops...!',
          'Password must contains at least one letter & one digit & minimum 8 characters',
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

  manageUser(data) {
    if (data.status_code === 200) {
      this.alert = true;
      this.message = data.message;
      (document.getElementById('password') as HTMLInputElement).value = '';
      (document.getElementById('confirmPassword') as HTMLInputElement).value = '';
      document.getElementById('password').style.borderColor = 'green';
      document.getElementById('confirmPassword').style.borderColor = 'green';
      let url = '/auth/login';
      this.router.navigate([url]);
      Swal.fire(
        'Good job',
        data.message,
        'success',
      );
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

  manageUserError(error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops....',
      text: error.error.error,
    });
  }

  checkPasswordValidate() {
    let validPassword = false;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const hasLetters = /[a-z]/.test(password);
    const hasCapitalLetters = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[-#$.%@*]/.test(password);

    let errorMessage = '';

    if (!hasLetters) {
      errorMessage += '* At least one letter' +'\n';
    }
    if (!hasNumber) {
      errorMessage += '*At least one number\n';
    }
    // if (!hasSpecialCharacter) {
    //   errorMessage += '*At least one special character\n';
    // }
    if (password.length < 8) {
      errorMessage += '*At least 8 characters long';
    }

    if (hasLetters && hasNumber && password.length >= 8) {
      document.getElementById('password').style.borderColor = 'green';
      validPassword = true;
      this.passwordErrorMessage = ''; // Clear the error message if valid
    } else {
      document.getElementById('password').style.borderColor = 'red';
      this.passwordErrorMessage = errorMessage; // Set the error message
    }
    return validPassword;
  }
  checkConfirmPassword() {
    let isConfirmPassword = false;
    const passwordConform = (document.getElementById('confirmPassword') as HTMLInputElement).value;
    const passwordc = (document.getElementById('password') as HTMLInputElement).value;

    if (passwordc === passwordConform) {
      document.getElementById('confirmPassword').style.borderColor = 'green';
      isConfirmPassword = true;
    } else {
      document.getElementById('confirmPassword').style.borderColor = 'red';
      isConfirmPassword = false;
      Swal.fire(
        'Whoops...!',
        'Password not match',
        'error'
      );
    }

    return isConfirmPassword;
  }
  checkEmptyField() {
    let isVEmpty = false;
    let password = (document.getElementById('password') as HTMLInputElement).value;
    let confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    if (password !== '' && confirmPassword !== '') {
      isVEmpty = true;
    } else {
      isVEmpty = false;
    }

    return isVEmpty;
  }
}
