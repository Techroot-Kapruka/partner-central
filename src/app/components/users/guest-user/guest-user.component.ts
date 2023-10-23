import {Component, OnInit} from '@angular/core';
import {HttpClientService} from "../../../shared/service/http-client.service";
import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {window} from "rxjs/internal/operators";

@Component({
  selector: 'app-guest-user',
  templateUrl: './guest-user.component.html',
  styleUrls: ['./guest-user.component.scss']
})
export class GuestUserComponent implements OnInit {

  public passwordErrorMessage = '';
  public alert = false;
  public message = '';
  public errAlert = false;
  public OnetimeClicked = false;

  public type = 'password';
  public type2 = 'password';

  public eyeIcon = 'fa fa-fw fa-eye-slash field-icon';
  public eyeIcon2 = 'fa fa-fw fa-eye-slash field-icon';

  constructor(private httpClientService: HttpClientService, private router: Router) {
  }

  ngOnInit(): void {
  }


  saveGuest() {
    let isEmailValid = false;
    let ispasswordValid = false;
    let isConfirmPasswordValid = false;
    let isEmpty = false;
    let contactPersonName = (document.getElementById('contactPersonName') as HTMLInputElement).value + ' ' + (document.getElementById('contactPersonLastName') as HTMLInputElement).value;
    let contactNumber = (document.getElementById('contactNumber') as HTMLInputElement).value;
    let email = (document.getElementById('email') as HTMLInputElement).value;
    let userName = (document.getElementById('email') as HTMLInputElement).value;
    let password = (document.getElementById('password') as HTMLInputElement).value;
    let countryCode = (document.getElementById('countryCode') as HTMLInputElement).value;
    sessionStorage.setItem('sessionEmail', email);
    let obj = {
      contactPersonName: contactPersonName,
      userName: userName,
      email: email,
      contactNo: countryCode+contactNumber,
      password: password,
      role: ["Guest"]
    };

    isEmailValid = this.checkValidate();
    ispasswordValid = this.checkPasswordValidate();
    isConfirmPasswordValid = this.checkConfirmPassword();
    isEmpty = this.checkEmptyField();
    console.log(obj);
    if (isEmpty) {
      if (isEmailValid) {
        if (ispasswordValid) {
          if (isConfirmPasswordValid) {
            this.httpClientService.addUser(obj).subscribe(
              data => this.manageUser(data),
              error => this.manageUserError(error)
            );
            this.OnetimeClicked  = true;
          }
        } else {
          Swal.fire(
            'Whoops...!',
            'Password must contains at least one letter & one digit & minimum 8 characters',
            'error'
          );
        }
      } else {
        Swal.fire(
          'Whoops...!',
          'Invalid Email',
          'error'
        );
      }
    } else {

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
      if (data.message === 'Error : Username and E-mail are already taken!') {
        document.getElementById('userName').style.borderColor = 'red';
        document.getElementById('email').style.borderColor = 'red';
        Swal.fire(
          'Whoops...!',
          data.message,
          'error'
        );
      } else if (data.message === 'Error : Username is already taken!') {
        document.getElementById('userName').style.borderColor = 'red';
        document.getElementById('userName').style.borderColor = 'green';
        Swal.fire(
          'Whoops...!',
          data.message,
          'error'
        );
      } else if (data.message === 'Error : E-mail is already taken!') {
        document.getElementById('email').style.borderColor = 'red';
        document.getElementById('email').style.borderColor = 'green';

        Swal.fire(
          'Whoops...!',
          data.message,
          'error'
        );
      } else {

        (document.getElementById('contactPersonName') as HTMLInputElement).value = '';
        (document.getElementById('contactNumber') as HTMLInputElement).value = '';
        (document.getElementById('email') as HTMLInputElement).value = '';
        (document.getElementById('password') as HTMLInputElement).value = '';
        (document.getElementById('reEnterPassword') as HTMLInputElement).value = '';

        document.getElementById('contactPersonName').style.borderColor = 'green';
        document.getElementById('contactNumber').style.borderColor = 'green';
        document.getElementById('email').style.borderColor = 'green';
        document.getElementById('password').style.borderColor = 'green';
        document.getElementById('reEnterPassword').style.borderColor = 'green';
        if (data.status_code == 200) {
          let url = '/user-verification/' + data.data.user_u_id;
          this.router.navigate([url]);
        } else {
          Swal.fire(
            'Whoops...',
            data.message,
            'error'
          );
        }
      }

    } else {
      this.alert = false;
      this.errAlert = true;
      Swal.fire(
        'Whoops ...',
        data.message,
        'error'
      );
    }
  }

  // checkPasswordValidate() {
  //   let validPassword = false;
  //
  //   const password = (document.getElementById('password') as HTMLInputElement).value;
  //
  //   // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  //   const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\@\*])(?=.*[a-zA-Z]).{8,16}$/;
  //   const passwordResult = passwordRegex.test(password);
  //   // let ret04 = false;
  //   if (passwordResult) {
  //     document.getElementById('password').style.borderColor = 'green';
  //     // document.getElementById('distext').style.display = 'none';
  //     validPassword = true;
  //   } else {
  //     document.getElementById('password').style.borderColor = 'red';
  //     validPassword = false;
  //     Swal.fire(
  //       'Whoops...!',
  //       'Password At least one letter / At least one digit/Minimum length of 8 characters',
  //       'error'
  //     );
  //   }
  //   return validPassword;
  // }

  checkPasswordValidate() {
    let validPassword = false;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const reg=/^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (reg.test(password)) {
      document.getElementById('password').style.borderColor = 'green';
      validPassword = true;
      this.passwordErrorMessage = ''; // Clear the error message if valid
    } else {
      document.getElementById('password').style.borderColor = 'red';
      this.passwordErrorMessage = 'Password must contain at least one letter, one digit & minimum 8 characters';
      // Set the error message
    }
    return validPassword;
  }



  checkConfirmPassword() {
    let isConfirmPassword = false;
    const passwordConform = (document.getElementById('reEnterPassword') as HTMLInputElement).value;
    const passwordc = (document.getElementById('password') as HTMLInputElement).value;

    if (passwordc === passwordConform) {
      if (passwordc !=''&& passwordConform!=''){
        document.getElementById('reEnterPassword').style.borderColor = 'green';
        isConfirmPassword = true;
      }
    } else {
      document.getElementById('reEnterPassword').style.borderColor = 'red';
      isConfirmPassword = false;
      Swal.fire(
        'Whoops...!',
        'Password not match',
        'error'
      );
    }

    return isConfirmPassword;
  }

  manageUserError(error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.error.error,
    });
  }

  checkEmptyField() {
    let isVEmpty = false;
    let contactPersonName = (document.getElementById('contactPersonName') as HTMLInputElement).value;
    let contactPersonLastName = (document.getElementById('contactPersonLastName') as HTMLInputElement).value;
    let contactNumber = (document.getElementById('contactNumber') as HTMLInputElement).value;
    let email = (document.getElementById('email') as HTMLInputElement).value;
    let userName = (document.getElementById('email') as HTMLInputElement).value;
    let password = (document.getElementById('password') as HTMLInputElement).value;
    let rePassword = (document.getElementById('reEnterPassword') as HTMLInputElement).value;

    if (contactPersonName != '' && contactNumber != '' && userName != '' && password != '' && rePassword != '' && email!='') {
      isVEmpty = true;
    }
    if(contactPersonName ==''||!contactPersonName.match( /^[a-zA-Z ]+$/)){
      document.getElementById('contactPersonName').style.borderColor = 'red';
      isVEmpty = false;
    }else{
      document.getElementById('contactPersonName').style.borderColor = 'green';
    }

    if(contactPersonLastName=='' || !contactPersonLastName.match(/^[a-zA-Z ]+$/)){
      document.getElementById('contactPersonLastName').style.borderColor = 'red';
      isVEmpty = false;
    }else{
      document.getElementById('contactPersonLastName').style.borderColor = 'green';
    }

    if(contactNumber==''||!contactNumber.match(/^\d{9}$/)){
      document.getElementById('contactNumber').style.borderColor = 'red';
      isVEmpty = false;
    }else {
      document.getElementById('contactNumber').style.borderColor = 'green';
    }
    if(email==''){
      document.getElementById('email').style.borderColor = 'red';
      isVEmpty = false;
    }
    if(password==''){
      document.getElementById('password').style.borderColor = 'red';
      isVEmpty = false;
    }
    if(rePassword==''){
      document.getElementById('reEnterPassword').style.borderColor = 'red';
      isVEmpty = false;
    }
    return isVEmpty;
  }

  removezero(event){
    const inputValue = (document.getElementById('contactNumber') as HTMLInputElement).value;
    if (event.key === '0' && inputValue.length === 0) {
      // Prevent '0' from being added as the first character
      event.preventDefault();
    }
  }

  checkValidate() {

    let validEmail = false;
    let email = (document.getElementById('email') as HTMLInputElement).value;


    // const emailPartner = (document.getElementById('email') as HTMLInputElement).value;
    const partnerRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const partnerResult = partnerRegex.test(email);
    if (partnerResult) {
      document.getElementById('email').style.borderColor = 'green';
      // document.getElementById('distext').style.display = 'none';
      validEmail = true;
    } else {
      document.getElementById('email').style.borderColor = 'red';
      // document.getElementById('distext').style.display = 'block';
      validEmail = false;

    }
    return validEmail;
  }

  toggle() {
    if (this.type == 'password') {
      this.type = 'text';
      this.eyeIcon = 'fa fa-fw fa-eye field-icon';
    } else {
      this.type = 'password';
      this.eyeIcon = 'fa fa-fw fa-eye-slash field-icon';
    }
  }

  toggle2() {
    if (this.type2 == 'password') {
      this.type2 = 'text';
      this.eyeIcon2 = 'fa fa-fw fa-eye field-icon';
    } else {
      this.type2 = 'password';
      this.eyeIcon2 = 'fa fa-fw fa-eye-slash field-icon';
    }
  }

pwFunction() {
  const passwordField: HTMLInputElement | null = document.getElementById('password') as HTMLInputElement;
  const passwordHint: HTMLSpanElement | null = document.querySelector('.password-hint') as HTMLSpanElement;
  const hintIcon: HTMLElement | null = document.querySelector('.hint-icon') as HTMLElement;

  if (passwordField && passwordHint && hintIcon) {
    // Show the password hint when the hint icon is clicked
    hintIcon.addEventListener('click', () => {
      passwordHint.style.display = 'block';
    });

    // Hide the password hint when clicking outside of it
    document.addEventListener('click', (event) => {
      if (!passwordHint.contains(event.target as Node) && event.target !== hintIcon) {
        passwordHint.style.display = 'none';
      }
    });

    // Real-time password validation
    passwordField.addEventListener('input', () => {
      const password: string = passwordField.value;

      // Define your password validation conditions here
      const hasCapitalLetter: boolean = /[A-Z]/.test(password);
      const hasNumber: boolean = /\d/.test(password);
      const hasSpecialCharacter: boolean = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
      const isLengthValid: boolean = password.length >= 8;

      // Check conditions and update the hint message accordingly
      if (hasCapitalLetter && hasNumber && hasSpecialCharacter && isLengthValid) {
        passwordHint.textContent = 'Password is valid';
        passwordHint.style.color = 'green';
      } else {
        passwordHint.textContent = 'Password must meet the criteria';
        passwordHint.style.color = 'red';
      }
    });
  }

}

}
