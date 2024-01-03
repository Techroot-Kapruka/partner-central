import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClientService} from "../../../shared/service/http-client.service";
import {error} from "protractor";
import Swal from "sweetalert2";

@Component({
  selector: 'app-user-verfication',
  templateUrl: './user-verfication.component.html',
  styleUrls: ['./user-verfication.component.scss']
})
export class UserVerficationComponent implements OnInit {
  public userUid = '';
  public userEmail = '';
  private otpValue1 = '';
  private otpValue2 = '';
  private otpValue3 = '';
  private otpValue4 = '';

  remainingMinutes: number = 2; // Initial minutes
  remainingSeconds: number = 0; // Initial seconds
  interval: any;
  showResendButton: boolean = false;
  showVerifyButton: boolean = true;
  isPartiallyRegistered  = false;

  constructor(private _Activatedroute: ActivatedRoute, private httpClientService: HttpClientService, private router: Router) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.userUid = params.get('id');
    });
    if(sessionStorage.getItem('email') == null) {
      this.userEmail = sessionStorage.getItem('sessionEmail');
    }else {
      this.userEmail = sessionStorage.getItem('email');
    }
    try{
      this._Activatedroute.queryParams.subscribe(async params => {
        const receivedData = JSON.parse(params['data']);
        this.isPartiallyRegistered=receivedData.partiallyRegistered;

        if (this.isPartiallyRegistered) {
          await this.unverfiedOTPResend();
        }
      });
    }catch(error){
    }
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
      user_u_id: this.userUid.replace(/"/g, ''),
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
              this.router.navigate(['/auth/login']);
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
    // (document.getElementById('sendOtp') as HTMLInputElement).disabled = true;
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
            // this.router.navigate(['/auth/login']);
          });
        }
        (document.getElementById('txt_1') as HTMLInputElement).value = '';
        (document.getElementById('txt_2') as HTMLInputElement).value = '';
        (document.getElementById('txt_3') as HTMLInputElement).value = '';
        (document.getElementById('txt_4') as HTMLInputElement).value = '';
      },
      error => {
        (document.getElementById('sendVerfy') as HTMLInputElement).disabled = false;
        // (document.getElementById('sendOtp') as HTMLInputElement).disabled = false;
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

  async unverfiedOTPResend(): Promise<void> {
    let obj = {
      user_u_id: this.userUid.replace(/"/g, '')
    };
    try {
      const data = await this.httpClientService.resendOtp(obj).toPromise();
      if (!(data.status_code === 200)) {
        await Swal.fire(
          'Error',
          "Something went wrong",
          'error',
        );
      }
    } catch (error) {
      await Swal.fire(
        'Whoops...',
        error.error.message,
        'error',
      );
    }
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
