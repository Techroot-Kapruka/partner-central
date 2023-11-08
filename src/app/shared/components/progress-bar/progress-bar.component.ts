import {Component, Input, OnInit} from '@angular/core';
import {HttpClientService} from '../../service/http-client.service';
import {DashboardService} from '../../service/dashboard.service';


@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  isGuest = false;
  isPartner = false;
  isAdmin = false;
  isApproved = 0;
  fillInfo = 'stepper-item';
  pendingApproval = 'stepper-item';
  bankDetails = 'stepper-item';
  listProduct = 'stepper-item';
  userId = '';
  @Input()
  public TempCode = '';
  partnerCode = null;
  display = false;
  isDisplay = false;
  tempCode = sessionStorage.getItem('temp_code');
  bankAdded = false;


  constructor(private userService: HttpClientService, private dashboard: DashboardService) {
  }

  async ngOnInit() {
    await this.checkIsAdmin();
    await this.getUserId();
    await this.checkUserRole();
    await this.checkApproved();
    await this.getBankDetails();
    await this.isBusinessInfoSubmitted();


    setTimeout(() => {
      this.isDisplay = this.display;
    }, 710);
  }

  async checkIsAdmin() {
    if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN' || sessionStorage.getItem('userRole') === 'ROLE_SUPER_ADMIN') {
      this.display = false;
    }
  }

  async getUserId() {
    this.userId = sessionStorage.getItem('userId');
  }

  async checkUserRole() {
    if (sessionStorage.getItem('userRole') === 'ROLE_GUEST') {
      this.isGuest = true;
      this.fillInfo = 'stepper-item active';
      this.display = true;
    }
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      this.isGuest = false;
      this.isPartner = true;
      this.fillInfo = 'stepper-item completed';
      this.pendingApproval = 'stepper-item completed';
      this.isApproved = 1;
      this.display = true;
    }
  }

  async isBusinessInfoSubmitted() {
    const payload = {
      user_u_id: this.userId
    };
    this.userService.getPartnerByUserId(payload).subscribe(
      data => this.manageBusinessInfo(data),
    );
  }

  async getBankDetails() {
    const payload = {
      temp_code: sessionStorage.getItem('temp_code')
    };
    this.userService.getBankDetails(payload).subscribe(
      data => this.manageBank(data),
    );
  }

  manageBank(data: { data: { accountNo: string; }[]; }) {
    if (data.data !== null) {
      if (data.data[0].accountNo === '') {
        this.bankDetails = 'stepper-item active';
      } else {
        this.bankDetails = 'stepper-item completed';
        this.bankAdded = true;
      }
    }
  }

  manageBusinessInfo(data: { data: { partner_u_id: string; status: number; }; }) {
    if (data.data.partner_u_id !== '') {
      this.partnerCode = data.data.partner_u_id;
    }
    if (data.data.status === 0) {
      this.isApproved = 0;
      this.pendingApproval = 'stepper-item active';
      this.display = true;
      this.fillInfo = 'stepper-item completed';
    } else {
      if (data.data.status === 1) {
        this.pendingApproval = 'stepper-item completed';
        this.fillInfo = 'stepper-item completed';
      }
    }
    this.getProductInfo();
  }

  async checkApproved() {
    if (this.isApproved === 1) {
      this.getProductInfo();
    }
  }

  getProductInfo() {
    const payload = {
      partner_u_id: this.partnerCode
    };
    this.dashboard.latestProductsPartner(payload).subscribe(
      data => this.manageProductInfo(data)
    );
  }

  manageProductInfo(data: { message: string; }) {
    if (data.message === 'Not Found any Products ' && this.pendingApproval === 'stepper-item completed') {
      this.listProduct = 'stepper-item active';
      if (this.bankAdded === false) {
        this.bankDetails = 'stepper-item active';
      }
      this.display = true;
    } else if (data.message === 'Find Latest Product  ') {
      this.listProduct = 'stepper-item completed';
    }
    this.displayNone();
  }

  displayNone() {
    if (this.isAdmin === false) {
      if (this.listProduct === 'stepper-item completed' && this.bankDetails === 'stepper-item completed') {

        this.isDisplay = false;
        this.display = false;

      }
    }
  }
}
