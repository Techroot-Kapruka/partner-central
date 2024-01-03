import {Component, OnInit} from '@angular/core';
import {HttpClientService} from '../../../shared/service/http-client.service';
import Swal from 'sweetalert2';
import {Router, NavigationExtras } from '@angular/router';

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
    let isEmpty = false;
    const contactPersonName = (document.getElementById('contactPersonName') as HTMLInputElement).value + ' ' + (document.getElementById('contactPersonLastName') as HTMLInputElement).value;
    const contactNumber = (document.getElementById('contactNumber') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const userName = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const countryCode = (document.getElementById('countryCode') as HTMLInputElement).value;
    sessionStorage.setItem('sessionEmail', email);
    const obj = {
      contactPersonName,
      userName,
      email,
      contactNo: countryCode + contactNumber,
      password,
      role: ['Guest']
    };

    isEmpty = this.checkEmptyField();

    if (isEmpty) {
      this.httpClientService.addUser(obj).subscribe(
        data => this.manageUser(data),
        error => this.manageUserError(error)
      );
      this.OnetimeClicked = true;
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
      }
      else {

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
          const url = '/user-verification/' + data.data.user_u_id;
          this.router.navigate([url]);
        } else {
          Swal.fire(
            'Whoops...',
            data.message,
            'error'
          );
        }
      }

    }else if(data.status_code===400){
      this.OnetimeClicked = false;
      Swal.fire({
        title: 'Alert',
        text: 'You already have an unverfied account. Do you wish to verfiy it?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          const dataToSend = {
            partiallyRegistered: true
          };
          const url = '/user-verification/' + data.data.user_u_id;
          const navigationExtras: NavigationExtras = {
            queryParams: {
              data: JSON.stringify(dataToSend)
            },
            skipLocationChange: true
          };
          this.router.navigate([url], navigationExtras);
        }
      });
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



  checkPasswordValidate() {
    let validPassword = false;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const reg = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

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


  manageUserError(error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.error.error,
    });
  }

  checkEmptyField() {
    let isVEmpty = false;

    let firstNameValidate = false;
    let lastNameValidate = false;
    let mobileValidate = false;
    let emailValidate = false;
    let passwordValidate = false;
    let rePasswordValidate = false;

    const contactPersonName = (document.getElementById('contactPersonName') as HTMLInputElement).value;
    const contactPersonLastName = (document.getElementById('contactPersonLastName') as HTMLInputElement).value;
    const contactNumber = (document.getElementById('contactNumber') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const rePassword = (document.getElementById('reEnterPassword') as HTMLInputElement).value;

    if (contactPersonName === '') {
      firstNameValidate = false;
      document.getElementById('contactPersonName').style.borderColor = 'red';
      document.getElementById('contactPersonName').style.margin = '0';
      document.getElementById('LblfirstNameError').style.display = 'block';
    } else {
      firstNameValidate = true;
      document.getElementById('contactPersonName').style.borderColor = 'green';
      document.getElementById('contactPersonName').style.marginBottom = '15px';
      document.getElementById('LblfirstNameError').style.display = 'none';
    }

    if (contactPersonLastName === '') {
      lastNameValidate = false;
      document.getElementById('contactPersonLastName').style.borderColor = 'red';
      document.getElementById('contactPersonLastName').style.margin = '0';
      document.getElementById('LblLastNameError').style.display = 'block';
    } else {
      lastNameValidate = true;
      document.getElementById('contactPersonLastName').style.borderColor = 'green';
      document.getElementById('contactPersonLastName').style.marginBottom = '15px';
      document.getElementById('LblLastNameError').style.display = 'none';
    }

    if (contactNumber === '' || !contactNumber.match(/^\d{9}$/)) {
      mobileValidate = false;
      document.getElementById('contactNumber').style.borderColor = 'red';
      document.getElementById('contactDiv').style.marginBottom = '2px';
      document.getElementById('LblMobileError').style.display = 'block';
    } else {
      mobileValidate = true;
      document.getElementById('contactNumber').style.borderColor = 'green';
      document.getElementById('LblMobileError').style.display = 'none';
    }

    if (email === '' || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      emailValidate = false;
      document.getElementById('email').style.borderColor = 'red';
      document.getElementById('email').style.margin = '0';
      document.getElementById('LblEmailError').style.display = 'block';
    } else {
      emailValidate = true;
      document.getElementById('email').style.borderColor = 'green';
      document.getElementById('email').style.marginBottom = '15px';
      document.getElementById('LblEmailError').style.display = 'none';
    }

    if (password === '' || !password.match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)) {
      passwordValidate = false;
      document.getElementById('password').style.borderColor = 'red';
      document.getElementById('password').style.margin = '0';
      document.getElementById('LblPasswordError').style.display = 'block';
    } else {
      passwordValidate = true;
      document.getElementById('password').style.borderColor = 'green';
      document.getElementById('password').style.marginBottom = '15px';
      document.getElementById('LblPasswordError').style.display = 'none';
    }

    if (password === rePassword) {
      if (rePassword === '') {
        rePasswordValidate = false;
        document.getElementById('reEnterPassword').style.borderColor = 'red';
        document.getElementById('reEnterPassword').style.margin = '0';
        document.getElementById('LblConfirmError').style.display = 'block';
      } else {
        rePasswordValidate = true;
        document.getElementById('reEnterPassword').style.borderColor = 'green';
        document.getElementById('reEnterPassword').style.marginBottom = '15px';
        document.getElementById('LblConfirmError').style.display = 'none';
      }
    } else {
      rePasswordValidate = false;
      document.getElementById('reEnterPassword').style.borderColor = 'red';
      document.getElementById('reEnterPassword').style.margin = '0';
      document.getElementById('LblConfirmError').style.display = 'block';
    }


    if (firstNameValidate && lastNameValidate && mobileValidate && emailValidate && passwordValidate && rePasswordValidate ) {
      isVEmpty = true;
    } else {
      isVEmpty = false;
      // Swal.fire(
      //   'Whoops...!',
      //   'Please fill all fields',
      //   'error'
      // );
    }

    return isVEmpty;
  }

  removezero(event) {
    const inputValue = (document.getElementById('contactNumber') as HTMLInputElement).value;
    if (event.key === '0' && inputValue.length === 0) {
      // Prevent '0' from being added as the first character
      event.preventDefault();
    }
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
