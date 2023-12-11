import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClientService} from '../../../shared/service/http-client.service';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {AuthService} from '../../../shared/auth/auth.service';
import {CategoryService} from '../../../shared/service/category.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../../environments/environment.prod';
import {takeUntil} from "rxjs/internal/operators";

@Component({
  selector: 'app-edit-partner',
  templateUrl: './edit-partner.component.html',
  styleUrls: ['./edit-partner.component.scss']
})
export class EditPartnerComponent implements OnInit {
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
  public eyeIcon = 'fa fa-fw fa-eye-slash field-icon';
  public eyeIcon2 = 'fa fa-fw fa-eye-slash field-icon';
  public type = 'password';
  public type2 = 'password';
  public catDev = false;
  public isVendor = false;
  public isBankStAvailable = false;
  public isRegDocAvailable = false;
  public isVendorOtherDetails = false;

  public holdername = '';
  public bankName = '';
  public branchCode = '';
  public branchName = '';
  public accountNo = '';
  public bstatement = '';

  public partnerBankDetailsEdit: FormGroup;
  public bankStatement: FormGroup;
  public partnerBusinessDetailsEdit: FormGroup;
  public businessRegisterImage: FormGroup;
  public imagePathURI = '';
  public statementImage = '';
  public registerDoc = '';
  selectedFile: File | null = null;
  selectedRegDocFile: File | null = null;

  public individual = false;
  public nicImg = '';
  public nicDiv = 'none';
  public businessRegisterImgDiv = 'block';
  selectNicImgFile: File | null = null;
  public nicImgFrormGroup: FormGroup;

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private authService: AuthService, private router: Router, private _Activatedroute: ActivatedRoute, private httpClientService: HttpClientService) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.getSelectedPartner(params.get('id'));
      this.getVendorBankDetails(params.get('id'));
      this.createFormGroups();
      this.imageControlMethord();
      this.ids = params.get('id');
    });
    this.getAllCategoryForRequest();
    this.hidePartnerSection();

    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      this.isVendor = true;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_QA') {
      this.imageName = 'qa_user.jpeg';
    } else {
      this.imageName = 'man.png';
    }
  }

  ngOnInit(): void {
  }

  getSelectedPartner(id) {
    const payLoard = {
      temp_code: id
    };
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      this.httpClientService.getSelectedPartnerById(payLoard).subscribe(
        data => this.userAlertFunction(data),
        error => this.alartFunction(error.status)
      );
      this.getImagePartner(id);
    } else {
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId')
      };
      this.httpClientService.getUserOrAdminProfileDetails(payLoard).subscribe(
        data => this.userAlertFunction(data),
        error => this.alartFunction(error.status)
      );
      // this.getImagePartner(id);
    }
  }

  createFormGroups() {
    this.partnerEdit = new FormGroup({
      userUId: new FormControl(''),
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
      bankAccount: new FormControl(''),
      bankName: new FormControl(''),
      creditCardSave: new FormControl(''),
      PartnerType: new FormControl(''),
      supplierGroupss: new FormControl(''),
      status: new FormControl(''),
    });

    this.partnerBankDetailsEdit = new FormGroup({
      holderName: new FormControl(''),
      bankName: new FormControl(''),
      branchCode: new FormControl(''),
      branchName: new FormControl(''),
      accountNo: new FormControl(''),
    });

    this.bankStatement = new FormGroup({
      bankStatement: new FormControl(''),
    });

    this.partnerBusinessDetailsEdit = new FormGroup({
      BPartnerType: new FormControl(''),
      partnerBusinessName: new FormControl(''),
      businessownerName: new FormControl(''),
      businessContactNo: new FormControl(''),
      emailPartner: new FormControl(''),
      businessPartnerAddress: new FormControl(''),
      PbusinessRegisterNo: new FormControl(''),
      socialURL: new FormControl(''),
    });

    this.businessRegisterImage = new FormGroup({
      businessRegisterImage: new FormControl(''),
    });

    this.nicImgFrormGroup = new FormGroup({
      nicImgControl: new FormControl('')
    });
  }

  hidePartnerSection() {

  }

  userAlertFunction(data) {
    if (data.data != null) {
      if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
        const lengthPre = data.data.partnerUser.productPrefix.length;
        for (let i = 0; i < lengthPre; i++) {
          const or = {
            productPrefix: data.data.partnerUser.productPrefix[i]
          };
          this.productPrefixArray.push(or);
        }

        sessionStorage.setItem('userType', data.data.partnerUser.type);

        this.partnerEdit = new FormGroup({
          userUId: new FormControl(data.data.user_u_id),
          contactPersonName: new FormControl(data.data.contactPersonName),
          contactNo: new FormControl(data.data.contactNo),
          nic: new FormControl(data.data.nic),
          companyName: new FormControl(data.data.companyName),
          userName: new FormControl(data.data.userName),
          emailUser: new FormControl(data.data.email),
          password: new FormControl(data.data.password),
          comfPassword: new FormControl(data.data.password),
          role: new FormControl('Partner'),
          partner_u_id: new FormControl(data.data.partnerUser.partner_u_id),
          businessName: new FormControl(data.data.partnerUser.businessName),
          businessRegisterNo: new FormControl(data.data.partnerUser.businessRegisterNo),
          ownerName: new FormControl(data.data.partnerUser.ownerName),
          email: new FormControl(data.data.partnerUser.email),
          mobile: new FormControl(data.data.partnerUser.mobile),
          businessAddress: new FormControl(data.data.partnerUser.businessAddress),
          bankAccount: new FormControl(data.data.partnerUser.bankAccount),
          bankName: new FormControl(data.data.partnerUser.bankName),
          creditCardSave: new FormControl(data.data.partnerUser.creditCardSave),
          PartnerType: new FormControl(data.data.partnerUser.type),
          supplierGroupss: new FormControl(data.data.partnerUser.supplier_group),
          status: new FormControl(data.data.partnerUser.status),
        });

        this.partnerBusinessDetailsEdit = new FormGroup({
          BPartnerType: new FormControl(data.data.partnerUser.type),
          partnerBusinessName: new FormControl(data.data.partnerUser.businessName),
          businessownerName: new FormControl(data.data.partnerUser.ownerName),
          businessContactNo: new FormControl(data.data.partnerUser.mobile),
          emailPartner: new FormControl(data.data.partnerUser.email),
          businessPartnerAddress: new FormControl(data.data.partnerUser.businessAddress),
          PbusinessRegisterNo: new FormControl(data.data.partnerUser.businessRegisterNo),
          socialURL: new FormControl(data.data.partnerUser.social_url),
        });

        if (data.data.partnerUser.imageBr != '') {
          this.registerDoc = data.data.partnerUser.imageBr;
          this.isRegDocAvailable = true;
        }

        if (data.data.partnerUser.type === 'individual') {
          this.nicImg = data.data.partnerUser.nic;
          this.individual = true;
          this.nicDiv = 'block';
          this.businessRegisterImgDiv = 'none';
        }
        this.getCategoryByUser(data);
        this.getPendingCategory(data);

      } else {
        let userRole = '';
        if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN') {
          userRole = 'admin';
        } else if (sessionStorage.getItem('userRole') === 'ROLE_USER') {
          userRole = 'user';
        } else {
          userRole = 'QA';
        }

        this.partnerEdit = new FormGroup({
          userUId: new FormControl(data.data.user_u_id),
          contactPersonName: new FormControl(data.data.contactPersonName),
          contactNo: new FormControl(data.data.contactNo),
          nic: new FormControl(data.data.nic),
          companyName: new FormControl(data.data.companyName),
          userName: new FormControl(data.data.userName),
          emailUser: new FormControl(data.data.email),
          password: new FormControl(data.data.password),
          comfPassword: new FormControl(data.data.password),
          role: new FormControl(userRole),
          partner_u_id: new FormControl(''),
          businessName: new FormControl(''),
          businessRegisterNo: new FormControl(''),
          ownerName: new FormControl(''),
          email: new FormControl(''),
          mobile: new FormControl(''),
          businessAddress: new FormControl(''),
          bankAccount: new FormControl(''),
          bankName: new FormControl(''),
          creditCardSave: new FormControl(''),
          PartnerType: new FormControl(''),
          supplierGroupss: new FormControl(''),
          status: new FormControl(''),
        });

        this.partnerBusinessDetailsEdit = new FormGroup({
          BPartnerType: new FormControl(''),
          partnerBusinessName: new FormControl(''),
          businessownerName: new FormControl(''),
          businessContactNo: new FormControl(''),
          emailPartner: new FormControl(''),
          businessPartnerAddress: new FormControl(''),
          PbusinessRegisterNo: new FormControl(''),
          socialURL: new FormControl(''),
        });

        this.registerDoc = '';
        this.isRegDocAvailable = false;
      }

      /*if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
        document.getElementById('disss').style.display = 'block';
      } else {
        document.getElementById('disss').style.display = 'none';
      }*/
    }
  }


  getCategoryByUser(data) {
    const cat_arr = [];
    let sendObj = {};
    const partner_core_id = data.data.partnerUser.id;
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

  getImagePartner(tempCode: any) {
    const payloard = {
      temp_code: tempCode
    };
    this.authService.getImageByPartner(payloard).subscribe(
      data => this.manageGetImageByPartner(data),
      error => this.alartFunction(error.status)
    );
  }

  manageGetImageByPartner(data) {

    if (data.data == null) {
      this.imageName = 'man.png';
    } else {
      this.imageName = data.data.image_name;
    }
  }

  alartFunction(data) {
  }

  validateFunctionByUser() {
    const ret01 = true;
    const ret02 = true;
    const ret03 = true;
    const ret04 = true;
    const ret07 = true;
    const ret09 = true;


    let ret05 = false;
    const passwordConform = (document.getElementById('comfPassword') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    if (password === passwordConform) {
      document.getElementById('comfPassword').style.borderColor = 'green';
      ret05 = true;
    } else {
      document.getElementById('comfPassword').style.borderColor = 'red';
      ret05 = false;
      Swal.fire(
        'Whoops...!',
        'Password not match',
        'error'
      );
    }
    //


    if (ret05) {
      return true;
    } else {
      return false;
    }
  }

  updatePartner() {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      const productPrefix = [];
      for (let i = 0; i < this.productPrefixArray.length; i++) {
        productPrefix.push(this.productPrefixArray[i].productPrefix);
      }

      const payLoard = {
        user_u_id: this.partnerEdit.value.userUId,
        contactPersonName: this.partnerEdit.value.contactPersonName,
        companyName: this.partnerEdit.value.companyName,
        userName: this.partnerEdit.value.userName,
        email: this.partnerEdit.value.emailUser,
        nic: this.partnerEdit.value.nic,
        contactNo: this.partnerEdit.value.contactNo,
        password: this.partnerEdit.value.password,
        partnerUser: {
          partner_u_id: this.partnerEdit.value.partner_u_id,
          type: this.partnerBusinessDetailsEdit.value.BPartnerType,
          businessName: this.partnerBusinessDetailsEdit.value.partnerBusinessName,
          businessRegisterNo: this.partnerBusinessDetailsEdit.value.PbusinessRegisterNo,
          ownerName: this.partnerBusinessDetailsEdit.value.businessownerName,
          email: this.partnerBusinessDetailsEdit.value.emailPartner,
          mobile: this.partnerBusinessDetailsEdit.value.businessContactNo,
          businessAddress: this.partnerBusinessDetailsEdit.value.businessPartnerAddress,
          bankAccount: this.partnerBankDetailsEdit.value.accountNo,
          bankName: this.partnerBankDetailsEdit.value.bankName,
          creditCardSave: this.partnerEdit.value.creditCardSave,
          status: this.partnerEdit.value.status,
          temp_code: this.ids,
          supplier_group: this.partnerEdit.value.supplierGroupss,
          productPrefix
        }
      };

      let coss1 = false;
      coss1 = this.validateFunctionByUser();

      if (coss1) {
        this.httpClientService.updatePartner(payLoard).subscribe(
          data => this.manageUpdatePartner(data),
          error => this.alartFunction(error.status)
        );
      }

    } else {
      const payLoard = {
        user_u_id: this.partnerEdit.value.userUId,
        contactPersonName: this.partnerEdit.value.contactPersonName,
        nic: this.partnerEdit.value.nic,
        companyName: this.partnerEdit.value.companyName,
        userName: this.partnerEdit.value.userName,
        email: this.partnerEdit.value.emailUser,
        contactNo: this.partnerEdit.value.contactNo,
        password: this.partnerEdit.value.password
      };

      let coss = false;
      coss = this.validateFunctionByUser();

      if (coss) {
        this.httpClientService.updateAdmin(payLoard).subscribe(
          data => this.manageUpdateAdmin(data),
          error => this.alartFunction(error.status)
        );
      }
    }
  }

  manageUpdateAdmin(data) {
    Swal.fire(
      'Good job',
      data.message,
      'success'
    );
  }

  manageUpdatePartner(data) {
    if (data.status_code == 200) {
      this.updateImage(data.data.partnerUser.temp_code);
    }
  }

  updateImage(temp_code) {
    const images = this.imageCliant.get('fileSource').value;
    if (images.name != undefined) {
      this.httpClientService.uploardPartnerImage(images, temp_code).subscribe(
        data => this.manageImageUploardmageUploard(data),
        error => this.alartFunction(error.status)
      );
    } else {
      Swal.fire(
        'Good job',
        'success...',
        'success'
      );
      this.router.navigate(['/dashboard/default']);
    }
  }

  manageImageUploardmageUploard(data) {
    if (data.status_code == 200) {
      Swal.fire(
        'Good job',
        'Partner Update Success...',
        'success'
      );
      this.router.navigate(['/dashboard/default']);
    }
  }

  backToLIst() {
    // users/list-user
    this.router.navigate(['/dashboard/default']);
  }

  imageControlMethord() {
    this.imageCliant = new FormGroup({
      imageOne: new FormControl(''),
      fileSource: new FormControl('')
    });
  }

  changeValue(event: any, i) {

    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    const mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      (document.getElementById('imageOneO') as HTMLInputElement).src = reader.result.toString();
      // (document.getElementById('mainImage') as HTMLInputElement).src = reader.result.toString();
    };

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource: file
      });
    }
  }

  managePartnerGroups(data) {
    for (let i = 0; i < data.message.values.length; i++) {
      const or = {
        groupName: data.message.values[i][0]
      };
      this.partnerGroupArr.push(or);
    }
  }

  addPrefixs() {
    const productPrefixName = (document.getElementById('productPrefix') as HTMLInputElement).value;
    (document.getElementById('productPrefix') as HTMLInputElement).value = '';
    const arPr = {
      productPrefix: productPrefixName
    };
    this.productPrefixArray.push(arPr);
  }

  removePrefix(prefix) {
    const prefArrLength = this.productPrefixArray.length;
    for (let i = 0; i < prefArrLength; i++) {
      if (this.productPrefixArray[i].productPrefix === prefix) {
        this.productPrefixArray.splice(i, 1);
      }
    }
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
    document.getElementById('sub_cat_dev').style.display = 'block';
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
    document.getElementById('sub_sub_cat_dev').style.display = 'block';
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
    const sub_category_id = (document.getElementById('category_sub') as HTMLInputElement).value;
    const cat_sub_sub_id = (document.getElementById('Category_sub_sub') as HTMLInputElement).value;
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


  getPendingCategory(data) {
    const payLoard = {
      id: data.data.partnerUser.id
    };
    this.categoryService.getPendingCategoryByPartner(payLoard).subscribe(
      data => this.managePendingCategoryByPartner(data),
    );
  }

  managePendingCategoryByPartner(data) {
    this.nonApprovalCategoryArr = [];
    if (data.data != null) {
      this.catDev = true;
      for (let i = 0; i < data.data.length; i++) {
        this.nonApprovalCategoryArr.push(data.data[i]);
      }
    } else {
      this.catDev = false;
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

  updateBankDetails() {
    const holderName = (document.getElementById('holderName') as HTMLInputElement).value;
    const bankName = (document.getElementById('bankName') as HTMLInputElement).value;
    const branchCode = (document.getElementById('branchCode') as HTMLInputElement).value;
    const branchName = (document.getElementById('branchName') as HTMLInputElement).value;
    const accountNo = (document.getElementById('accountNo') as HTMLInputElement).value;
    const vendorCode = sessionStorage.getItem('temp_code');

    if (this.bankStatement.value.bankStatement !== '' || this.bankName !== bankName || this.holdername !== holderName || this.branchCode !== branchCode || this.branchName !== branchName || this.accountNo !== accountNo) {
      const result = this.validationTextField();

      if (result) {
        const payLoard = {
          accountHolderName: holderName,
          bankName,
          branchCode,
          branchName,
          accountNo,
          partnerId: vendorCode
        };

        this.httpClientService.saveBankDetails(payLoard).subscribe(
          data => this.manageBankResponse(data),
        );
      } else {
        Swal.fire(
          'Whoops...!',
          'Please fill empty required fields..!',
          'warning'
        );
      }
    } else {
      Swal.fire(
        'Whoops...!',
        'No Changes Found..!',
        'info'
      );
    }

  }

  private validationTextField() {
    let holderNameAvilabilty = true;
    let bankNameAvilabilty = true;
    let branchCodeAvilabilty = true;
    let branchNameAvilabilty = true;
    let accountNoAvilabilty = true;
    let bankStatementAvilabilty = true;

    const holderName = (document.getElementById('holderName') as HTMLInputElement).value;
    if (holderName != '') {
      document.getElementById('holderName').style.borderColor = 'green';
      document.getElementById('lblHoderName').style.display = 'none';
      holderNameAvilabilty = true;
    } else {
      document.getElementById('holderName').style.borderColor = 'red';
      document.getElementById('lblHoderName').style.display = 'block';
      holderNameAvilabilty = false;
    }

    const bankName = (document.getElementById('bankName') as HTMLInputElement).value;
    if (bankName != '') {
      document.getElementById('bankName').style.borderColor = 'green';
      document.getElementById('lblBankName').style.display = 'none';
      bankNameAvilabilty = true;
    } else {
      document.getElementById('bankName').style.borderColor = 'red';
      document.getElementById('lblBankName').style.display = 'block';
      bankNameAvilabilty = false;
    }

    const branchCode = (document.getElementById('branchCode') as HTMLInputElement).value;
    if (branchCode != '') {
      document.getElementById('branchCode').style.borderColor = 'green';
      document.getElementById('lblbranchCode').style.display = 'none';
      branchNameAvilabilty = true;
    } else {
      document.getElementById('branchCode').style.borderColor = 'red';
      document.getElementById('lblbranchCode').style.display = 'block';
      branchCodeAvilabilty = false;
    }

    const branchName = (document.getElementById('branchName') as HTMLInputElement).value;
    if (branchName != '') {
      document.getElementById('branchName').style.borderColor = 'green';
      document.getElementById('lblBranchName').style.display = 'none';
      branchNameAvilabilty = true;
    } else {
      document.getElementById('branchName').style.borderColor = 'red';
      document.getElementById('lblBranchName').style.display = 'block';
      branchNameAvilabilty = false;
    }

    const accountNo = (document.getElementById('accountNo') as HTMLInputElement).value;
    if (accountNo != '') {
      document.getElementById('accountNo').style.borderColor = 'green';
      document.getElementById('lblAccountNo').style.display = 'none';
      accountNoAvilabilty = true;
    } else {
      document.getElementById('accountNo').style.borderColor = 'red';
      document.getElementById('lblAccountNo').style.display = 'block';
      accountNoAvilabilty = false;
    }

    const bankStatement = (document.getElementById('bankStatement') as HTMLInputElement).value;
    if (this.isBankStAvailable === true) {
      document.getElementById('bankStatement').style.borderColor = 'green';
      document.getElementById('lblBankStatement').style.display = 'none';
      bankStatementAvilabilty = true;
    } else {
      document.getElementById('bankStatement').style.borderColor = 'red';
      document.getElementById('lblBankStatement').style.display = 'block';
      bankStatementAvilabilty = false;
    }

    if (holderNameAvilabilty === true && bankNameAvilabilty === true && branchCodeAvilabilty === true && branchNameAvilabilty === true && accountNoAvilabilty === true && bankStatementAvilabilty === true) {
      return true;
    } else {
      return false;
    }
  }

  validateHolder() {
    document.getElementById('holderName').style.borderColor = 'gray';
    document.getElementById('lblHoderName').style.display = 'none';
  }

  validateBank() {
    document.getElementById('bankName').style.borderColor = 'gray';
    document.getElementById('lblBankName').style.display = 'none';
  }

  validateBranchCode() {
    document.getElementById('branchCode').style.borderColor = 'gray';
    document.getElementById('lblbranchCode').style.display = 'none';
  }

  validateBranch() {
    document.getElementById('branchName').style.borderColor = 'gray';
    document.getElementById('lblBranchName').style.display = 'none';
  }

  validateAccNo() {
    document.getElementById('accountNo').style.borderColor = 'gray';
    document.getElementById('lblAccountNo').style.display = 'none';
  }

  validateStatement() {
    document.getElementById('bankStatement').style.borderColor = 'gray';
    document.getElementById('lblBankStatement').style.display = 'none';
  }

  private manageBankResponse(data: any) {

    if (data.message_status === 'Failed') {
      Swal.fire(
        'Whoops...!',
        data.message,
        'error'
      );
    } else {

      if (this.selectedFile) {
        const temp_code = sessionStorage.getItem('temp_code');
        const bankStatementFile = this.bankStatement.value.bankStatement;

        this.httpClientService.uploadPartnerBankStatement(this.selectedFile, temp_code).subscribe(
          data => this.successAlert(data),
          error => this.alartFunction(error.status)
        );
      } else {
        Swal.fire(
          'Save Successfully...!',
          data.message,
          'success'
        );
        this.getVendorBankDetails(sessionStorage.getItem('temp_code'));
      }
    }
  }

  successAlert(data) {
    Swal.fire(
      'Save Successfully...!',
      data.message,
      'success'
    );
    this.getVendorBankDetails(sessionStorage.getItem('temp_code'));
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (event.target.files.length === 0) {
      return;
    }

    // Image upload validation
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      (document.getElementById('statementImage') as HTMLInputElement).src = reader.result.toString();
    };

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource1: file
      });
      this.isBankStAvailable = true;
    }
  }

  getVendorBankDetails(temp_code: string) {
    this.httpClientService.getVendorAccDetailsById(temp_code).subscribe(
      data => this.showUserBankDetails(data),
      error => this.alartFunction(error.status)
    );
  }

  showUserBankDetails(data) {
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {

          this.holdername = data.data[i].account_holdername;
          this.bankName = data.data[i].bank_name;
          this.branchCode = data.data[i].branch_code;
          this.branchName = data.data[i].branch_name;
          this.accountNo = data.data[i].account_no;
          this.bstatement = data.data[i].bank_statement;

          this.partnerBankDetailsEdit = new FormGroup({
            holderName: new FormControl(data.data[i].account_holdername),
            bankName: new FormControl(data.data[i].bank_name),
            branchCode: new FormControl(data.data[i].branch_code),
            branchName: new FormControl(data.data[i].branch_name),
            accountNo: new FormControl(data.data[i].account_no),
          });

          if (data.data[i].bank_statement != '') {
            this.statementImage = data.data[i].bank_statement;
            this.isBankStAvailable = true;
          }
        } else {
          this.partnerBankDetailsEdit = new FormGroup({
            holderName: new FormControl(''),
            bankName: new FormControl(''),
            branchCode: new FormControl(''),
            branchName: new FormControl(''),
            accountNo: new FormControl(''),
          });
        }
      }
    }
  }

  updateBusinessDetails() {

    let businessRegisterImageAvilabilty = true;
    const PbusinessRegisterNo = (document.getElementById('PbusinessRegisterNo') as HTMLInputElement).value;
    const PartnerTypeCheck = this.partnerBusinessDetailsEdit.value.BPartnerType;

    if (this.isRegDocAvailable === false && PartnerTypeCheck === 'company') {
      document.getElementById('businessRegisterImage').style.borderColor = 'red';
      document.getElementById('lblbusinessRegisterImage').style.display = 'block';
      businessRegisterImageAvilabilty = false;

    } else if (PbusinessRegisterNo === '' && PartnerTypeCheck === 'company') {

      document.getElementById('PbusinessRegisterNo').style.borderColor = 'red';
      document.getElementById('businessRegisterNoLBL').style.display = 'block';
      businessRegisterImageAvilabilty = false;

    } else {
      document.getElementById('PbusinessRegisterNo').style.borderColor = 'green';
      document.getElementById('lblbusinessRegisterImage').style.display = 'none';

      document.getElementById('businessRegisterImage').style.borderColor = 'green';
      document.getElementById('businessRegisterNoLBL').style.display = 'none';
      businessRegisterImageAvilabilty = true;
    }

    if (businessRegisterImageAvilabilty) {
      const payLoard = {
        type: this.partnerBusinessDetailsEdit.value.BPartnerType,
        businessName: this.partnerBusinessDetailsEdit.value.partnerBusinessName,
        businessRegisterNo: this.partnerBusinessDetailsEdit.value.PbusinessRegisterNo,
        ownerName: this.partnerBusinessDetailsEdit.value.businessownerName,
        email: this.partnerBusinessDetailsEdit.value.emailPartner,
        mobile: this.partnerBusinessDetailsEdit.value.businessContactNo,
        businessAddress: this.partnerBusinessDetailsEdit.value.businessPartnerAddress,
        social_url: this.partnerBusinessDetailsEdit.value.socialURL,
        temp_code: sessionStorage.getItem('temp_code'),
      };

      let requiredMail = false;
      let requiredMobile = false;
      let requiredAddress = false;
      let requiredRegistorNo = false;
      let requiredImg = false;
      let requiredNICImg = false;
      if (payLoard.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && payLoard.email !== '') {
        requiredMail = true;
        document.getElementById('emailPartner').style.borderColor = 'green';
        document.getElementById('emailPartnerLBL').style.display = 'none';
      } else {
        document.getElementById('emailPartner').style.borderColor = 'red';
        document.getElementById('emailPartnerLBL').style.display = 'block';
        requiredMail = false;
      }

      if (payLoard.mobile !== '' && payLoard.mobile.match(/^\+?\d+$/)) {
        requiredMobile = true;
        document.getElementById('businessContactNo').style.borderColor = 'green';
        document.getElementById('businessContactNoLBL').style.display = 'none';

      } else {
        requiredMobile = false;
        document.getElementById('businessContactNo').style.borderColor = 'red';
        document.getElementById('businessContactNoLBL').style.display = 'block';
      }

      if (payLoard.businessAddress !== '') {
        requiredAddress = true;
        document.getElementById('businessPartnerAddress').style.borderColor = 'green';
        document.getElementById('businessAddressLBL').style.display = 'none';

      } else {
        requiredAddress = false;
        document.getElementById('businessPartnerAddress').style.borderColor = 'red';
        document.getElementById('businessAddressLBL').style.display = 'block';

      }

      if (payLoard.businessRegisterNo !== '') {
        requiredRegistorNo = true;
        document.getElementById('PbusinessRegisterNo').style.borderColor = 'green';
        document.getElementById('businessRegisterNoLBL').style.display = 'none';

      } else {
        requiredRegistorNo = false;
        document.getElementById('PbusinessRegisterNo').style.borderColor = 'red';
        document.getElementById('businessRegisterNoLBL').style.display = 'block';

      }

      if ((document.getElementById('registerDoc') as HTMLInputElement).src !== '') {
        requiredImg = true;
        document.getElementById('businessRegisterImage').style.borderColor = 'green';
        document.getElementById('lblbusinessRegisterImage').style.display = 'none';

      } else {
        requiredImg = false;
        document.getElementById('businessRegisterImage').style.borderColor = 'red';
        document.getElementById('lblbusinessRegisterImage').style.display = 'block';
      }


      if (sessionStorage.getItem('userType') === 'company') {
        if (requiredMail && requiredMobile && requiredAddress && requiredRegistorNo && requiredImg) {

          this.httpClientService.updatePartnerBusinessDetails(payLoard).subscribe(
            data => this.manageUpdatedPartner(data),
            error => this.alartFunction(error.status)
          );

        }
      } else if (sessionStorage.getItem('userType') === 'individual') {
        if ((document.getElementById('nicImg') as HTMLInputElement).src !== '' && this.nicImg != null) {
          requiredNICImg = true;
          document.getElementById('lblNicImage').style.display = 'none';
          document.getElementById('nicImage').style.borderColor = 'green';

        } else {
          requiredNICImg = false;
          document.getElementById('lblNicImage').style.display = 'block';
          document.getElementById('nicImage').style.borderColor = 'red';
        }

        if (requiredMail && requiredMobile && requiredAddress && requiredNICImg) {

          this.httpClientService.updatePartnerBusinessDetails(payLoard).subscribe(
            data => this.nicImageUpdate(),
            error => this.alartFunction(error.status)
          );

        }
      }

    }
  }

  manageUpdatedPartner(data) {
    this.brDocUpload(data);
  }


  brDocUpload(data) {
    let ids1: any;
    ids1 = sessionStorage.getItem('temp_code');

    if (this.selectedRegDocFile) {
      this.httpClientService.uploadBrImage(this.selectedRegDocFile, ids1).subscribe(
        data => this.manageImageUploardmageUploard(data),
        error => this.alartFunction(error.status)
      );
    } else {
      Swal.fire(
        'Good job',
        'Partner Update Success...',
        'success'
      );
      this.router.navigate(['/dashboard/default']);
    }
  }

  validateBRegNo() {
    document.getElementById('PbusinessRegisterNo').style.borderColor = 'gray';
    document.getElementById('businessRegisterNoLBL').style.display = 'none';
  }

  validateBusinessRegImg() {
    document.getElementById('businessRegisterImage').style.borderColor = 'gray';
    document.getElementById('lblbusinessRegisterImage').style.display = 'none';
  }

  onRegDocSelected(event: any) {
    this.selectedRegDocFile = event.target.files[0];

    if (event.target.files.length === 0) {
      return;
    }

    // Image upload validation
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      (document.getElementById('registerDoc') as HTMLInputElement).src = reader.result.toString();
    };

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource2: file
      });
      this.isRegDocAvailable = true;
    }
  }

  nicImgFileSelected(event: any) {
    this.selectNicImgFile = event.target.files[0];

    if (event.target.files.length === 0) {
      return;
    }

    // Image upload validation
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    // select image set
    reader.onload = (_event) => {
      (document.getElementById('nicImg') as HTMLInputElement).src = reader.result.toString();
    };

    if (event.target.files.length > 0) {
      this.individual = true;
      this.nicImg = event.target.files[0].name;
    }
  }

  nicImageUpdate() {
    const tempCode = sessionStorage.getItem('temp_code');

    this.httpClientService.uploadNic(this.selectNicImgFile, tempCode).subscribe(
      data => this.manageImageUploardmageUploard(data)
    );

  }
}
