import {Component, OnInit} from '@angular/core';
import {HttpClientService} from '../../../shared/service/http-client.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  public approveUsersArr = [];
  public allUserListWithoutPartnersArr = [];
  public approveActiveUsersArr = [];
  public nonApproveUsersArr = [];
  public filteredUsers = [];
  public list_pages2 = 20;
  public selected = [];
  public nonActiveProductsArray = [];
  public isAdmin = true;
  public pendingPartnerCategoriesArr = [];
  public pendingManagerCategoriesArr = [];

  constructor(private httpClientService: HttpClientService, private router: Router) {
    this.getAllUser();
    this.getNonApprovedUsers();
    this.getPendingPartnerCategories();
    this.getPendingManagerCategories();
    this.getAllUsersWithoutPartner();
  }


  ngOnInit() {
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

  }

  getAllUser() {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_SUPER_ADMIN') {
      this.httpClientService.getAllUsers().subscribe(
        data => this.manageAllUserList(data),
      );
    } else if (sessionUser === 'ROLE_CATEGORY_MANAGER') {
      let payLoard = {
        user_u_id: sessionStorage.getItem('userId'),
      };
      this.httpClientService.getAllPartnersCategoryWise(payLoard).subscribe(
        data => this.manageAllUserList(data),
      );
    }
  }

  manageAllUserList(data) {
    this.approveUsersArr = [];
    for (let i = 0; i < data.data.length; i++) {
      const or = {
        partnerId: data.data[i].partner_u_id,
        businessName: data.data[i].businessName,
        ownerName: data.data[i].ownerName,
        email: data.data[i].email,
        mobile: data.data[i].mobile,
        businessRegisterNo: data.data[i].businessRegisterNo,
        temp_code: data.data[i].temp_code,
        // userrd: data.data[i].user_u_id
      };
      this.approveUsersArr.push(or);
    }
  }

  getAllUsersWithoutPartner() {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_SUPER_ADMIN') {
      this.httpClientService.getAllUsersWithoutPartners().subscribe(
        data => this.manageAllUserListWithoutPartners(data),
      );
    }
  }

  manageAllUserListWithoutPartners(data) {
    this.allUserListWithoutPartnersArr = [];

    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].isReject === 0) {
        const user = {
          userId: data.data[i].user_u_id,
          userName: data.data[i].contactPersonName,
          email: data.data[i].email,
          mobile: data.data[i].contactNo,
          role: data.data[i].role,
          isReject: data.data[i].isReject
        };
        this.allUserListWithoutPartnersArr.push(user);
      }
    }
  }

  manageActiveAllUserList(data) {
    this.approveActiveUsersArr = [];
    for (let i = 0; i < data.data.length; i++) {
      const or = {
        partnerId: data.data[i].partner_u_id,
        businessName: data.data[i].businessName,
        ownerName: data.data[i].ownerName,
        email: data.data[i].email,
        mobile: data.data[i].mobile,
        businessRegisterNo: data.data[i].businessRegisterNo,
        temp_code: data.data[i].temp_code,
        // userrd: data.data[i].user_u_id
      };
      this.approveActiveUsersArr.push(or);
    }
  }

  ApproveUsers(index) {
    let tempCode = this.nonApproveUsersArr[index].temp_code;
    let value=0;
    let url = '/users/view-partner/' + tempCode + '/' + value;
    this.router.navigate([url]);
    // const payLoard = {
    //   partner_u_id: this.nonApproveUsersArr[index].partnerId
    // };
    // this.httpClientService.makeApproveUsers(payLoard).subscribe(
    //   data => this.manageApproveUsers(data),
    // );
  }

  ApproveUsersTwo(index) {
    let tempCode;
    let value;
    let url;
    if (this.filteredUsers.length >0){
      tempCode = this.filteredUsers[index].temp_code;
      value = 1;
      url = '/users/view-partner/' + tempCode +'/' +value;
      this.router.navigate([url]);
    }else{
      tempCode = this.approveUsersArr[index].temp_code;
      value = 1;
      url = '/users/view-partner/' + tempCode +'/' +value;
      this.router.navigate([url]);
    }
  }

  FilterUsersByBusinessName(searchTerm: string): void {
    if(searchTerm !==''){
      this.filteredUsers = this.approveUsersArr.filter(product =>
        product.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }else{
      this.filteredUsers = [];
    }
  }

  disableUsers(index) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, disable it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {

      let payLoad;

      if(this.filteredUsers.length > 0){
        payLoad = {
          partner_u_id: this.filteredUsers[index].partnerId,
          updatedBy: sessionStorage.getItem('userId')
        };
      }else{
        payLoad = {
          partner_u_id: this.approveUsersArr[index].partnerId,
          updatedBy: sessionStorage.getItem('userId')
        };
      }

      if (result.isConfirmed) {
        this.httpClientService.updateStatus(payLoad).subscribe(
          error => (error.status)
        );
        Swal.fire('Disabled!', 'The user has been disabled.', 'success').then((result) => {
          this.getAllUser();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The user has not been disabled.', 'error');
      }
    });
  }

  manageApproveUsers(data) {
    Swal.fire(
      'Good job!',
      data.message,
      'success'
    );
    this.getAllUser();
    this.getNonApprovedUsers();
  }


  getNonApprovedUsers() {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN'||sessionUser === 'ROLE_SUPER_ADMIN') {
      this.httpClientService.takeNonApprovedUsers().subscribe(
        data => this.manageNonApprovedUsers(data),
        error => this.manageError(error.status)
      );
    } else if (sessionUser === 'ROLE_CATEGORY_MANAGER') {
      let payLoard = {
        user_u_id: sessionStorage.getItem('userId'),
      };
      this.httpClientService.getUnregisteredPartnersCategoryWise(payLoard).subscribe(
        data => this.manageNonApprovedUsers(data),
      );
    }

  }

  manageNonApprovedUsers(data) {
    this.nonApproveUsersArr = [];
    for (let i = 0; i < data.data.length; i++) {
      let pId = '';
      if (data.data[i].partner_u_id == null) {
        pId = 'N/A';
      } else {
        pId = data.data[i].partner_u_id;
      }
      const or = {
        partnerId: pId,
        businessName: data.data[i].businessName,
        ownerName: data.data[i].ownerName,
        email: data.data[i].email,
        mobile: data.data[i].mobile,
        registerNo: data.data[i].businessRegisterNo,
        temp_code: data.data[i].temp_code,
        // contactNo: data.data[i].contactNo,
        // userrd: data.data[i].user_u_id
      };
      this.nonApproveUsersArr.push(or);
    }
  }

  manageError(error) {
  }

  loginAsPartner(index) {
    let constone;
    if (this.filteredUsers.length > 0){
      constone = this.filteredUsers[index].partnerId;
      const url = '/#/dashboard/default/' + constone + '/' + true;
      this.router.navigate([url]);
      window.open(url, '_blank');
    }else{
      constone = this.approveUsersArr[index].partnerId;
      const url = '/#/dashboard/default/' + constone + '/' + true;
      this.router.navigate([url]);
      window.open(url, '_blank');
    }
  }

  getPendingManagerCategories() {
    this.httpClientService.takePendingManagerCategories().subscribe(
      data => this.manageTakePendingManagerCategories(data),
      error => this.manageError(error.status)
    );
  }

  getPendingPartnerCategories() {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN'||sessionUser === 'ROLE_SUPER_ADMIN') {
      this.httpClientService.takePendingPartnerCategories().subscribe(
        data => this.manageTakePendingPartnerCategories(data),
        error => this.manageError(error.status)
      );
    } else if (sessionUser === 'ROLE_CATEGORY_MANAGER') {
      let payLoard = {
        user_u_id: sessionStorage.getItem('userId'),
      };
      this.httpClientService.getRequestCategories(payLoard).subscribe(
        data => this.manageTakePendingPartnerCategories(data),
        error => this.manageError(error.status)
      );
    }

  }

  manageTakePendingPartnerCategories(data) {
    if (data.data != null) {
      this.pendingPartnerCategoriesArr = [];
      for (let i = 0; i < data.data.length; i++) {
        let arr = {
          partnerCode: data.data[i].partner.partner_u_id,
          partnerName: data.data[i].partner.business_name,
          category: data.data[i].category_path,
          category_code: data.data[i].category_code,
          temp_code: data.data[i].partner.temp_code
        };
        this.pendingPartnerCategoriesArr.push(arr);
      }
    }
  }

  manageTakePendingManagerCategories(data) {
    if (data.data != null) {
      this.pendingManagerCategoriesArr = [];
      for (let i = 0; i < data.data.length; i++) {
        let arr = {
          userCode: data.data[i].manager.user_code,
          userName: data.data[i].manager.user_name,
          category: data.data[i].category_path,
          category_code: data.data[i].category_code
        };
        this.pendingManagerCategoriesArr.push(arr);
      }
    }
  }

  ApproveManagerCategory(index) {
    let payLoard = {
      user_u_id: this.pendingManagerCategoriesArr[index].userCode,
      user_categories: [
        this.pendingManagerCategoriesArr[index].category_code
      ]
    };
    this.httpClientService.makeApproveManagerCategory(payLoard).subscribe(
      data => this.manageMakeManagerApproveCategory(data),
      error => this.manageError(error.status)
    );

  }

  disableUserRole(index) {
    // Display a SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to disable this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, disable!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        let payLoad = {
          user_u_id: this.allUserListWithoutPartnersArr[index].userId,
          update_by: sessionStorage.getItem('userId')
        };

        this.httpClientService.disablingUser(payLoad).subscribe(
          data => {
            this.manageDisablingUserRole(data);

            // Remove the user from the list
            this.allUserListWithoutPartnersArr.splice(index, 1);
          },
          error => this.manageError(error.status)
        );
      }
    });
  }

  manageDisablingUserRole(data) {
    Swal.fire(
      'Success!',
      data.message,
      'success'
    ).then(() => this.getAllUsersWithoutPartner());
  }

  ApproveCategory(index) {
    let payLoard = {
      temp_code: this.pendingPartnerCategoriesArr[index].temp_code,
      partner_u_id: this.pendingPartnerCategoriesArr[index].partnerCode,
      partnerCategories: [
        this.pendingPartnerCategoriesArr[index].category_code
      ]
    };
    this.httpClientService.makeApproveCategory(payLoard).subscribe(
      data => this.manageMakeApproveCategory(data),
      error => this.manageError(error.status)
    );

  }

  manageMakeApproveCategory(data) {
    Swal.fire(
      'Good job!',
      data.message,
      'success'
    );
    this.getPendingPartnerCategories();
  }

  manageMakeManagerApproveCategory(data) {
    Swal.fire(
      'Good job!',
      data.message,
      'success'
    );
    this.getPendingManagerCategories();
  }
}
