import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../shared/dtos/User';
import {Partner} from '../../../shared/dtos/Partner';
import {Router} from '@angular/router';
import {HttpClientService} from '../../../shared/service/http-client.service';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {CategoryService} from '../../../shared/service/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public contactPersonName = '';
  public companyName = '';
  public userName = '';
  public email = '';
  public contactNo = 0;
  public date = '';
  public password = '';
  public bCryptpassword = '';
  public nic = '';

  public imageCliant: FormGroup;
  public businessName = '';
  public businessRegisterNo = '';
  public ownerName = '';
  public emailbuss = '';
  public mobile = '';
  public businessAddress = '';
  public bankAccount = '';
  public bankName = '';
  public creditCardSave = '';
  public PartnerType = '';
  public productPrefix = '';
  public partner_u_id = '';
  public role = '';
  @Input()
  public alert = false;
  public message = '';
  public errAlert = false;
  public productPrefixArray = [];
  public productCategoryArray = [];
  public proCat2 = [];
  public partnerGroupArr = [];

  //Ashik
  public sendCategory = [];
  public allCategoryBreadcrumbArr = [];
  public subcategoryArray = [];
  public subsubcategoryArray = [];
  public subsubCatAarray = [];
  public proMainCat = [];
  public partnerCategories = [];
  public productSubCategoryArray = [];
  public catpathName = [];
  public eyeIcon = 'fa fa-fw fa-eye-slash field-icon';
  public eyeIcon2 = 'fa fa-fw fa-eye-slash field-icon';
  public type = 'password';
  public type2 = 'password';
  @Input()
  public user: User = new User(this.contactPersonName, this.nic, this.companyName, this.userName, this.email, this.contactNo, this.password, this.role);
  public partner: Partner = new Partner(this.businessName, this.businessRegisterNo, this.ownerName, this.emailbuss, this.mobile, this.businessAddress, this.bankAccount, this.bankName, this.creditCardSave, this.PartnerType, this.productPrefix, this.partner_u_id);
  @Output()
  userAddedEvent = new EventEmitter();

  constructor(private httpClientService: HttpClientService, private router: Router, private categoryService: CategoryService) {
    this.imageControlMethord();
    this.getAllCategory();
    this.getLatestCategory();
    this.getSubCategoryAll();
    this.getSubSubCategoryAll();
  }

  ngOnInit() {

  }

  addUser(useForm: NgForm) {
    let returnArray = {};
    const productPrefix = [];

    const obj = useForm.value.role.role;

    console.log('obj');
    console.log(obj);
    const obj2 = useForm.value;
    const partnerUserObj = obj2.partnerUser;
    const productPrefixObj = partnerUserObj.productPrefix;
    const category = this.productCategoryArray;
    let nicVal = '';
    let supplier_group = (document.getElementById('supplier_group') as HTMLInputElement).value;
    const prFixLength = Object.values(this.productPrefixArray);
    for (let i = 0; i < prFixLength.length; i++) {
      productPrefix[i] = prFixLength[i].productPrefix;
    }

    if (obj2.nic === '') {
      nicVal = 'N/A';
    } else {
      nicVal = obj2.nic;
    }
    if (obj === 'User' || obj === 'Quality Assurance' || obj === 'Admin') {
      returnArray = {
        contactPersonName: obj2.contactPersonName,
        nic: nicVal,
        companyName: obj2.companyName,
        userName: obj2.userName,
        email: obj2.email,
        contactNo: obj2.contactNo,
        password: obj2.password,
        create_by: sessionStorage.getItem('userId'),
        role: [
          obj
        ],
      };
    } else if (obj === 'Partner') {
      returnArray = {
        contactPersonName: obj2.contactPersonName,
        nic: nicVal,
        companyName: obj2.companyName,
        userName: obj2.userName,
        email: obj2.email,
        contactNo: obj2.contactNo,
        password: obj2.password,
        create_by: sessionStorage.getItem('userId'),
        partnerUser: {
          businessName: partnerUserObj.businessName,
          partner_u_id: partnerUserObj.partner_u_id,
          businessRegisterNo: partnerUserObj.businessRegisterNo,
          ownerName: partnerUserObj.ownerName,
          email: partnerUserObj.email,
          mobile: partnerUserObj.mobile,
          businessAddress: partnerUserObj.businessAddress,
          bankAccount: partnerUserObj.bankAccount,
          bankName: partnerUserObj.bankName,
          creditCardSave: partnerUserObj.creditCardSave,
          type: partnerUserObj.PartnerType,
          supplier_group: supplier_group,
          productPrefix,
          partnerCategories: this.sendCategory
        },
        role: [
          obj
        ]
      };
    } else if (obj === 'Category Manager') {
      returnArray = {
        contactPersonName: obj2.contactPersonName,
        nic: nicVal,
        companyName: obj2.companyName,
        userName: obj2.userName,
        email: obj2.email,
        contactNo: obj2.contactNo,
        password: obj2.password,
        create_by: sessionStorage.getItem('userId'),
        role: [
          obj
        ],
        user_categories: this.sendCategory
      };

    } else if (obj === 'Purchasing Manager' || obj === 'Purchasing User' || obj === 'Stores Manager' || obj === 'Finance User') {
      returnArray = {
        contactPersonName: obj2.contactPersonName,
        nic: nicVal,
        companyName: obj2.companyName,
        userName: obj2.userName,
        email: obj2.email,
        contactNo: obj2.contactNo,
        password: obj2.password,
        create_by: sessionStorage.getItem('userId'),
        role: [
          obj
        ]
      };
    }

    let coss = false;
    const userRole = (document.getElementById('validationCustom5') as HTMLInputElement).value;
    if (userRole === 'User' || userRole === 'Admin' || userRole === 'Quality Assurance' || userRole === 'Category Manager' || userRole === 'Stores Manager' || userRole === 'Purchasing Manager' || userRole === 'Purchasing User' || userRole === 'Finance User') {
      coss = this.validateFunctionByUser();
    } else if (userRole === 'Partner') {
      coss = this.validateFunction();
    }
    if (coss) {
      this.httpClientService.addUser(returnArray).subscribe(
        data => this.userAlertFunction(data),
        error => this.alartFunction(error.status)
      );
    }
  }

  imageUploard(data) {
    if (data.data.partner_temp_code == null) {
    } else {
      let images = this.imageCliant.get('fileSource').value;
      let ids = data.data.partner_temp_code;
      this.httpClientService.uploardImage(images, ids).subscribe(
        data => this.manageImageUploardmageUploard(data),
        error => this.alartFunction(error.status)
      );
    }

  }

  manageImageUploardmageUploard(data) {
  }

  change_newe() {
    const tex = (document.getElementById('validationCustom5') as HTMLInputElement).value;
    if (tex === 'Partner') {
      document.getElementById('disss').style.display = 'block';
      document.getElementById('image_display').style.display = 'block';
      document.getElementById('image_display2').style.display = 'block';
      document.getElementById('categoryPane').style.display = 'block';

    } else if (tex === 'Category Manager') {
      document.getElementById('disss').style.display = 'none';
      document.getElementById('image_display').style.display = 'none';
      document.getElementById('image_display2').style.display = 'none';
      document.getElementById('categoryPane').style.display = 'block';
      document.getElementById('subCategory').style.display = 'none';
      document.getElementById('subsubCategory').style.display = 'none';

    } else {
      document.getElementById('disss').style.display = 'none';
      document.getElementById('image_display').style.display = 'none';
      document.getElementById('image_display2').style.display = 'none';
      document.getElementById('categoryPane').style.display = 'none';
    }
  }

//Asik's Code starting..........
  getSubSubCategory() {
    const select = document.getElementById('breadcrum');
    const selectedvalue = document.forms[0].cat2;
    this.subsubcategoryArray = [];
    for (let y = 0; y < this.subsubCatAarray.length; y++) {
      if (this.subsubCatAarray[y]['subcatCode'] === selectedvalue.value) {
        let arr = {
          code: this.subsubCatAarray[y].code,
          name: this.subsubCatAarray[y].name
        };
        this.subsubcategoryArray.push(arr);
      }
    }
  }

  getLatestCategory() {
    this.categoryService.LatestCategoryGet().subscribe(
      data => this.manageLatestCategory(data),
    );
  }

  manageLatestCategory(data) {
    this.proMainCat = [];
    for (let i = 0; i < data.data.length; i++) {
      const or = {
        code: data.data[i].code,
        name: data.data[i].name,
        description: data.data[i].description
      };
      this.proMainCat.push(or);
    }
  }

  getSubSubCategoryAll() {
    this.categoryService.getSubSubCategoryFOrEdit().subscribe(
      data => this.manageSubSubCategoryFOrEdit(data),
    );
  }

  manageSubSubCategoryFOrEdit(data) {
    this.subsubCatAarray = [];
    for (let i = 0; i < data.data.length; i++) {
      let or = {
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

  getSubCategoryAll() {
    this.categoryService.getCategoryForEdit().subscribe(
      data => this.manageSubCategoryForEdit(data),
    );
  }

  manageSubCategoryForEdit(data) {
    this.subcategoryArray = [];
    for (let i = 0; i < data.data.length; i++) {
      let or = {
        code: data.data[i].code,
        name: data.data[i].name,
        description: data.data[i].description,
        category: data.data[i].category_name,
        catCode: data.data[i].category_code
      };
      this.subcategoryArray.push(or);
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

  getSubSubcategory() {
    const tex = (document.getElementById('subCategory') as HTMLInputElement).value;
    const senDdata = {
      code: tex
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageSubSubCategoryFOrEdit(data),
    );
  }

  changeEvent(data, code) {
    (document.getElementById('breadcrum') as HTMLInputElement).innerHTML = data;
    (document.getElementById('category_code') as HTMLInputElement).value = code;
  }

  catSelect() {
    const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
    const select = document.getElementById('breadcrum');
    const selectedvalue = document.forms[0].cat2;
    this.partnerCategories.splice(0);
    for (let z = 0; z < this.productCategoryArray.length; z++) {
      if (this.productCategoryArray[z]['code'] === tex) {
        var da = this.productCategoryArray[z]['name'];
        select.innerText = `${da} >`;
        const selectedvalue = document.forms[0].cat2;
        this.partnerCategories.push(tex);
      }
    }
  }

  subcatSelect() {
    const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
    const select = document.getElementById('breadcrum');
    const selectedvalue = document.forms[0].cat2;
    this.partnerCategories.splice(0);
    for (let z = 0; z < this.productCategoryArray.length; z++) {
      if (this.productCategoryArray[z]['code'] === tex) {
        var da = this.productCategoryArray[z]['name'];
        select.innerText = `${da} >`;
        const selectedvalue = document.forms[0].cat2;
        this.partnerCategories.push(tex);
        for (let x = 0; x < this.productSubCategoryArray.length; x++) {
          if (this.productSubCategoryArray[x]['code'] === selectedvalue.value) {
            var da2 = '';
            da2 = this.productSubCategoryArray[x]['name'];
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
      if (this.productCategoryArray[z]['code'] === tex) {
        var catData = this.productCategoryArray[z]['name'];
        select.innerText = `${catData} >`;
        this.partnerCategories.push(tex);
        for (let x = 0; x < this.productSubCategoryArray.length; x++) {
          if (this.productSubCategoryArray[x]['code'] === selectedvalue.value) {
            var subData = this.productSubCategoryArray[x]['name'];
            select.innerText = `${catData} > ${subData} >`;
            this.partnerCategories.push(selectedvalue.value);
            for (let y = 0; y < this.subsubCatAarray.length; y++) {
              if (this.subsubCatAarray[y]['code'] === selectedvalue2.value) {
                var subSubData = this.subsubCatAarray[y]['name'];
                select.innerText = `${catData} > ${subData} > ${subSubData} `;
                this.partnerCategories.push(selectedvalue2.value);
              }
            }
          }
        }
      }
    }
  }

  showSubcategory() {
    this.catpathName = [];
    const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
    const tex2 = (document.getElementById('validationCustom5') as HTMLInputElement).value;
    const select = document.getElementById('breadcrum');
    if (tex === '0' || tex2 === 'Category Manager') {
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

  alartFunction(err): void {
    Swal.fire(
      'Whoops...!',
      err.message,
      'error'
    );
    if (err === 200) {
      this.alert = true;
    } else {
      this.alert = false;
      this.errAlert = true;
    }
  }

  addPrefixs(useForm: NgForm) {
    (document.getElementById('productPrefix') as HTMLInputElement).value = '';
    const productPrefix = useForm.value.partnerUser.productPrefix;
    this.productPrefixArray.push(productPrefix);
  }

  removePrefix(prefix) {
    const prefArrLength = this.productPrefixArray.length;
    for (let i = 0; i < prefArrLength; i++) {
      if (this.productPrefixArray[i].productPrefix === prefix) {
        this.productPrefixArray.splice(i, 1);
      }
    }
  }

  userAlertFunction(data) {
    this.sendCategory = [];
    this.allCategoryBreadcrumbArr = [];

    if (data.status_code === 200) {

      this.alert = true;

      this.message = data.message;
      if (data.message === 'Error : Username and E-mail are already taken!') {
        document.getElementById('validationCustom2').style.borderColor = 'red';
        document.getElementById('validationCustom3').style.borderColor = 'red';
        Swal.fire(
          'Whoops...!',
          data.message,
          'error'
        );
      } else if (data.message === 'Error : Username is already taken!') {
        document.getElementById('validationCustom2').style.borderColor = 'red';
        document.getElementById('validationCustom3').style.borderColor = 'green';
        Swal.fire(
          'Whoops...!',
          data.message,
          'error'
        );
      } else if (data.message === 'Error : E-mail is already taken!') {
        document.getElementById('validationCustom3').style.borderColor = 'red';

        document.getElementById('validationCustom2').style.borderColor = 'green';

        Swal.fire(
          'Whoops...!',
          data.message,
          'error'
        );
      } else {
        this.productPrefixArray = [];
        this.imageUploard(data);
        let role = (document.getElementById('validationCustom5') as HTMLInputElement).value;
        if (role === 'User') {
          (document.getElementById('validationCustom0') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom1') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom9') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom6') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom2') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom3') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom4') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom146') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom5') as HTMLInputElement).innerHTML = '<option selected value=""> -- Select --</option><option value="User">User</option><option value="Partner">Partner</option>';
        } else {
          (document.getElementById('validationCustom0') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom1') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom9') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom6') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom2') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom3') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom4') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom146') as HTMLInputElement).value = '';
          (document.getElementById('validationCustom5') as HTMLInputElement).innerHTML = '<option selected value=""> -- Select --</option><option value="User">User</option><option value="Partner">Partner</option>';
          (document.getElementById('partner_u_id') as HTMLInputElement).value = '';
          (document.getElementById('businessName') as HTMLInputElement).value = '';
          (document.getElementById('businessRegisterNo') as HTMLInputElement).value = '';
          (document.getElementById('ownerName') as HTMLInputElement).value = '';
          (document.getElementById('email') as HTMLInputElement).value = '';
          (document.getElementById('mobile') as HTMLInputElement).value = '';
          (document.getElementById('businessAddress') as HTMLInputElement).value = '';
          (document.getElementById('bankAccount') as HTMLInputElement).value = '';
          (document.getElementById('bankName') as HTMLInputElement).value = '';
          (document.getElementById('PartnerType') as HTMLInputElement).innerHTML = '<option selected value=""> -- Select --</option><option value="company">Company</option><option value="individual">Individual</option>';

        }
        document.getElementById('validationCustom2').style.borderColor = 'green';
        document.getElementById('validationCustom3').style.borderColor = 'green';
        document.getElementById('validationCustom3').style.borderColor = 'green';
        Swal.fire(
          'Good job',
          data.message,
          'success'
        );
      }

    } else {
      this.alert = false;
      this.errAlert = true;
      Swal.fire(
        'Whoops ...',
        data.message,
        'error'
      );
    }
    this.imageControlMethord();
  }

  validateFunctionByUser() {
    let ret01 = true;
    let ret02 = true;
    let ret03 = true;
    let ret04 = true;
    let ret07 = true;
    let ret08 = true;
    let ret09 = true;
    let ret10 = true;
    let ret11 = true;
    // const tex = (document.getElementById('validationCustom0') as HTMLInputElement).value;
    // const regex = /^[a-zA-Z ]{2,30}$/;
    // const xx = regex.test(tex);
    // // if (xx) {
    // //   document.getElementById('validationCustom0').style.borderColor = 'green';
    // //   ret01 = true;
    // // } else {
    // //   document.getElementById('validationCustom0').style.borderColor = 'red';
    // //   ret01 = false;
    // // }
    //
    const contactNumber = (document.getElementById('validationCustom1') as HTMLInputElement).value;
    const contactNumberRegex = /^[0-9]+$/;
    const contactNumberResult = contactNumberRegex.test(contactNumber);

    if (contactNumberResult) {
      document.getElementById('validationCustom1').style.borderColor = 'green';
      ret01 = true;
    } else {
      document.getElementById('validationCustom1').style.borderColor = 'red';
      ret01 = false;
      Swal.fire(
        'Whoops...!',
        'Allow only numeric input for the contact number',
        'error'
      );
    }

    const nic = (document.getElementById('validationCustom9') as HTMLInputElement).value;
    if (nic != '') {
      const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
      const nicResult = nicRegex.test(nic);

      if (nicResult) {
        document.getElementById('validationCustom9').style.borderColor = 'green';
        ret02 = true;
      } else {
        document.getElementById('validationCustom9').style.borderColor = 'red';
        ret02 = false;
      }
    } else {
      ret02 = true;
    }


    const email = (document.getElementById('validationCustom3') as HTMLInputElement).value;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const emailResult = emailRegex.test(email);
    if (emailResult) {
      document.getElementById('validationCustom3').style.borderColor = 'green';
      ret03 = true;
    } else {
      document.getElementById('validationCustom3').style.borderColor = 'red';
      ret03 = false;
    }
    //
    const role = (document.getElementById('validationCustom5') as HTMLInputElement).value;
    if (role === 'Partner') {
      const emailPartner = (document.getElementById('email') as HTMLInputElement).value;
      const partnerRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const partnerResult = partnerRegex.test(emailPartner);
      if (partnerResult) {
        document.getElementById('email').style.borderColor = 'green';
        ret04 = true;
      } else {
        document.getElementById('email').style.borderColor = 'red';
        ret04 = false;
      }
    }
    let ret05 = false;
    const passwordConform = (document.getElementById('validationCustom146') as HTMLInputElement).value;
    const password = (document.getElementById('validationCustom4') as HTMLInputElement).value;

    if (password === passwordConform) {
      document.getElementById('validationCustom146').style.borderColor = 'green';
      ret05 = true;
    } else {
      document.getElementById('validationCustom146').style.borderColor = 'red';
      ret05 = false;
      Swal.fire(
        'Whoops...!',
        'Password not match',
        'error'
      );
    }
    //
    const userRole = (document.getElementById('validationCustom5') as HTMLInputElement).value;
    if (userRole == '') {
      ret07 = false;
      document.getElementById('validationCustom5').style.borderColor = 'red';
      Swal.fire(
        'Whoops...!',
        'You should select user role...!',
        'error'
      );
    } else {
      ret07 = true;
      document.getElementById('validationCustom5').style.borderColor = 'green';
    }

    if (ret02 == false) {
      Swal.fire(
        'Whoops...!',
        'Entered NIC wrong',
        'error'
      );
    } else {
      document.getElementById('validationCustom9').style.borderColor = 'green';
    }

    if (ret03 === false) {
      Swal.fire(
        'Whoops...!',
        'Entered email wrong',
        'error'
      );
    } else {
      document.getElementById('validationCustom3').style.borderColor = 'green';
    }

    if (ret01 && ret02 && ret03 && ret04 && ret05 && ret07 && ret09) {
      return true;
    } else {
      return false;
    }
  }


  validateFunction() {
    let ret01 = true;
    let ret02 = true;
    let ret03 = true;
    let ret04 = true;
    let ret07 = true;
    let ret08 = true;
    let ret09 = true;
    let ret10 = true;
    let ret11 = true;
    // const tex = (document.getElementById('validationCustom0') as HTMLInputElement).value;
    // const regex = /^[a-zA-Z ]{2,30}$/;
    // const xx = regex.test(tex);
    // // if (xx) {
    // //   document.getElementById('validationCustom0').style.borderColor = 'green';
    // //   ret01 = true;
    // // } else {
    // //   document.getElementById('validationCustom0').style.borderColor = 'red';
    // //   ret01 = false;
    // // }
    //
    const nic = (document.getElementById('validationCustom9') as HTMLInputElement).value;
    if (nic != '') {
      const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
      const nicResult = nicRegex.test(nic);

      if (nicResult) {
        document.getElementById('validationCustom9').style.borderColor = 'green';
        ret02 = true;
      } else {
        document.getElementById('validationCustom9').style.borderColor = 'red';
        ret02 = false;
      }
    } else {
      ret02 = true;
    }


    const partner_u_id = (document.getElementById('partner_u_id') as HTMLInputElement).value;
    if (partner_u_id != '') {
      document.getElementById('partner_u_id').style.borderColor = 'green';
      ret08 = true;


    } else {
      document.getElementById('partner_u_id').style.borderColor = 'red';
      Swal.fire(
        'Whoops...!',
        'You cant empty partner code...',
        'error'
      );
      ret08 = false;
    }

    const email = (document.getElementById('validationCustom3') as HTMLInputElement).value;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const emailResult = emailRegex.test(email);
    if (emailResult) {
      document.getElementById('validationCustom3').style.borderColor = 'green';
      ret03 = true;
    } else {
      document.getElementById('validationCustom3').style.borderColor = 'red';
      ret03 = false;
    }
    //
    const role = (document.getElementById('validationCustom5') as HTMLInputElement).value;
    if (role === 'Partner') {
      const emailPartner = (document.getElementById('email') as HTMLInputElement).value;
      const partnerRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const partnerResult = partnerRegex.test(emailPartner);
      if (partnerResult) {
        document.getElementById('email').style.borderColor = 'green';
        ret04 = true;
      } else {
        document.getElementById('email').style.borderColor = 'red';
        ret04 = false;
      }
    }
    let ret05 = false;
    const passwordConform = (document.getElementById('validationCustom146') as HTMLInputElement).value;
    const password = (document.getElementById('validationCustom4') as HTMLInputElement).value;

    if (password === passwordConform) {
      document.getElementById('validationCustom146').style.borderColor = 'green';
      ret05 = true;
    } else {
      document.getElementById('validationCustom146').style.borderColor = 'red';
      ret05 = false;
      Swal.fire(
        'Whoops...!',
        'Password not match',
        'error'
      );
    }
    //
    const userRole = (document.getElementById('validationCustom5') as HTMLInputElement).value;
    if (userRole == '') {
      ret07 = false;
      document.getElementById('validationCustom5').style.borderColor = 'red';
      Swal.fire(
        'Whoops...!',
        'You should select user role...!',
        'error'
      );
    } else {
      ret07 = true;
      document.getElementById('validationCustom5').style.borderColor = 'green';
    }

    if (ret02 == false) {
      Swal.fire(
        'Whoops...!',
        'Entered NIC wrong',
        'error'
      );
    } else {
      document.getElementById('validationCustom9').style.borderColor = 'green';
    }

    if (ret03 === false) {
      Swal.fire(
        'Whoops...!',
        'Entered email wrong',
        'error'
      );
    } else {
      document.getElementById('validationCustom3').style.borderColor = 'green';
    }

    const businessName = (document.getElementById('businessName') as HTMLInputElement).value;
    if (businessName != '') {
      document.getElementById('businessName').style.borderColor = 'green';
      ret09 = true;


    } else {
      document.getElementById('businessName').style.borderColor = 'red';
      Swal.fire(
        'Whoops...!',
        'You cant empty business Name...',
        'error'
      );
      ret09 = false;
    }


    const supplier_group = (document.getElementById('supplier_group') as HTMLInputElement).value;
    if (supplier_group != '') {
      document.getElementById('supplier_group').style.borderColor = 'green';
      ret10 = true;


    } else {
      document.getElementById('supplier_group').style.borderColor = 'red';
      Swal.fire(
        'Whoops...!',
        'You cant empty supplier group...',
        'error'
      );
      ret10 = false;
    }


    const PartnerType = (document.getElementById('PartnerType') as HTMLInputElement).value;
    if (PartnerType != '') {
      document.getElementById('PartnerType').style.borderColor = 'green';
      ret11 = true;


    } else {
      document.getElementById('PartnerType').style.borderColor = 'red';
      Swal.fire(
        'Whoops...!',
        'You cant empty Partner Type...',
        'error'
      );
      ret11 = false;
    }


    if (ret01 && ret02 && ret03 && ret04 && ret05 && ret07 && ret08 && ret09 && ret10 && ret11) {
      return true;
    } else {
      return false;
    }
  }


  removeCategory(category: any) {
    const prefArrLength = this.proCat2.length;

    for (let i = 0; i < prefArrLength; i++) {
      if (this.proCat2[i].category === category) {
        this.proCat2.splice(i, 1);
      }
    }
    const proCatArrLength = this.productCategoryArray.length;

    for (let z = 0; z < proCatArrLength; z++) {
      if (this.productCategoryArray[z] === category) {
        this.productCategoryArray.splice(z, 1);
      }
    }
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
  }

  imageControlMethord() {
    this.imageCliant = new FormGroup({
      imageOne: new FormControl(''),
      fileSource: new FormControl('')
    });
  }

  managePartnerGroups(data) {
    this.partnerGroupArr = [];
    for (let i = 0; i < data.message.values.length; i++) {
      let or = {
        groupName: data.message.values[i][0]
      };
      this.partnerGroupArr.push(or);
    }
  }

  addCategory() {
    let category_id = (document.getElementById('category_ids') as HTMLInputElement).value;
    let cat_name = '';
    let cat_name_bool = true;

    // Check if the category_id is not empty and not already in sendCategory array
    if (category_id !== '' && !this.sendCategory.includes(category_id) && category_id !== '0') {
      this.sendCategory.push(category_id);

      for (let i = 0; i < this.productCategoryArray.length; i++) {
        if (this.productCategoryArray[i].code === category_id) {
          cat_name = this.productCategoryArray[i].name;
        }
      }

      let arr = {
        cat_name: cat_name,
        cat_name_bool: cat_name_bool,
      };

      this.allCategoryBreadcrumbArr.push(arr);
      this.getAllCategory();
    }
  }

  removeCategoryBreadcrum(index) {
    for (let i = 0; i < this.allCategoryBreadcrumbArr.length; i++) {
      if (this.allCategoryBreadcrumbArr[index] == this.allCategoryBreadcrumbArr[i]) {
        this.allCategoryBreadcrumbArr.splice(i, 1);
      }
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

  updateUserNameFromEmail() {
    this.user.userName = this.user.email;
  }

}
