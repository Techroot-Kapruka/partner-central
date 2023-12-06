import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../shared/service/product.service';
import {PrivilegeUserService} from '../../../shared/service/privilege-user.service';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-privileges-users',
  templateUrl: './privileges-users.component.html',
  styleUrls: ['./privileges-users.component.scss']
})
export class PrivilegesUsersComponent implements OnInit {
  public privilegeUser: FormGroup;
  public privilegeNonPartner: FormGroup;
  public partnerArray = [];
  public tableData = [];
  public isUpdateOrInsert = 0;
  public nonPartnersPrivilegeArray = [];
  public userAdmin = 0;

  constructor(private productService: ProductService, private privilegeUserService: PrivilegeUserService, private router: Router) {
    this.getPartner();
    this.createFormGroup();
    this.getMasterTablePrivilegeItem();
    this.getUser();
  }

  ngOnInit(): void {
  }

  getPartner(): void {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN'||sessionUser === 'ROLE_SUPER_ADMIN') {
      this.productService.getPartnerAll().subscribe(
        data => this.manageBussinessPartner(data),
      );
    }
  }

  manageBussinessPartner(data) {
    this.partnerArray = [];
    const bussinessArrLangth = data.data.length;
    const partnerValue = data.data;
    for (let i = 0; i < bussinessArrLangth; i++) {
      const pr = {
        name: partnerValue[i].businessName,
        partner_name: partnerValue[i].partner_name,
        partner_u_id: partnerValue[i].partner_u_id
      };
      this.partnerArray.push(pr);
    }

  }

  getSelectedPartnerProduct() {
    const partnerId = (document.getElementById('select_pro') as HTMLInputElement).value;
    let index = 0;
    for (let i = 0; i < this.partnerArray.length; i++) {

      const partnerIdList = this.partnerArray[i].partner_u_id;
      if (partnerIdList === partnerId) {
        index = i;
      }
    }


    this.privilegeUser.get('vendorCode').setValue(this.partnerArray[index].partner_u_id);
    // (document.getElementById('vendorCode')as HTMLInputElement).value = this.partnerArray[index].partner_u_id ;
    this.privilegeUser.get('partnerName').setValue(this.partnerArray[index].partner_name);
    this.privilegeUser.get('businessName').setValue(this.partnerArray[index].name);

    this.privilegeUser.get('checkProductList').setValue(false);
    this.privilegeUser.get('addProduct').setValue(false);
    this.privilegeUser.get('paymentList').setValue(false);
    this.privilegeUser.get('orderList').setValue(false);
    this.privilegeUser.get('shipmentList').setValue(false);
    this.privilegeUser.get('shipmentAdd').setValue(false);
    this.privilegeUser.get('uploadFiles').setValue(false);

    this.getPrivilagesByPartner(this.partnerArray[index].partner_u_id);
  }


  getPrivilagesByPartner(id) {
    const payloard = {
      partner_u_id: id
    };
    this.privilegeUserService.getDetails(payloard).subscribe(
      data => this.partnerPrivilegeItem(data),
    );
  }

  partnerPrivilegeItem(data) {
    if (data.data === null) {
      document.getElementById('saveBtn').style.display = 'block';
      document.getElementById('updateBtn').style.display = 'none';
      this.isUpdateOrInsert = 0;
    } else {
      let bool01 = false;
      let bool02 = false;
      let bool03 = false;
      let bool04 = false;
      let bool05 = false;
      let bool06 = false;
      let bool07 = false;
      let bool08 = false;

      for (let i = 0; i < data.data.partner_privilege_item.length; i++) {
        let status = 0;
        let name = '';
        status = data.data.partner_privilege_item[i].partner_privilege_item.status;
        name = data.data.partner_privilege_item[i].partner_privilege_item.description;
        if (name === 'product_list') {
          if (status === 1) {
            bool01 = true;
          }

        }
        if (name === 'order_list') {
          if (status === 1) {
            bool02 = true;
          }
        }
        if (name === 'dashboard') {
          if (status === 1) {
            bool03 = true;
          }
        }
        if (name === 'product_add') {
          if (status === 1) {
            bool04 = true;
          }
        }
        if (name === 'payment_list') {
          if (status === 1) {
            bool05 = true;
          }
        }
        if (name === 'shipment_add') {
          if (status === 1) {
            bool06 = true;
          }
        }
        if (name === 'shipment_list') {
          if (status === 1) {
            bool07 = true;
          }
        }
        if (name === 'upload_files') {
          if (status === 1) {
            bool08 = true;
          }
        }
      }
      this.privilegeUser.get('checkProductList').setValue(bool01);
      this.privilegeUser.get('addProduct').setValue(bool04);
      this.privilegeUser.get('paymentList').setValue(bool05);
      this.privilegeUser.get('orderList').setValue(bool02);
      this.privilegeUser.get('shipmentList').setValue(bool07);
      this.privilegeUser.get('shipmentAdd').setValue(bool06);
      this.privilegeUser.get('uploadFiles').setValue(bool08);

      if (bool01 == true || bool04 == true || bool05 == true || bool02 == true || bool07 == true || bool06 == true || bool08 == true) {
        document.getElementById('saveBtn').style.display = 'none';
        document.getElementById('updateBtn').style.display = 'block';
        this.isUpdateOrInsert = 1;
      } else {
        document.getElementById('saveBtn').style.display = 'block';
        document.getElementById('updateBtn').style.display = 'none';
        this.isUpdateOrInsert = 0;
      }
    }
  }

  privilegeUserHitDb() {
    const partner_privilege = [];
    let payLoard = {};
    if (this.privilegeUser.value.addProduct == true) {
      partner_privilege.push('A1');
    }

    if (this.privilegeUser.value.checkProductList == true) {
      partner_privilege.push('A2');
    }

    if (this.privilegeUser.value.orderList == true) {
      partner_privilege.push('A3');
    }

    if (this.privilegeUser.value.paymentList == true) {
      partner_privilege.push('A4');
    }

    if (this.privilegeUser.value.shipmentAdd == true) {
      partner_privilege.push('A5');
    }

    if (this.privilegeUser.value.shipmentList == true) {
      partner_privilege.push('A6');
    }

    if (this.privilegeUser.value.uploadFiles == true) {
      partner_privilege.push('A7');
    }

    partner_privilege.push('A0');
    const vendorCode = this.privilegeUser.value.vendorCode;

    payLoard = {
      partner_u_id: vendorCode,
      partner_privilege
    };
    if (this.isUpdateOrInsert == 0) {
      this.privilegeUserService.privilegeUserSave(payLoard).subscribe(
        data => this.ManagePrivilegeUserSave(data),
      );
    } else {
      // update

      this.privilegeUserService.privilegeUserUpdate(payLoard).subscribe(
        data => this.ManagePrivilegeUserUpdate(data),
      );
    }
  }

  ManagePrivilegeUserSave(data) {
    Swal.fire(
      'Good job',
      'Privilege Added Successful...',
      'success'
    );
    this.createFormGroup();
    this.getPartner();
  }

  ManagePrivilegeUserUpdate(data) {
    Swal.fire(
      'Good job',
      'Privilege Updated Successful....',
      'success'
    );
    this.createFormGroup();
    this.getPartner();
  }

  createFormGroup() {

    this.privilegeUser = new FormGroup({
      vendorCode: new FormControl(''),
      partnerName: new FormControl(''),
      businessName: new FormControl(''),
      checkProductList: new FormControl(false),
      addProduct: new FormControl(false),
      paymentList: new FormControl(false),
      orderList: new FormControl(false),
      shipmentList: new FormControl(false),
      shipmentAdd: new FormControl(false),
      uploadFiles: new FormControl(false),
    });

    this.privilegeNonPartner = new FormGroup({
      userCode: new FormControl(''),
      userNames: new FormControl(''),
      category: new FormControl(false),
      productList: new FormControl(false),
      orderList: new FormControl(false),
      paymentList: new FormControl(false),
      shipmentRecevieList: new FormControl(false),
      createUser: new FormControl(false),
      userList: new FormControl(false),
      userPrivileges: new FormControl(false),
    });
  }

  getMasterTablePrivilegeItem() {
    this.privilegeUserService.viewAllPrivilegeItem().subscribe(
      data => this.manageViewAllPrivilegeItem(data),
    );
  }

  manageViewAllPrivilegeItem(data) {
    for (let i = 0; i < data.data.length; i++) {
      const or = {
        id: data.data[i].id,
        value: data.data[i].value,
        privilege_satus: data.data[i].privilege_satus,
        description: data.data[i].description
      };
      this.tableData.push(or);
    }
  }

  getUser() {
    this.privilegeUserService.privilegeUserGet().subscribe(
      data => this.manageGetUser(data),
    );
  }

  manageGetUser(data) {
    this.nonPartnersPrivilegeArray = [];
    for (let i = 0; i < data.data.length; i++) {

      const arr = {
        user_u_id: data.data[i].user_u_id,
        user_name: data.data[i].userName,
        user_privileges: data.data[i].user_privileges
      };
      this.nonPartnersPrivilegeArray.push(arr);
    }
  }

  getSelectedUser() {
    let index = 0;
    const userId = (document.getElementById('select_user') as HTMLInputElement).value;
    for (let i = 0; i < this.nonPartnersPrivilegeArray.length; i++) {
      if (userId === this.nonPartnersPrivilegeArray[i].user_u_id) {
        index = i;
      }
    }
    this.privilegeForUser(index);
  }

  privilegeForUser(index) {
    let bool02 = false;
    let bool03 = false;
    let bool04 = false;
    let bool05 = false;
    let bool06 = false;
    let bool07 = false;
    let bool08 = false;
    let bool09 = false;

    this.privilegeNonPartner.get('userCode').setValue(this.nonPartnersPrivilegeArray[index].user_u_id);
    this.privilegeNonPartner.get('userNames').setValue(this.nonPartnersPrivilegeArray[index].user_name);

    if (this.nonPartnersPrivilegeArray[index].user_privileges == null) {
      document.getElementById('saveBtn1').style.display = 'block';
      document.getElementById('updateBtn2').style.display = 'none';
      this.userAdmin = 0;

      this.privilegeNonPartner.get('category').setValue(bool02);
      this.privilegeNonPartner.get('productList').setValue(bool03);
      this.privilegeNonPartner.get('orderList').setValue(bool04);
      this.privilegeNonPartner.get('paymentList').setValue(bool05);
      this.privilegeNonPartner.get('shipmentRecevieList').setValue(bool06);
      this.privilegeNonPartner.get('createUser').setValue(bool07);
      this.privilegeNonPartner.get('userList').setValue(bool08);
      this.privilegeNonPartner.get('userPrivileges').setValue(bool09);

    } else {
      this.userAdmin = 1;
      document.getElementById('saveBtn1').style.display = 'none';
      document.getElementById('updateBtn2').style.display = 'block';

      for (let i = 0; i < this.nonPartnersPrivilegeArray[index].user_privileges.length; i++) {
        if (this.nonPartnersPrivilegeArray[index].user_privileges[i] === 'A1') {
          bool02 = true;
        }

        if (this.nonPartnersPrivilegeArray[index].user_privileges[i] === 'A2') {
          bool03 = true;
        }

        if (this.nonPartnersPrivilegeArray[index].user_privileges[i] === 'A3') {
          bool04 = true;
        }

        if (this.nonPartnersPrivilegeArray[index].user_privileges[i] === 'A4') {
          bool05 = true;
        }

        if (this.nonPartnersPrivilegeArray[index].user_privileges[i] === 'A5') {
          bool06 = true;
        }

        if (this.nonPartnersPrivilegeArray[index].user_privileges[i] === 'A6') {
          bool07 = true;
        }
        if (this.nonPartnersPrivilegeArray[index].user_privileges[i] === 'A7') {
          bool08 = true;
        }

        if (this.nonPartnersPrivilegeArray[index].user_privileges[i] === 'A8') {
          bool09 = true;
        }
      }

      this.privilegeNonPartner.get('category').setValue(bool02);
      this.privilegeNonPartner.get('productList').setValue(bool03);
      this.privilegeNonPartner.get('orderList').setValue(bool04);
      this.privilegeNonPartner.get('paymentList').setValue(bool05);
      this.privilegeNonPartner.get('shipmentRecevieList').setValue(bool06);
      this.privilegeNonPartner.get('createUser').setValue(bool07);
      this.privilegeNonPartner.get('userList').setValue(bool08);
      this.privilegeNonPartner.get('userPrivileges').setValue(bool09);
    }
  }

  privilegeNonPartnerSubmit() {
    const privilegeArry = [];

    if (this.privilegeNonPartner.value.category == true) {
      privilegeArry.push('A1');
    }
    if (this.privilegeNonPartner.value.productList == true) {
      privilegeArry.push('A2');
    }
    if (this.privilegeNonPartner.value.orderList == true) {
      privilegeArry.push('A3');
    }
    if (this.privilegeNonPartner.value.paymentList == true) {
      privilegeArry.push('A4');
    }
    if (this.privilegeNonPartner.value.shipmentRecevieList == true) {
      privilegeArry.push('A5');
    }
    if (this.privilegeNonPartner.value.createUser == true) {
      privilegeArry.push('A6');
    }
    if (this.privilegeNonPartner.value.userList == true) {
      privilegeArry.push('A7');
    }
    if (this.privilegeNonPartner.value.userPrivileges == true) {
      privilegeArry.push('A8');
    }
    const payLoard = {
      user_u_id: this.privilegeNonPartner.value.userCode,
      user_privileges: privilegeArry
    };

    if (this.userAdmin == 0) {
      this.privilegeUserService.privilegeUserSubmit(payLoard).subscribe(
        data => this.managePrivilegeUserSubmit(data),
      );
    } else {
      this.privilegeUserService.privilegeUserAdminUpdate(payLoard).subscribe(
        data => this.managePrivilegeUserSubmit(data),
      );
    }

  }

  managePrivilegeUserSubmit(data) {
    this.getUser();
    this.createFormGroup();

    Swal.fire(
      'Good job',
      'Privilege Added Successful...',
      'success'
    );

  }
}
