import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import Swal from 'sweetalert2';
import {HttpClientService} from '../../../shared/service/http-client.service';
import {Router} from '@angular/router';
import {CategoryService} from '../../../shared/service/category.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss']
})
export class CreatePartnerComponent implements OnInit {

  public categoryAvailability = false;
  public isChecked = false;
  public userGroup: FormGroup;
  public isAvailableBR = false;

  public businessRegisterImage: FormGroup;
  public bankStatement: FormGroup;
  @Input()
  public productPrefixArray = [];
  public imageCliant: FormGroup;
  public partnerGroupArr = [];
  public eyeIcon = 'fa fa-fw fa-eye field-icon';
  public eyeIcon2 = 'fa fa-fw fa-eye-slash field-icon';
  public type = 'password';
  public type2 = 'password';
  public contactNumber = '';
  public fullName = '';
  public productCategoryArray = [];
  public productSubCategoryArray = [];
  public partnerCategories = [];
  public catpathName = [];
  public sendCategory = [];
  public allCategoryBreadcrumbArr = [];
  public subsubcategoryArray = [];
  public subsubCatAarray = [];
  public checkStatus = false;
  isGray = true; // Initial color state
  private isAgreed = false;
  public category = '';
  @ViewChild('pdftable') pdftable!: ElementRef;
  bankStatementFile: File | null = null;
  businessRgDocFile: File | null = null;
  nic: File | null = null;
  public PartnerTempCode = '';
  businessName: string = '';
  sanitizedBusinessName: string = '';
  showInput: boolean = false;
  isCompany:boolean=false;
  isIndividual:boolean=false;

  constructor(private httpClientService: HttpClientService, private router: Router, private categoryService: CategoryService) {
    this.getAllCategory();
    this.createFormController();
    this.imageControlMethord();
    this.BusinessRegisterFileControlMethod();
    this.BankStatementControlMethod();
    this.setValueForCustomerField();
    this.getSubSubCategoryAll();
  }

  ngOnInit(): void {
  }

  // isAvailable(){
  //   if (this.userGroup.value.PartnerType === 'company') {
  //   this.checkStatus = true;
  //   // (document.getElementById('businessRegisterImage') as HTMLInputElement).required = true;
  //
  // } else {
  //   this.checkStatus = false;
  //   // (document.getElementById('businessRegisterImage') as HTMLInputElement).required = false;
  // }
  //
  // }

  onBusinessNameChange(){
    this.showInput=true;
    this.sanitizedBusinessName = this.businessName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');

  }

  addPrefixs() {
    (document.getElementById('productPrefix') as HTMLInputElement).value = '';
    const arPr = {
      productPrefix: this.userGroup.value.productPrefix
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

  createFormController() {
    this.userGroup = new FormGroup({
      productPrefix: new FormControl(''),
      contactPersonName: new FormControl(''),
      contactNo: new FormControl(''),
      nic: new FormControl(''),
      companyName: new FormControl(''),
      userName: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      Confpassword: new FormControl(''),
      businessName: new FormControl(''),
      businessRegisterNo: new FormControl(''),
      ownerName: new FormControl(''),
      emailPartner: new FormControl(''),
      businessContactNo: new FormControl(''),
      businessAddress: new FormControl(''),
      bankAccount: new FormControl(''),
      bankName: new FormControl(''),
      branchName: new FormControl(''),
      branchCode: new FormControl(''),
      supplierGroup: new FormControl(''),
      creditCardSave: new FormControl(''),
      PartnerType: new FormControl(''),
      roleName: new FormControl(''),
      socialURL: new FormControl(''),
      fileSource: new FormControl('')
    });
  }

  setValueForCustomerField() {
    this.userGroup.get('contactPersonName').setValue(sessionStorage.getItem('contactPersonName'));
    this.userGroup.get('contactNo').setValue(sessionStorage.getItem('contact_number'));
    this.userGroup.get('email').setValue(sessionStorage.getItem('email'));
    this.userGroup.get('userName').setValue(sessionStorage.getItem('email'));
  }

  savePartner() {
    if (this.isAgreed == true) {
      const productPrefix = [];
      for (let i = 0; i < this.productPrefixArray.length; i++) {
        productPrefix.push(this.productPrefixArray[i].productPrefix);
      }

      const payLoard = {
        contactPersonName: this.userGroup.value.contactPersonName,
        companyName: this.userGroup.value.companyName,
        userName: this.userGroup.value.email,
        email: this.userGroup.value.email,
        contactNo: this.userGroup.value.contactNo,
        password: this.userGroup.value.password,
        partnerUser: {
          partner_u_id: '',
          type: this.userGroup.value.PartnerType,
          businessName: this.userGroup.value.businessName,
          ownerName: this.userGroup.value.ownerName,
          email: this.userGroup.value.emailPartner,
          mobile: this.userGroup.value.contactNo,
          businessAddress: this.userGroup.value.businessAddress,
          bankAccount: '',
          bankName: '',
          social_url: this.userGroup.value.socialURL,
          pdf_scanDocument: '',
          creditCardSave: this.userGroup.value.creditCardSave,
          supplier_group: this.userGroup.value.supplierGroup,
          productPrefix,
          partnerCategories: this.sendCategory,
          shop_name:this.sanitizedBusinessName,
          businessRegisterNo: this.userGroup.value.businessRegisterNo,
          image_br:this.businessRegisterImage.value.businessRegisterImage,
          nic: this.userGroup.value.nic
        },
        role: ['Partner']
      };

      const result = this.validationTextField();

      if (result) {
        this.httpClientService.addUser(payLoard).subscribe(
          data => {
            this.managePartnerResponse(data);
          },
          error => this.managePartnerErrorResponse(error.status)
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
        'Please accept user agreement..!',
        'warning'
      );
    }
  }
  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.nic = fileList[0];
    } else {
      this.nic = null;
    }
  }

  imageUploard(data) {
    const images = this.imageCliant.get('fileSource').value;
    const ids = data.data.partner_temp_code;
    this.httpClientService.uploardImage(images, ids).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      data => this.manageImageUploardmageUploard(data),
      error => this.alartFunction(error.status)
    );
  }

  brDocUpload(data) {
    // const brFile = this.businessRegisterImage.get('fileSource').value;

    let ids1: any;
    ids1 = data.data.partner_temp_code;
    this.httpClientService.uploadBrImage(this.businessRgDocFile, ids1).subscribe(
      data => this.manageImageUploardmageUploard(data),
      error => this.alartFunction(error.status)
    );
  }

  getSubSubCategoryAll() {
    this.categoryService.getSubSubCategoryFOrEdit().subscribe(
      data => this.manageSubSubCategoryFOrEdit(data),
    );
  }

  bankStatementUpload(data) {
    const holderName = (document.getElementById('ownerName') as HTMLInputElement).value;
    const bankName = (document.getElementById('bankName') as HTMLInputElement).value;
    const branchCode = (document.getElementById('branchCode') as HTMLInputElement).value;
    const branchName = (document.getElementById('branchName') as HTMLInputElement).value;
    const accountNo = (document.getElementById('bankAccount') as HTMLInputElement).value;
    this.PartnerTempCode = data.data.partner_temp_code;

    const payLoard = {
      accountHolderName: holderName,
      bankName: bankName,
      branchCode: branchCode,
      branchName: branchName,
      accountNo: accountNo,
      partnerId: this.PartnerTempCode
    };


    this.httpClientService.saveBankDetails(payLoard).subscribe(
      data => this.manageBankResponse(data,this.PartnerTempCode),
    );
  }

  private manageBankResponse(data: any, PartnerTempCode: string) {
    if (data.message_status === 'Failed') {
      Swal.fire(
        'Bank Details Registration Faild...!',
        data.message,
        'error'
      );
    } else {

      if (this.bankStatementFile) {
        const temp_code =  PartnerTempCode;

        this.httpClientService.uploadPartnerBankStatement(this.bankStatementFile, temp_code).subscribe(
          data => this.manageImageUploardmageUploard(data),
          error => this.alartFunction(error.status)
        );
      }

      /*const bankStatementFile = this.bankStatement.get('fileSource').value;
      const temp_code = data.data.partner_temp_code;
      this.httpClientService.uploadBankStatement(this.bankStatementFile, ids).subscribe(
        data => this.manageImageUploardmageUploard(data),
        error => this.alartFunction(error.status)
      );*/
    }
  }

  ToggleBankdetails() {
    this.isGray = !this.isGray; // Toggle the color state

    if (this.isChecked == true) {
      this.isChecked = false;

      // (document.getElementById('businessRegisterImage') as HTMLInputElement).disabled = true;
      // (document.getElementById('businessRegisterNo') as HTMLInputElement).disabled = true;
      (document.getElementById('bankStatement') as HTMLInputElement).disabled = true;
      (document.getElementById('bankAccount') as HTMLInputElement).disabled = true;
      (document.getElementById('bankName') as HTMLInputElement).disabled = true;
      (document.getElementById('branchName') as HTMLInputElement).disabled = true;
      (document.getElementById('branchCode') as HTMLInputElement).disabled = true;

      // document.getElementById('businessRegisterImage').style.borderColor = 'lightgray';
      // document.getElementById('businessRegisterNo').style.borderColor = 'lightgray';
      document.getElementById('bankStatement').style.borderColor = 'lightgray';
      document.getElementById('businessRegisterBL').style.display = 'none';
      document.getElementById('bankStatementLBL').style.display = 'none';

    } else {
      this.isChecked = true;
      // (document.getElementById('businessRegisterImage') as HTMLInputElement).disabled = false;
      (document.getElementById('bankStatement') as HTMLInputElement).disabled = false;
      (document.getElementById('bankAccount') as HTMLInputElement).disabled = false;
      (document.getElementById('bankName') as HTMLInputElement).disabled = false;
      (document.getElementById('branchName') as HTMLInputElement).disabled = false;
      (document.getElementById('branchCode') as HTMLInputElement).disabled = false;
    }
  }

  alartFunction(data) {

  }

  eventHandle() {
    document.getElementById('PartnerType').style.borderColor = 'gray';
    document.getElementById('LBLPartnerType').style.display = 'none';

    if (this.userGroup.value.PartnerType === 'individual') {
      // document.getElementById('spanBRimage').style.display = 'none';
      // document.getElementById('spanBRimageNo').style.display = 'none';
      // document.getElementById('businessRegisterBL').style.display = 'none';
      // document.getElementById('businessRegisterImage').style.borderColor = 'lightgray';
      // document.getElementById('businessRegisterNo').style.borderColor = 'lightgray';
      this.isAvailableBR = true;
      this.checkStatus = false;
      this.isIndividual=true;
      this.isCompany=false;
      // (document.getElementById('businessRegisterImage') as HTMLInputElement).required = true;

    } else {
      this.checkStatus = true;
      this.isCompany=true;
      this.isIndividual=false;
      // document.getElementById('spanBRimage').style.display = 'block';
      // document.getElementById('spanBRimageNo').style.display = 'block';
      // (document.getElementById('businessRegisterImage') as HTMLInputElement).required = false;
    }
  }

  manageImageUploardmageUploard(data) {

  }

  validationTextField() {
    let contactPersonNameAvilabilty = true;
    let emailAvilabilty = true;
    let contactNoAvilabilty = true;
    const companyNameAvilabilty = true;

    let businessContactNoAvilabilty = true;
    let businessNameAvilabilty = true;
    let ownerNameAvilabilty = true;
    let partnerTypeAvilabilty = true;
    let emailPartnerAvilabilty = true;

    let bankNameAvilabilty = true;
    let branchCodeAvilabilty = true;
    let branchNameAvilabilty = true;
    let bankAccountAvilabilty = true;
    let businessRegisterNoAvilabilty = true;
    let bankStatementAvilabilty = true;
    let businessRegisterImageAvilabilty = true;
    let partnerNicAvilabilty = true;

    // const result02 = true;
    // const result05 = true;
    // const result08 = true;

    /*const contactPersonName = (document.getElementById('contactPersonName') as HTMLInputElement).value;
    if (contactPersonName != '') {
      document.getElementById('contactPersonName').style.borderColor = 'green';
      document.getElementById('LBLcontactPersonName').style.display = 'none';
      contactPersonNameAvilabilty = true;
    } else {
      document.getElementById('contactPersonName').style.borderColor = 'red';
      document.getElementById('LBLcontactPersonName').style.display = 'block';
      contactPersonNameAvilabilty = false;
    }*/

    /*const companyName = (document.getElementById('validationCustom6') as HTMLInputElement).value;
    if (companyName != '') {
      document.getElementById('validationCustom6').style.borderColor = 'green';
      document.getElementById('LBLcompanyName').style.display = 'none';
      companyNameAvilabilty = true;
    } else {
      document.getElementById('validationCustom6').style.borderColor = 'red';
      document.getElementById('LBLcompanyName').style.display = 'block';
      companyNameAvilabilty = false;
    }*/

    /*const supplierGroup = (document.getElementById('supplier_group') as HTMLInputElement).value;
    if (supplierGroup != '') {
      document.getElementById('supplier_group').style.borderColor = 'green';
      document.getElementById('LBLsupplierGroup').style.display = 'none';
      result08 = true;
    } else {
      document.getElementById('supplier_group').style.borderColor = 'red';
      document.getElementById('LBLsupplierGroup').style.display = 'block';
      result08 = false;
    }*/

    /*const teliRegex = /^[0-9]{10}$/;
    const teli = (document.getElementById('contactNo') as HTMLInputElement).value;
    const teliResult = teliRegex.test(teli);
    if (teliResult) {
      document.getElementById('contactNo').style.borderColor = 'green';
      document.getElementById('contactNoBL').style.display = 'none';
      contactNoAvilabilty = true;
    } else {
      document.getElementById('contactNo').style.borderColor = 'red';
      document.getElementById('contactNoBL').style.display = 'block';
      contactNoAvilabilty = false;
    }*/

    /*const email = (document.getElementById('email') as HTMLInputElement).value;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const emailResult = emailRegex.test(email);

    if (emailResult) {
      document.getElementById('email').style.borderColor = 'green';
      document.getElementById('emailLBL').style.display = 'none';
      emailAvilabilty = true;
    } else {
      document.getElementById('email').style.borderColor = 'red';
      document.getElementById('emailLBL').style.display = 'block';
      emailAvilabilty = false;
    }*/

    const businessName = (document.getElementById('businessName') as HTMLInputElement).value;
    if (businessName != '') {
      document.getElementById('businessName').style.borderColor = 'green';
      document.getElementById('LBLbusinessName').style.display = 'none';
      businessNameAvilabilty = true;
    } else {
      document.getElementById('businessName').style.borderColor = 'red';
      document.getElementById('LBLbusinessName').style.display = 'block';
      businessNameAvilabilty = false;
    }

    const ownerName = (document.getElementById('ownerName') as HTMLInputElement).value;
    if (ownerName != '') {
      document.getElementById('ownerName').style.borderColor = 'green';
      document.getElementById('LBLownerName').style.display = 'none';
      ownerNameAvilabilty = true;
    } else {
      document.getElementById('ownerName').style.borderColor = 'red';
      document.getElementById('LBLownerName').style.display = 'block';
      ownerNameAvilabilty = false;
    }

    const PartnerType = (document.getElementById('PartnerType') as HTMLInputElement).value;
    if (PartnerType != '') {
      document.getElementById('PartnerType').style.borderColor = 'green';
      document.getElementById('LBLPartnerType').style.display = 'none';
      partnerTypeAvilabilty = true;
    } else {
      document.getElementById('PartnerType').style.borderColor = 'red';
      document.getElementById('LBLPartnerType').style.display = 'block';
      partnerTypeAvilabilty = false;
    }

    const teliRegex = /^[0-9]{10}$/;
    const businessContactNoValidationValue = (document.getElementById('businessContactNo') as HTMLInputElement).value;
    const BusinessContactValidationResult = teliRegex.test(businessContactNoValidationValue);
    if (BusinessContactValidationResult) {
      document.getElementById('businessContactNo').style.borderColor = 'green';
      document.getElementById('businessContactNoLBL').style.display = 'none';
      businessContactNoAvilabilty = true;
    } else if (businessContactNoValidationValue == '') {
      document.getElementById('businessContactNo').style.borderColor = 'red';
      document.getElementById('businessContactNoLBL').style.display = 'block';
      businessContactNoAvilabilty = false;
    } else {
      document.getElementById('businessContactNo').style.borderColor = 'red';
      document.getElementById('businessContactNoLBL').style.display = 'block';
      businessContactNoAvilabilty = false;
    }

    const businessEmail = (document.getElementById('emailPartner') as HTMLInputElement).value;
    const businessEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const businessEmailResult = businessEmailRegex.test(businessEmail);
    if (businessEmailResult) {
      document.getElementById('emailPartner').style.borderColor = 'green';
      document.getElementById('emailPartnerLBL').style.display = 'none';
      emailPartnerAvilabilty = true;
    } else {
      document.getElementById('emailPartner').style.borderColor = 'red';
      document.getElementById('emailPartnerLBL').style.display = 'block';
      emailPartnerAvilabilty = false;
    }

    if (this.categoryAvailability) {
      document.getElementById('category_ids').style.borderColor = 'green';
      document.getElementById('CategoryLBL').style.display = 'none';
    } else {
      document.getElementById('category_ids').style.borderColor = 'red';
      document.getElementById('CategoryLBL').style.display = 'block';
    }


    if(this.isCompany){
      const businessRegisterNo = (document.getElementById('businessRegisterNo') as HTMLInputElement).value;
      if (businessRegisterNo == '') {
        document.getElementById('businessRegisterNo').style.borderColor = 'red';
        document.getElementById('businessRegisterNoLBL').style.display = 'block';
        businessRegisterNoAvilabilty = false;
      } else {
        document.getElementById('businessRegisterNo').style.borderColor = 'green';
        document.getElementById('businessRegisterNoLBL').style.display = 'none';
        businessRegisterNoAvilabilty = true;
      }

      const BusinessRegfileAvailability = (document.getElementById('businessRegisterImage') as HTMLInputElement).value;
      const PartnerTypeCheck = this.userGroup.value.PartnerType;
      if (BusinessRegfileAvailability == '' && PartnerTypeCheck == 'company') {
        document.getElementById('businessRegisterImage').style.borderColor = 'red';
        document.getElementById('businessRegisterBL').style.display = 'block';
        businessRegisterImageAvilabilty = false;

      } else if (PartnerTypeCheck == 'individual' || BusinessRegfileAvailability != '') {
        document.getElementById('businessRegisterImage').style.borderColor = 'green';
        document.getElementById('businessRegisterBL').style.display = 'none';
        businessRegisterImageAvilabilty = true;

      } else {
        document.getElementById('businessRegisterImage').style.borderColor = 'green';
        document.getElementById('businessRegisterBL').style.display = 'none';
        businessRegisterImageAvilabilty = true;
      }

    }

    if(this.isIndividual){
      // nic validation here
      const nicAvilable=(document.getElementById('nic') as HTMLInputElement).value;

      if (nicAvilable != '') {
        document.getElementById('nic').style.borderColor = 'green';
        document.getElementById('nicLBL').style.display = 'none';
        partnerNicAvilabilty = true;
      } else {
        document.getElementById('nic').style.borderColor = 'red';
        document.getElementById('nicLBL').style.display = 'block';
        partnerNicAvilabilty = false;
      }

    }

    if (this.isChecked) {
      const bankName = (document.getElementById('bankName') as HTMLInputElement).value;
      if (bankName == '') {
        document.getElementById('bankName').style.borderColor = 'red';
        document.getElementById('bankNameLBL').style.display = 'block';
        bankNameAvilabilty = false;
      } else {
        document.getElementById('bankName').style.borderColor = 'green';
        document.getElementById('bankNameLBL').style.display = 'none';
        bankNameAvilabilty = true;
      }
      const branchCode = (document.getElementById('branchCode') as HTMLInputElement).value;
      if (branchCode == '') {
        document.getElementById('branchCode').style.borderColor = 'red';
        document.getElementById('branchCodeLBL').style.display = 'block';
        branchCodeAvilabilty = false;
      } else {
        document.getElementById('branchCode').style.borderColor = 'green';
        document.getElementById('branchCodeLBL').style.display = 'none';
        branchCodeAvilabilty = true;
      }
      const branchName = (document.getElementById('branchName') as HTMLInputElement).value;
      if (branchName == '') {
        document.getElementById('branchName').style.borderColor = 'red';
        document.getElementById('branchNameLBL').style.display = 'block';
        branchNameAvilabilty = false;
      } else {
        document.getElementById('branchName').style.borderColor = 'green';
        document.getElementById('branchNameLBL').style.display = 'none';
        branchNameAvilabilty = true;
      }
      const bankAccount = (document.getElementById('bankAccount') as HTMLInputElement).value;
      if (bankAccount == '') {
        document.getElementById('bankAccount').style.borderColor = 'red';
        document.getElementById('bankAccountLBL').style.display = 'block';
        bankAccountAvilabilty = false;
      } else {
        document.getElementById('bankAccount').style.borderColor = 'green';
        document.getElementById('bankAccountLBL').style.display = 'none';
        bankAccountAvilabilty = true;
      }

      const BankStatementFileAvailability = (document.getElementById('bankStatement') as HTMLInputElement).value;
      if (BankStatementFileAvailability == '') {
        document.getElementById('bankStatement').style.borderColor = 'red';
        document.getElementById('bankStatementLBL').style.display = 'block';
        bankStatementAvilabilty = false;
      } else {
        document.getElementById('bankStatement').style.borderColor = 'green';
        document.getElementById('bankStatementLBL').style.display = 'none';
        bankStatementAvilabilty = true;
      }

    }

    /*const passwordConform = (document.getElementById('Confpassword') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    if (password === passwordConform) {
      document.getElementById('Confpassword').style.borderColor = 'green';
      result05 = true;
    } else {
      document.getElementById('Confpassword').style.borderColor = 'red';
      result05 = false;
      Swal.fire(
        'Whoops...!',
        'Password not match',
        'error'
      );
    }
    if (PartnerTypeCheck === 'company' && PartnerTypeCheck === '') {
      this.isAvailableBR = false;
    } else {
      this.isAvailableBR = true;
    }*/

    // tslint:disable-next-line:max-line-length
    if (this.isChecked) {
      if (bankAccountAvilabilty && branchNameAvilabilty && branchCodeAvilabilty && bankNameAvilabilty
        && this.categoryAvailability && bankStatementAvilabilty && emailPartnerAvilabilty
        && partnerTypeAvilabilty && ownerNameAvilabilty && businessNameAvilabilty && businessContactNoAvilabilty) {
        return true;
      } else {
        return false;
      }
    } else {
      if (businessContactNoAvilabilty && businessNameAvilabilty && ownerNameAvilabilty && partnerTypeAvilabilty && emailPartnerAvilabilty
        && this.categoryAvailability && businessRegisterNoAvilabilty && businessRegisterImageAvilabilty && partnerNicAvilabilty) {
        return true;
      } else {
        return false;
      }
    }
  }
  uploadNic(data){
    const ids = data.data.partner_temp_code;
    this.httpClientService.uploadNic(this.nic, ids).subscribe(
      // error => this.alartFunction(error.status)
    );
  }

  managePartnerResponse(data) {

    this.uploadNic(data);
    this.imageUploard(data);
    this.brDocUpload(data);
    this.bankStatementUpload(data);
    this.createFormController();

    this.productPrefixArray = [];
    this.router.navigate(['/message']);
  }

  managePartnerErrorResponse(error) {

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

    // ========================================================

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource: file
      });
    }
    // if (event.target.files.length > 0) {
    //   const file3 = event.target.files[0];
    //   this.businessRegister.patchValue({
    //     fileSource: file3
    //   });
    // }
    // if (event.target.files.length > 0) {
    //   const file4 = event.target.files[0];
    //   this.bankStatement.patchValue({
    //     fileSource: file4
    //   });
    // }
  }

  changeValue2(event: any) {
    this.businessRgDocFile = event.target.files[0];
    document.getElementById('businessRegisterImage').style.borderColor = 'gray';
    document.getElementById('businessRegisterBL').style.display = 'none';
  }

  changeValue3(event: any) {
    this.bankStatementFile = event.target.files[0];
    document.getElementById('bankStatement').style.borderColor = 'gray';
    document.getElementById('bankStatementLBL').style.display = 'none';
  }

  imageControlMethord() {
    this.imageCliant = new FormGroup({
      imageOne: new FormControl(''),
      fileSource: new FormControl('')
    });
  }

  BusinessRegisterFileControlMethod() {
    this.businessRegisterImage = new FormGroup({
      businessRegisterImage: new FormControl('', Validators.required),
      fileSource: new FormControl('', Validators.required)
    });
  }

  BankStatementControlMethod() {
    this.bankStatement = new FormGroup({
      bankStatement: new FormControl('', Validators.required),
      fileSource: new FormControl('', Validators.required)
    });
  }

  removeCategoryBreadcrum(index) {
    (document.getElementById('addCategoryBtn') as HTMLInputElement).disabled = false;


    for (let i = 0; i < this.allCategoryBreadcrumbArr.length; i++) {
      if (this.allCategoryBreadcrumbArr[index] == this.allCategoryBreadcrumbArr[i]) {
        this.allCategoryBreadcrumbArr.splice(i, 1);
      }
    }
    // ------------------validation for Category Availability------------
    if (this.allCategoryBreadcrumbArr.length == 0) {
      this.categoryAvailability = false;
    }
  }

  catSelect() {
    const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
    const select = document.getElementById('breadcrum');
    this.categoryAvailability = true; // validation part
    const selectedvalue = document.forms[0].cat2;
    this.partnerCategories.splice(0);
    for (let z = 0; z < this.productCategoryArray.length; z++) {
      if (this.productCategoryArray[z].code === tex) {
        const da = this.productCategoryArray[z].name;
        select.innerText = `${da} >`;
        const selectedvalue = document.forms[0].cat2;
        this.partnerCategories.push(tex);
      }
    }
  }

  getSubcategory() {
    const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
    const senDdata = {
      code: tex
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageAllSubCategory(data),
    );
  }

  getAllCategory() {
    const sendData = {
      code: 'c'
    };
    this.categoryService.getAllCategory(sendData).subscribe(
      data => this.setAllCategory(data),
    );
  }

  setAllCategory(data) {
    this.productCategoryArray = [];
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
      this.productCategoryArray.push(cr);
    }
  }

  manageAllSubCategory(data) {
    this.productSubCategoryArray = [];
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
      this.productSubCategoryArray.push(cr);
    }
  }

  managePartnerGroups(data) {
    if (data.message.values != null) {
      for (let i = 0; i < data.message.values.length; i++) {
        const or = {
          groupName: data.message.values[i][0]
        };
        this.partnerGroupArr.push(or);
      }
    }
  }

  toggle() {
    if (this.type == 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  toggle2() {
    if (this.type2 == 'password') {
      this.type2 = 'text';
    } else {
      this.type2 = 'password';
    }
  }

  addCategory() {
    const category_id = (document.getElementById('category_ids') as HTMLInputElement).value;
    // (document.getElementById('addCategoryBtn') as HTMLInputElement).disabled = true;
    // let sub_category_id = (document.getElementById('cat_sub_id') as HTMLInputElement).value;
    // let cat_sub_sub_id = (document.getElementById('cat_sub_sub_id') as HTMLInputElement).value;
    let cat_name = '';
    this.allCategoryBreadcrumbArr = [];

    let cat_name_bool = true;
    this.sendCategory=[];

    this.sendCategory.push(category_id);
    for (let i = 0; i < this.productCategoryArray.length; i++) {
      if (category_id === '') {
        cat_name_bool = false;
      }

      if (this.productCategoryArray[i].code === category_id) {
        cat_name = this.productCategoryArray[i].name;
      }
    }

    const arr = {
      cat_name,
      cat_name_bool
    };

    // validationPart for category
    this.allCategoryBreadcrumbArr.push(arr);

    // -------------------------------validation part for category availability-------------
    if (this.allCategoryBreadcrumbArr.length == 0) {
      this.categoryAvailability = false;
    } else {
      this.categoryAvailability = true;
    }

    document.getElementById('category_ids').style.borderColor = 'gray';
    document.getElementById('CategoryLBL').style.display = 'none';

    this.getAllCategory();
  }

  // addCategory() {
  //   const category_id = (document.getElementById('category_ids') as HTMLInputElement).value;
  //   let cat_name = '';
  //   let sub_cat_name = '';
  //   let cat_sub_sub_name = '';
  //
  //   let cat_name_bool = true;
  //   let sub_cat_name_bool = true;
  //   let cat_sub_sub_name_bool = true;
  //
  //
  //   if (sub_category_id === '' && cat_sub_sub_id === '') {
  //     this.sendCategory.push(category_id);
  //
  //   } else if (cat_sub_sub_id === '') {
  //     this.sendCategory.push(sub_category_id);
  //
  //   } else {
  //     this.sendCategory.push(cat_sub_sub_id);
  //
  //   }
  //   for (let i = 0; i < this.productCategoryArray.length; i++) {
  //     if (category_id === '') {
  //       cat_name_bool = false;
  //     }
  //
  //     if (sub_category_id === '') {
  //       sub_cat_name_bool = false;
  //     }
  //
  //     if (cat_sub_sub_id === '') {
  //       cat_sub_sub_name_bool = false;
  //     }
  //
  //     if (this.productCategoryArray[i].code === category_id) {
  //       cat_name = this.productCategoryArray[i].name;
  //
  //       for (let x = 0; x < this.productSubCategoryArray.length; x++) {
  //         if (this.productSubCategoryArray[x].code === sub_category_id) {
  //           sub_cat_name = this.productSubCategoryArray[x].name;
  //
  //           for (let z = 0; z < this.subsubcategoryArray.length; z++) {
  //             if (this.subsubcategoryArray[z].code === cat_sub_sub_id) {
  //               cat_sub_sub_name = this.subsubcategoryArray[z].name;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //
  //   const arr = {
  //     cat_name,
  //     sub_cat_name,
  //     cat_sub_sub_name,
  //     cat_name_bool,
  //     sub_cat_name_bool,
  //     cat_sub_sub_name_bool
  //   };
  //
  //   this.allCategoryBreadcrumbArr.push(arr);
  //
  //   document.getElementById('subCategory').style.display = 'none';
  //   document.getElementById('subsubCategory').style.display = 'none';
  //   this.getAllCategory();
  // }

  showSubcategory() {
    this.catpathName = [];
    const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
    const select = document.getElementById('breadcrum');
    if (tex === '0') {
      document.getElementById('subCategory').style.display = 'none';
      document.getElementById('subsubCategory').style.display = 'none';
    } else {
      document.getElementById('subCategory').style.display = 'block';
      this.getSubcategory();
      this.catSelect();
    }
  }

  showSubSubCat() {
    const tex = (document.getElementById('subCategory') as HTMLInputElement).value;
    const select = document.getElementById('breadcrum');
    const getVal = (document.getElementById('breadcrum') as HTMLInputElement).value;
    if (tex === '0') {
      document.getElementById('subsubCategory').style.display = 'none';
    } else {
      document.getElementById('subsubCategory').style.display = 'block';
      this.getSubSubCategory();
      this.subcatSelect();
    }
  }

  showSubSubCat2() {
    this.subsubcatSelect();
  }

  getSubSubCategory() {
    const select = document.getElementById('breadcrum');
    const selectedvalue = document.forms[0].cat2;
    this.subsubcategoryArray = [];
    for (let y = 0; y < this.subsubCatAarray.length; y++) {
      if (this.subsubCatAarray[y].subcatCode === selectedvalue.value) {
        const arr = {
          code: this.subsubCatAarray[y].code,
          name: this.subsubCatAarray[y].name
        };
        this.subsubcategoryArray.push(arr);
      }
    }
  }

  manageSubSubCategoryFOrEdit(data) {
    this.subsubCatAarray = [];
    for (let i = 0; i < data.data.length; i++) {
      const or = {
        code: data.data[i].code,
        name: data.data[i].name,
        subCategory: data.data[i].sub_category_name,
        description: data.data[i].description,
        subcatCode: data.data[i].sub_category_code,
        categoryName: data.data[i].category_name,
        categoryCode: data.data[i].category_code,
      };
      this.subsubCatAarray.push(or);
    }
  }

  subcatSelect() {
    const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
    const select = document.getElementById('breadcrum');
    const selectedvalue = document.forms[0].cat2;
    this.partnerCategories.splice(0);
    for (let z = 0; z < this.productCategoryArray.length; z++) {
      if (this.productCategoryArray[z].code === tex) {
        const da = this.productCategoryArray[z].name;
        select.innerText = `${da} >`;
        const selectedvalue = document.forms[0].cat2;
        this.partnerCategories.push(tex);
        for (let x = 0; x < this.productSubCategoryArray.length; x++) {
          if (this.productSubCategoryArray[x].code === selectedvalue.value) {
            let da2 = '';
            da2 = this.productSubCategoryArray[x].name;
            select.innerText = `${da} > ${da2} >`;
            this.partnerCategories.push(selectedvalue.value);
          }
        }
      }
    }
  }

  subsubcatSelect() {
    const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
    const select = document.getElementById('breadcrum');
    const selectedvalue = document.forms[0].cat2;
    const selectedvalue2 = document.forms[0].cat3;
    this.partnerCategories.splice(0);
    for (let z = 0; z < this.productCategoryArray.length; z++) {
      if (this.productCategoryArray[z].code === tex) {
        const catData = this.productCategoryArray[z].name;
        select.innerText = `${catData} >`;
        this.partnerCategories.push(tex);
        for (let x = 0; x < this.productSubCategoryArray.length; x++) {
          if (this.productSubCategoryArray[x].code === selectedvalue.value) {
            const subData = this.productSubCategoryArray[x].name;
            select.innerText = `${catData} > ${subData} >`;
            this.partnerCategories.push(selectedvalue.value);
            for (let y = 0; y < this.subsubCatAarray.length; y++) {
              if (this.subsubCatAarray[y].code === selectedvalue2.value) {
                const subSubData = this.subsubCatAarray[y].name;
                select.innerText = `${catData} > ${subData} > ${subSubData} `;
                this.partnerCategories.push(selectedvalue2.value);
              }
            }
          }
        }
      }
    }
  }

  isAgree() {
    if (this.isAgreed == false) {
      this.isAgreed = true;
    } else {
      this.isAgreed = false;
    }

  }

  // Nimesha -- 29-08-2023 -- Download terms and conditions as PDF
  exportPDF() {
    /*const pdftable = this.pdftable.nativeElement;
    var html = htmlToPdfmake(pdftable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();*/

    const pdftable = this.pdftable.nativeElement;
    var html = htmlToPdfmake(pdftable.innerHTML);
    const documentDefinition = {content: html};

    // Create the PDF
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

    // Generate the Blob containing the PDF data
    pdfDocGenerator.getBlob((blob) => {
      // Create a download link
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);

      // Specify the desired filename
      a.download = 'Terms and Conditions.pdf'; // Replace with your desired filename

      // Append the link to the DOM and trigger the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  validateLBLRemove() {
    document.getElementById('emailPartner').style.borderColor = 'gray';
    document.getElementById('emailPartnerLBL').style.display = 'none';
  }

  validateBuisnessContactNoLBLRemove() {
    document.getElementById('businessContactNo').style.borderColor = 'gray';
    document.getElementById('businessContactNoLBL').style.display = 'none';
  }

  validateownerNameLBLRemove() {
    document.getElementById('ownerName').style.borderColor = 'gray';
    document.getElementById('LBLownerName').style.display = 'none';
  }

  validateBuisnessbusinessNameLBLRemove() {
    document.getElementById('businessName').style.borderColor = 'gray';
    document.getElementById('LBLbusinessName').style.display = 'none';
  }

  validateBankName() {
    document.getElementById('bankName').style.borderColor = 'gray';
    document.getElementById('bankNameLBL').style.display = 'none';
  }

  validateBranchCode() {
    document.getElementById('branchCode').style.borderColor = 'gray';
    document.getElementById('branchCodeLBL').style.display = 'none';
  }

  validateBranchName() {
    document.getElementById('branchName').style.borderColor = 'gray';
    document.getElementById('branchNameLBL').style.display = 'none';
  }

  validateBankAccount() {
    document.getElementById('bankAccount').style.borderColor = 'gray';
    document.getElementById('bankAccountLBL').style.display = 'none';
  }

  validateBRegNo() {
    document.getElementById('businessRegisterNo').style.borderColor = 'gray';
    document.getElementById('businessRegisterNoLBL').style.display = 'none';
  }


}
