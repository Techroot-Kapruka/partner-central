import { Component, OnInit } from '@angular/core';
import {error} from 'protractor';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClientService} from '../../../shared/service/http-client.service';

@Component({
  selector: 'app-password-verification',
  templateUrl: './password-verification.component.html',
  styleUrls: ['./password-verification.component.scss']
})
export class PasswordVerificationComponent implements OnInit {

  public userUid = '';
  public userEmail = '';

  remainingMinutes: number = 2; // Initial minutes
  remainingSeconds: number = 0; // Initial seconds
  interval: any;
  showResendButton: boolean = false;
  showVerifyButton: boolean = true;

  constructor(private _Activatedroute: ActivatedRoute, private httpClientService: HttpClientService, private router: Router) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.userUid = params.get('id');
    });
    this.userEmail = sessionStorage.getItem('sessionEmail');
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.remainingMinutes === 0 && this.remainingSeconds === 0) {
        clearInterval(this.interval);
        this.showResendButton = true;
        // Timer has reached 0, you can perform any action here
      } else {
        if (this.remainingSeconds === 0) {
          this.remainingMinutes--;
          this.remainingSeconds = 59;
        } else {
          this.remainingSeconds--;
        }
      }
    }, 1000);
  }

  checkIsVerify(): void {
    (document.getElementById('sendVerfy') as HTMLInputElement).disabled = true;
    let txt_1 = (document.getElementById('txt_1') as HTMLInputElement).value;
    let txt_2 = (document.getElementById('txt_2') as HTMLInputElement).value;
    let txt_3 = (document.getElementById('txt_3') as HTMLInputElement).value;
    let txt_4 = (document.getElementById('txt_4') as HTMLInputElement).value;

    let string = txt_1 + txt_2 + txt_3 + txt_4;
    let obj = {
      user_u_id: this.userUid,
      verfication_code: string
    };
    this.httpClientService.otpVerify(obj).subscribe(
      data => {
        if (data.status_code == 200) {
          Swal.fire(
            'Good job',
            data.message,
            'success',
          ).then((result) => {
            this.router.navigate(['/new-password/' + data.data.user_u_id]);
          });
        }
      },
      error => {
        (document.getElementById('sendVerfy') as HTMLInputElement).disabled = false;
        Swal.fire(
          'Whoops...',
          error.error.message,
          'error',
        );
      }
    );
  }

  checkIsResendOtp(): void {
    (document.getElementById('sendOtp') as HTMLInputElement).disabled = true;
    let obj = {
      user_u_id: this.userUid
    };
    this.httpClientService.resendOtp(obj).subscribe(
      data => {
        if (data.status_code === 200) {
          Swal.fire(
            'Good job',
            data.message,
            'success',
          ).then((result) => {
            // this.router.navigate(['/addNewPassword']);
          });
        }
        (document.getElementById('txt_1') as HTMLInputElement).value = '';
        (document.getElementById('txt_2') as HTMLInputElement).value = '';
        (document.getElementById('txt_3') as HTMLInputElement).value = '';
        (document.getElementById('txt_4') as HTMLInputElement).value = '';
      },
      error => {
        (document.getElementById('sendVerfy') as HTMLInputElement).disabled = false;
        (document.getElementById('sendOtp') as HTMLInputElement).disabled = false;
        Swal.fire(
          'Whoops...',
          error.error.message,
          'error',
        );
      }
    );
    this.remainingMinutes = 2;
    this.remainingSeconds = 0;
    this.showResendButton = false;
    this.startCountdown(); // Restart the countdown
  }

  onDigitInput(event) {

    let element;
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;

    if (event.code === 'Backspace')
      element = event.srcElement.previousElementSibling;

    if (element == null)
      return;
    else
      element.focus();
  }

}
