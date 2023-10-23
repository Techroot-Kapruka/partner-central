import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClientService} from '../../../shared/service/http-client.service';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {AuthService} from '../../../shared/auth/auth.service';
import {CategoryService} from '../../../shared/service/category.service';
import {ProductService} from '../../../shared/service/product.service';

@Component({
  selector: 'app-approve-partner',
  templateUrl: './approve-partner.component.html',
  styleUrls: ['./approve-partner.component.scss']
})
export class ApprovePartnerComponent implements OnInit {
  public partnerEdit: FormGroup;
  public bankData: FormGroup;
  public imageName = '';
  public imageNameBR = '';
  public imageNic = '';

  public imageNameBankStatement = '';
  // @Input
  public productPrefixArray = [];
  public mainCategoryArray = [];
  public subCategoryArray = [];
  public subSubCategoryArray = [];
  public allCategoryBreadcrumbArr = [];
  public requestSendCategoryArr = [];
  public partnerSpecificCategoryArr = [];
  public cateBred = false;
  public catShow = false;
  @Input()
  public TempCode = '';
  public isCompany=false;
  public isindividual=false;
  value:number;
  approveButtonClicked = false;

  constructor(private authService: AuthService, private router: Router, private _Activatedroute: ActivatedRoute, private routeData: ActivatedRoute, private httpClientService: HttpClientService, private categoryService: CategoryService, private productService: ProductService) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.value=parseInt(params.get('value'));
      this.getSelectedPartner(params.get('id'));
      this.TempCode = params.get('id');
      this.createFormGroups();
    });
    this.receivedAllCategory();
  }

  ngOnInit(): void {
  }

  getSelectedPartner(id) {
    let payLoard = {
      temp_code: id
    };
    this.httpClientService.getSelectedPartnerById(payLoard).subscribe(
      data => {
        this.userAlertFunction(data);
      },
      error => {
        this.alartFunction(error.status);
      }
    );
    this.getImagePartner(id);
    this.getImagePartnerBR(id);
    // this.getImagePartnerBankStatement(id);
  }

  createFormGroups() {
    this.partnerEdit = new FormGroup({
      contactPersonName: new FormControl(''),
      contactNo: new FormControl(''),
      nic: new FormControl(''),
      companyName: new FormControl(''),
      userName: new FormControl(''),
      emailUser: new FormControl(''),
      password: new FormControl(''),
      comfPassword: new FormControl(''),
      role: new FormControl(''),
      partner_u_id: new FormControl(''),
      businessName: new FormControl(''),
      businessRegisterNo: new FormControl(''),
      ownerName: new FormControl(''),
      email: new FormControl(''),
      mobile: new FormControl(''),
      businessAddress: new FormControl(''),
      creditCardSave: new FormControl(''),
      PartnerType: new FormControl(''),
      partner_temp_code: new FormControl(''),
      socialURL: new FormControl('')
    });

    this.bankData = new FormGroup({
      bankAccount: new FormControl(''),
      bankName: new FormControl(''),
    });
  }

  userAlertFunction(data) {
    console.log(data)
    if(data.data.partnerUser.type=='company'){
      this.isCompany=true;
      this.imageNameBR=data.data.partnerUser.image_br;
    }else{
      this.isindividual=true;
      this.imageNic=data.data.partnerUser.nic;
    }


    this.selectedCategoryGet(data);
    let partnerCategoryArryLength = data.data.partnerUser.partnerCategories.length;

    let lengthPre = data.data.partnerUser.productPrefix.length;
    for (let i = 0; i < lengthPre; i++) {
      let or = {
        productPrefix: data.data.partnerUser.productPrefix[i]
      };
      this.productPrefixArray.push(or);
    }

    this.TempCode = data.data.partnerUser.temp_code;
    this.partnerEdit = new FormGroup({
      contactPersonName: new FormControl(data.data.contactPersonName),
      contactNo: new FormControl(data.data.contactNo),
      nic: new FormControl(data.data.nic),
      companyName: new FormControl(data.data.businessName),
      userName: new FormControl(data.data.userName),
      emailUser: new FormControl(data.data.email),
      password: new FormControl(data.data.contactPersonName),
      comfPassword: new FormControl(data.data.contactPersonName),
      role: new FormControl('Partner'),
      partner_u_id: new FormControl(data.data.partnerUser.partner_u_id),
      businessName: new FormControl(data.data.partnerUser.businessName),
      businessRegisterNo: new FormControl(data.data.partnerUser.businessRegisterNo),
      ownerName: new FormControl(data.data.partnerUser.ownerName),
      email: new FormControl(data.data.partnerUser.email),
      mobile: new FormControl(data.data.partnerUser.mobile),
      businessAddress: new FormControl(data.data.partnerUser.businessAddress),
      creditCardSave: new FormControl(data.data.partnerUser.creditCardSave),
      PartnerType: new FormControl(data.data.partnerUser.type),
      partner_temp_code: new FormControl(data.data.partnerUser.temp_code),
      socialURL: new FormControl('https://' + data.data.partnerUser.social_url),
    });

    if(data.data.partnerBankDetails !== null){
      this.bankData = new FormGroup({
        bankAccount: new FormControl(data.data.partnerBankDetails.accountNo),
        bankName: new FormControl(data.data.partnerBankDetails.bankName)
      });
      this.manageGetImageByPartnerBankStatement(data);
    }

    if (data.data.partnerUser.status == 1) {
      this.cateBred = true;
      this.catShow = false;
      document.getElementById('apprueBtnOne').style.display = 'none';

    } else {
      this.catShow = true;
      this.cateBred = false;
      document.getElementById('apprueBtnOne').style.display = 'block';

    }
    if (data.data.partnerUser.partnerCategories.length > 0 && data.data.partnerUser.status == 0) {
      this.cateBred = true;
      this.catShow = true;
    }

  }

  selectedCategoryGet(data) {
    let cat_arr = [];
    let sendObj = {};
    let partner_core_id = data.data.partnerUser.id;
    for (let i = 0; i < data.data.partnerUser.partnerCategories.length; i++) {
      cat_arr.push(data.data.partnerUser.partnerCategories[i]);
    }
    sendObj = {
      id: partner_core_id,
      partnerCategories: cat_arr
    };
    this.categoryService.getCategoryByCorePartnerId(sendObj).subscribe(
      data => this.manageCategoryCoreDetails(data),
      error => this.alartFunction(error.status)
    );
  }

  manageCategoryCoreDetails(data) {
    this.partnerSpecificCategoryArr = [];
    let categoryArray = {};
    for (let i = 0; i < data.data.length; i++) {
      categoryArray = {
        cat_parth: data.data[i].category_path,
        catCode: data.data[i].category_code
      };
      this.partnerSpecificCategoryArr.push(categoryArray);
    }
  }


  getImagePartner(tempCode: any) {
    let payloard = {
      temp_code: tempCode
    };
    this.authService.getImageByPartner(payloard).subscribe(
      data => this.manageGetImageByPartner(data),
      error => this.alartFunction(error.status)
    );
  }

  getImagePartnerBR(tempCode: any) {
    let payloard = {
      temp_code: tempCode
    };
    this.authService.getImageByPartnerBR(payloard).subscribe(
      data => this.manageGetImageByPartnerBR(data),
      error => this.alartFunction(error.status)
    );
  }

  // %%%%%%%%%%%%%%%%%%%%% image viewer%%%%%%%%%%
  openNicImageInNewTab(){
    window.open('assets/images/Partner/NIC/' + this.imageNic, '_blank');
  }
  openBRImageInNewTab() {
    window.open('assets/images/Partner/BR/' + this.imageNameBR, '_blank');
  }

  openBSImageInNewTab() {
    window.open('assets/images/Partner/Statement/' + this.imageNameBankStatement, '_blank');
  }

  manageGetImageByPartnerBR(data) {
    if (data.data == null) {
      this.imageNameBR = 'man.png';
      document.getElementById('scale-up-icon-1').style.display = 'none';
    } else {
      this.imageNameBR = data.data.br_name;
      document.getElementById('scale-up-icon-1').style.display = 'block';
    }
  }

  getImagePartnerBankStatement(tempCode: any) {
    let payloard = {
      temp_code: tempCode
    };
    this.authService.getImageByPartnerBankStatement(payloard).subscribe(
      data => this.manageGetImageByPartnerBankStatement(data),
      error => this.alartFunction(error.status)
    );
  }

  manageGetImageByPartnerBankStatement(data) {

    if (data.data.partnerBankDetails.bankStatement == null) {
      this.imageNameBankStatement = 'man.png';
      document.getElementById('scale-up-icon-2').style.display = 'none';
    } else {
      this.imageNameBankStatement = data.data.partnerBankDetails.bankStatement;
      document.getElementById('scale-up-icon-2').style.display = 'block';
    }
  }


  manageGetImageByPartner(data) {
    if (data.data == null) {
      this.imageName = 'man.png';
    } else {
      this.imageName = data.data.image_name;
    }
  }

  alartFunction(data) {
this.approveButtonClicked = false;
  }

  approvePartner() {

    for (let i = 0; i < this.partnerSpecificCategoryArr.length; i++) {
      this.requestSendCategoryArr.push(this.partnerSpecificCategoryArr[i].catCode);
    }
    this.approveButtonClicked = true;
    let payLoard = {
      partner_u_id: this.partnerEdit.value.partner_u_id,
      temp_code: this.partnerEdit.value.partner_temp_code,
      partnerCategories: this.requestSendCategoryArr,
      approvedBy:sessionStorage.getItem('userId'),
    };

    this.httpClientService.makeApproveUsers(payLoard).subscribe(
      data => this.manageApproveUsers(data),
      error => this.alartFunction(error.status)
    );
  }

  manageApproveUsers(data) {
    this.requestSendCategoryArr = [];
    Swal.fire(
      'Good job',
      data.message,
      'success'
    );
    this.router.navigate(['/users/list-user']);
  }

  backToLIst() {
    // users/list-user
    this.router.navigate(['/users/list-user']);
  }

  addCategory() {
    let category_id = (document.getElementById('category_ids') as HTMLInputElement).value;
    let sub_category_id = (document.getElementById('cat_sub_id') as HTMLInputElement).value;
    let cat_sub_sub_id = (document.getElementById('cat_sub_sub_id') as HTMLInputElement).value;
    let cat_name = '';
    let sub_cat_name = '';
    let cat_sub_sub_name = '';

    let cat_name_bool = true;
    let sub_cat_name_bool = true;
    let cat_sub_sub_name_bool = true;

    if (sub_category_id === '' && cat_sub_sub_id === '') {
      this.requestSendCategoryArr.push(category_id);

    } else if (cat_sub_sub_id === '') {
      this.requestSendCategoryArr.push(sub_category_id);

    } else {
      this.requestSendCategoryArr.push(cat_sub_sub_id);

    }

    for (let i = 0; i < this.mainCategoryArray.length; i++) {
      if (category_id === '') {
        cat_name_bool = false;
      }

      if (sub_category_id === '') {
        sub_cat_name_bool = false;
      }

      if (cat_sub_sub_id === '') {
        cat_sub_sub_name_bool = false;
      }

      if (this.mainCategoryArray[i].code === category_id) {
        cat_name = this.mainCategoryArray[i].name;

        for (let x = 0; x < this.subCategoryArray.length; x++) {
          if (this.subCategoryArray[x].code === sub_category_id) {
            sub_cat_name = this.subCategoryArray[x].name;

            for (let z = 0; z < this.subSubCategoryArray.length; z++) {
              if (this.subSubCategoryArray[z].code === cat_sub_sub_id) {
                cat_sub_sub_name = this.subSubCategoryArray[z].name;
              }
            }
          }
        }
      }
    }

    let arr = {
      cat_name: cat_name,
      sub_cat_name: sub_cat_name,
      cat_sub_sub_name: cat_sub_sub_name,
      cat_name_bool: cat_name_bool,
      sub_cat_name_bool: sub_cat_name_bool,
      cat_sub_sub_name_bool: cat_sub_sub_name_bool
    };

    this.allCategoryBreadcrumbArr.push(arr);
    document.getElementById('subCategory').style.display = 'none';
    document.getElementById('subsubCategory').style.display = 'none';
    this.receivedAllCategory();
    this.subCategoryArray = [];
    this.subSubCategoryArray = []
  }

  allSubCategory() {
    document.getElementById('subCategory').style.display = 'block';

    const category_code = (document.getElementById('category_ids') as HTMLInputElement).value;
    const senDdata = {
      code: category_code
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageReceivedSubCategory(data),
    );

  }

  manageReceivedSubCategory(data) {
    this.subCategoryArray = [];
    let cr = {};
    cr = {
      name: '',
      code: ''
    };

    for (let i = 0; i < data.data.length; i++) {
      cr = {
        name: data.data[i].name,
        code: data.data[i].code
      };
      this.subCategoryArray.push(cr);
    }
  }

  allSubSubCategory() {
    document.getElementById('subsubCategory').style.display = 'block';

    const sub_category_code = (document.getElementById('cat_sub_id') as HTMLInputElement).value;
    const senDdata = {
      code: sub_category_code
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageReceivedSubSubCategory(data),
    );

  }

  manageReceivedSubSubCategory(data) {
    this.subSubCategoryArray = [];
    let cr = {};
    cr = {
      name: '',
      code: ''
    };

    for (let i = 0; i < data.data.length; i++) {
      cr = {
        name: data.data[i].name,
        code: data.data[i].code
      };
      this.subSubCategoryArray.push(cr);
    }
  }

  receivedAllCategory() {
    const sendData = {
      code: 'c'
    };
    this.categoryService.getAllCategory(sendData).subscribe(
      data => this.manageListCategory(data),
    );
  }


  manageListCategory(data) {
    this.mainCategoryArray = [];
    let cr = {};
    cr = {
      name: '',
      code: ''
    };
    for (let i = 0; i < data.data.length; i++) {
      cr = {
        name: data.data[i].name,
        code: data.data[i].code
      };
      this.mainCategoryArray.push(cr);
    }
  }

  removeCategoryBreadcrum(index) {
    for (let i = 0; i < this.allCategoryBreadcrumbArr.length; i++) {
      if (this.allCategoryBreadcrumbArr[index] == this.allCategoryBreadcrumbArr[i]) {
        this.allCategoryBreadcrumbArr.splice(i, 1);
      }
    }
  }

  goToDeclinedMessageForm() {
    const vendorCode = 'Vendor-' + this.TempCode;
    this.router.navigate(['/declined-message/' + vendorCode]);
  }

}
