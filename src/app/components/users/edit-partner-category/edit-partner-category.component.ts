import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClientService} from '../../../shared/service/http-client.service';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {AuthService} from '../../../shared/auth/auth.service';
import {CategoryService} from '../../../shared/service/category.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-edit-partner-category',
  templateUrl: './edit-partner-category.component.html',
  styleUrls: ['./edit-partner-category.component.scss']
})
export class EditPartnerCategoryComponent implements OnInit {
  public partnerEdit: FormGroup;
  public imageName = '';
  public imageCliant: FormGroup;
  public productPrefixArray = [];
  public ids = '';
  public partnerGroupArr = [];
  public partnerSpecificCategoryArr = [];
  public closeResult: string;
  public mainCategoryArr = [];
  public subCategoryArr = [];
  public subSubCategoryArr = [];
  public allCategoryBreadcrumbArr = [];
  public categoryRequestArr = [];
  public nonApprovalCategoryArr = [];
  public partnerUserId = 0;

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private authService: AuthService, private router: Router, private _Activatedroute: ActivatedRoute, private httpClientService: HttpClientService) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.getSelectedPartner(params.get('id'));

      this.ids = params.get('id');
    });

    this.getAllCategoryForRequest();

  }

  ngOnInit(): void {
  }
  getSelectedPartner(id) {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      const payLoard = {
        temp_code: id
      };
      this.httpClientService.getSelectedPartnerById(payLoard).subscribe(
        data => this.userAlertFunction(data),
        error => this.alartFunction(error.status)
      );
    }else if (sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER'){
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId')
      };
      this.httpClientService.getUserOrAdminProfileDetails(payLoard).subscribe(
        data => this.categoryMangerCategories(data),
        error => this.alartFunction(error.status)
      );
    }

  }
  categoryMangerCategories(data){
    if (data.data != null) {
      this.getCategoryByCategoryUser(data);
      this.getPendingCategory(data.data.user_u_id);
    }
  }

  userAlertFunction(data) {
    if (data.data != null) {
      this.getCategoryByUser(data);
      this.partnerUserId = data.data.partnerUser.id;
      this.getPendingCategory(data.data.partnerUser.id);
    }
  }

  getCategoryByCategoryUser(data){
    const sendObj = {
      user_u_id: data.data.user_u_id
    }
    this.categoryService.getApprovedCategoryByCategoryManager(sendObj).subscribe(
      data => this.manageCategoryCoreDetails(data),
      error => this.alartFunction(error.status)
    );
  }

  getCategoryByUser(data) {
    let sendObj = {};
    const partnerId = data.data.partnerUser.id;
    sendObj = {
      id: partnerId
    };
    this.categoryService.getCategoryByCorePartnerId(sendObj).subscribe(
      data => this.manageCategoryCoreDetails(data),
      error => this.alartFunction(error.status)
    );
  }

  manageCategoryCoreDetails(data) {
    if (data.data != null) {
      this.partnerSpecificCategoryArr = [];
      let categoryArray = {};
      for (let i = 0; i < data.data.length; i++) {
        categoryArray = {
          cat_parth: data.data[i].category_path
        };
        this.partnerSpecificCategoryArr.push(categoryArray);
      }
    }
  }


  alartFunction(data) {
  }


  backToLIst() {
    // users/list-user
    this.router.navigate(['/dashboard/default']);
  }


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAllCategoryForRequest() {
    const sendData = {
      code: 'c'
    };

    this.categoryService.getAllCategory(sendData).subscribe(
      data => this.setAllCategory(data),
    );
  }

  setAllCategory(data) {
    this.mainCategoryArr = [];
    for (let i = 0; i < data.data.length; i++) {
      this.mainCategoryArr.push(data.data[i]);
    }

  }

  changeMainCategory() {
    const cat_code = (document.getElementById('category_main') as HTMLInputElement).value;
    document.getElementById('sub_cat_dev').style.display = 'none';
    const senDdata = {
      code: cat_code
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageSelectedSubCategory(data),
    );
  }

  manageSelectedSubCategory(data) {
    if (data.data != null) {
      this.subCategoryArr = [];
      for (let i = 0; i < data.data.length; i++) {
        this.subCategoryArr.push(data.data[i]);
      }
    }

  }

  changeSubCategory() {
    const sub_cat_code = (document.getElementById('category_sub') as HTMLInputElement).value;
    document.getElementById('sub_sub_cat_dev').style.display = 'none';
    const senDdata = {
      code: sub_cat_code
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageSelectedSubSubCategory(data),
    );
  }

  manageSelectedSubSubCategory(data) {
    if (data.data != null) {
      this.subSubCategoryArr = [];
      for (let i = 0; i < data.data.length; i++) {
        this.subSubCategoryArr.push(data.data[i]);
      }
    }
  }

  addCategoryBredCrums() {
    const category_id = (document.getElementById('category_main') as HTMLInputElement).value;
    const sub_category_id = '';
    const cat_sub_sub_id = '';
    let cat_name = '';
    let sub_cat_name = '';
    let cat_sub_sub_name = '';

    let cat_name_bool = true;
    let sub_cat_name_bool = true;
    let cat_sub_sub_name_bool = true;

    if (sub_category_id === '' && cat_sub_sub_id === '') {
      this.categoryRequestArr.push(category_id);

    } else if (cat_sub_sub_id === '') {
      this.categoryRequestArr.push(sub_category_id);

    } else {
      this.categoryRequestArr.push(cat_sub_sub_id);

    }

    for (let i = 0; i < this.mainCategoryArr.length; i++) {
      if (category_id === '') {
        cat_name_bool = false;
      }

      if (sub_category_id === '') {
        sub_cat_name_bool = false;
      }

      if (cat_sub_sub_id === '') {
        cat_sub_sub_name_bool = false;
      }

      if (this.mainCategoryArr[i].code === category_id) {
        cat_name = this.mainCategoryArr[i].name;

        for (let x = 0; x < this.subCategoryArr.length; x++) {
          if (this.subCategoryArr[x].code === sub_category_id) {
            sub_cat_name = this.subCategoryArr[x].name;

            for (let z = 0; z < this.subSubCategoryArr.length; z++) {
              if (this.subSubCategoryArr[z].code === cat_sub_sub_id) {
                cat_sub_sub_name = this.subSubCategoryArr[z].name;
              }
            }
          }
        }
      }

      this.getAllCategoryForRequest();
      this.changeMainCategory();
      this.changeSubCategory();

    }

    const arr = {
      cat_name,
      sub_cat_name,
      cat_sub_sub_name,
      cat_name_bool,
      sub_cat_name_bool,
      cat_sub_sub_name_bool
    };

    this.allCategoryBreadcrumbArr.push(arr);

    document.getElementById('sub_cat_dev').style.display = 'none';
    document.getElementById('sub_sub_cat_dev').style.display = 'none';
    // this.getAllCategory();
  }

  removeCategoryBreadcrum(index) {
    for (let i = 0; i < this.allCategoryBreadcrumbArr.length; i++) {
      if (this.allCategoryBreadcrumbArr[index] == this.allCategoryBreadcrumbArr[i]) {
        this.allCategoryBreadcrumbArr.splice(i, 1);
      }
    }
  }

  MakeYourCategoryRequest(modal) {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER'){
      const sendPayload = {
        partner_u_id: sessionStorage.getItem('partnerId'),
        partnerCategories: this.categoryRequestArr
      };
      this.categoryService.callMakeYourCategoryRequest(sendPayload).subscribe(
        data => this.manageCallMakeYourCategoryRequest(data, modal),
      );
    } else if (sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER'){
      const sendPayload = {
        user_u_id: sessionStorage.getItem('userId'),
        user_categories: this.categoryRequestArr
      };
      this.categoryService.categoryAdminRequest(sendPayload).subscribe(
        data => this.manageCallMakeYourCategoryRequest(data, modal),
      );
    }
  }

  manageCallMakeYourCategoryRequest(data, modal) {

    this.getAllCategoryForRequest();
    this.changeMainCategory();
    this.changeSubCategory();
    Swal.fire(
      'Good job...!',
      data.message,
      'success'
    );
    modal.dismiss('Cross click');
    this.getSelectedPartner(this.ids);
  }

  getPendingCategory(data) {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER'){
      const payLoard = {
        id: data
      };
      this.categoryService.getPendingCategoryByPartner(payLoard).subscribe(
        data => this.managePendingCategoryByPartner(data),
      );
    }else if (sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER'){
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId')
      }
      this.categoryService.getPendingCategoryByCategoryManager(payLoard).subscribe(
        data => this.managePendingCategoryByPartner(data),
      );
    }

  }

  managePendingCategoryByPartner(data) {
    this.nonApprovalCategoryArr = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        this.nonApprovalCategoryArr.push(data.data[i]);
      }
    }
  }

  removePartnerCategoryPending(index) {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER'){
      const payLoard = {
        temp_code: sessionStorage.getItem('temp_code'),
        partner_u_id: sessionStorage.getItem('partnerId'),
        partnerCategories: [
          this.nonApprovalCategoryArr[index].category_code
        ]
      };

      this.categoryService.deletePendingCategoryByPartner(payLoard).subscribe(
        data => this.manageDeletePendingCategoryByPartner(data),
      );
    }else if (sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER'){
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId'),
        user_categories: [
          this.nonApprovalCategoryArr[index].category_code
        ]
      };
      this.categoryService.deletePendingCategoryByUser(payLoard).subscribe(
        data => this.manageDeletePendingCategoryByPartner(data),
      );
    }
  }

  manageDeletePendingCategoryByPartner(data) {
    this.getPendingCategory(this.partnerUserId);
  }

}
