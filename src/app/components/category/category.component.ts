import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {CategoryService} from '../../shared/service/category.service';
import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {AuthGuard} from "../../auth.guard";
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  public accountForm: FormGroup;
  public categoryForm: FormGroup;
  public subSubCategory: FormGroup;
  public subSubSubCategory: FormGroup;

  @Input()
  // ============================ Arrays For Select Options =========================
  public productCategoryArray = [];
  public productSubCategoryArray = [];
  public productSubSubCategoryArray = [];
  public nonApproveUsersArr = [];
  public list_pages2 = 5;
  public selected = [];
  public btnValue = 0;
  public subBtnValue = 0;
  public subSubBtnValue = 0;
  public subSubSubBtnValue = 0;

  // =========================== Arrays for DataTable Template =================
  public proMainCat = [];
  public subsubCatAarray = [];
  public subSubSubCatAarray = [];
  public subcategoryArray = [];
  public subSubSubCategoryArray = [];
  marginRate = 0;

  public tempCategoryObj;


  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService, private router: Router, private authGuard: AuthGuard) {
    // this.authGuard.canActivate();
    // create all forms
    this.createAccountForm();
    // Get All values in database
    this.getAllCategory();
    this.getLatestCategory();
    this.getSubCategoryAll();
    this.getSubSubCategoryAll();
    this.getSubSubSubCategoriesAll();
  }

  getLatestCategory() {
    this.categoryService.LatestCategoryGet().subscribe(
      data => this.manageLatestCategory(data)
    );
  }

  manageLatestCategory(data) {
    this.proMainCat = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const or = {
          code: data.data[i].code,
          name: data.data[i].name,
          description: data.data[i].description,
          priceRate: data.data[i].price_rate
        };
        this.proMainCat.push(or);
      }
    }
  }

  // ==================== Form Create methode ============================ >>>>>>>>>>>>
  createAccountForm() {
    this.accountForm = new FormGroup({
      code: new FormControl(''),
      categoryName: new FormControl(''),
      description: new FormControl(''),
      price_rate: new FormControl('')
    });

    this.categoryForm = new FormGroup({
      catCode: new FormControl(''),
      subCatCode: new FormControl(''),
      subCategoryName: new FormControl(''),
      subDescription: new FormControl(''),
      mainCatName: new FormControl(''),
      mainCatCode: new FormControl(''),
      subPricerate: new FormControl('')
    });

    this.subSubCategory = new FormGroup({
      subCategoryCode: new FormControl(''),
      subCategoryName: new FormControl(''),
      mainCategoryCode: new FormControl(''),
      mainCategoryMain: new FormControl(''),
      mainCategorytxt: new FormControl(''),
      subCategorynameCt: new FormControl(''),
      subSubCategoryCode: new FormControl(''),
      subSubCategoryName: new FormControl(''),
      subSubCategoryDescription: new FormControl(''),
      subsubPricerate: new FormControl('')
    });

    this.subSubSubCategory = new FormGroup({
      catCode3: new FormControl(''),
      mainCategoryCodeForSubSubSub: new FormControl(''),
      mainCategoryForSubSubSub: new FormControl(''),
      SubCatCode3: new FormControl(''),
      oldSubCategoryNameForSubSubSub: new FormControl(''),
      oldSubCategorycodeForSubSubSub: new FormControl(''),
      subSubCatCode3: new FormControl(''),
      oldSubSubCategoryNameForSubSubSub: new FormControl(''),
      oldSubSubCategorycodeForSubSubSub: new FormControl(''),
      subSubSubCategoryName: new FormControl(''),
      subSubSubCategoryDescription: new FormControl(''),
      subsubsubPricerate: new FormControl('')
    });
  }

  ngOnInit() {
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  categoryValidation() {
    this.clearForm();

    var nameError = document.getElementById('nameError');
    var priceError = document.getElementById('priceError');
    var descError = document.getElementById('descError');
    var nameInput = document.getElementById('txt_cat_name');
    var priceInput = document.getElementById('txt_price_rate');
    var descInput = document.getElementById('txt_cat_description');
    var errorCount = 0;

    if (this.accountForm.value.categoryName === '' && this.accountForm.value.description === '' && this.accountForm.value.price_rate === '') {
      nameInput.style.border = "1px solid red";
      priceInput.style.border = "1px solid red";
      descInput.style.border = "1px solid red";
      Swal.fire(
        'Whoops...!',
        'Please fill the required fields!',
        'error'
      );
      return false;
    } else {
      if (this.accountForm.value.categoryName === '') {
        nameError.innerHTML = "Please enter a category name";
        nameInput.style.border = "1px solid red";
        nameError.style.display = "inline";
        errorCount++;
      } else {
        var catName = this.accountForm.value.categoryName.trim();
        const regex = /^[a-zA-Z\s]+$/;

        if (!(catName.length <= 100 && regex.test(catName))) {
          nameError.innerHTML = "The Category Name must consist of fewer than 100 letters";
          nameInput.style.border = "1px solid red";
          nameError.style.display = "inline";
          errorCount++;
        }
      }
      if (this.accountForm.value.price_rate === '') {
        priceError.innerHTML = "Please enter a Price Rate";
        priceInput.style.border = "1px solid red";
        priceError.style.display = "inline";
        errorCount++;
      } else {
        if (/^\d+(\.\d+)?$/.test(this.accountForm.value.price_rate)) {
          var priceDigit = parseFloat(this.accountForm.value.price_rate);
          if (!(!isNaN(priceDigit) && priceDigit >= 0 && priceDigit <= 100)) {
            priceError.innerHTML = "Price must be a number between 0 to 100";
            priceError.style.display = "inline";
            priceInput.style.border = "1px solid red";
            errorCount++;
          }
        } else {
          priceError.innerHTML = "Price must be a number between 0 to 100";
          priceError.style.display = "inline";
          priceInput.style.border = "1px solid red";
          errorCount++;
        }
      }
      var desc = this.accountForm.value.description.trim();
      if (desc.length > 200) {
        descError.style.display = "inline";
        descInput.style.border = "1px solid red";
        errorCount++;
      }
    }
    return errorCount <= 0;
  }

  async onCategoryChange($event, changingCat: string) {
    let catCode = $event.target.value;
    if ($event.target.value.includes(":")) {
      catCode = $event.target.value.split(':')[1].trim();
    }
    const response = await this.categoryService.getCategoryByCode({code: catCode}).toPromise();
    if (response.data !== null) {
      if (response.data.selling_price_margin > 0) {
        switch (changingCat) {
          case 'sub': {
            (document.getElementById('txt_sub_price_rate') as HTMLInputElement).value = response.data.selling_price_margin;
            break;
          }
          case 'sub-sub': {
            (document.getElementById('txt_subs_price_rate') as HTMLInputElement).value = response.data.selling_price_margin;
            break;
          }
          case 'sub-sub-sub': {
            (document.getElementById('txt_subsub_price_rate') as HTMLInputElement).value = response.data.selling_price_margin;
            break;
          }
        }

      }
    }
  }

  subCategoryValidation(buttonvalue) {
    this.clearForm();
    this.categoryForm.value.subPricerate = (document.getElementById('txt_sub_price_rate') as HTMLInputElement).value

    var nameError = document.getElementById('subNameError');
    var priceError = document.getElementById('subPriceError');
    var descError = document.getElementById('subDescError');
    var categoryError = document.getElementById('categoryError1');

    var categoryInput = document.getElementById('select01');
    var nameInput = document.getElementById('validationCustom123');
    var priceInput = document.getElementById('txt_sub_price_rate');
    var descInput = document.getElementById('validationCustom2443');
    var errorCount = 0;
    if (this.categoryForm.value.catCode === '' && this.categoryForm.value.subCategoryName === ''
      && this.categoryForm.value.subDescription === '' && this.categoryForm.value.subPricerate === '') {
      categoryInput.style.border = "1px solid red";
      nameInput.style.border = "1px solid red";
      priceInput.style.border = "1px solid red";
      descInput.style.border = "1px solid red";
      Swal.fire(
        'Whoops...!',
        'Please fill the required fields!',
        'error'
      );
      return false;
    } else {
      if (this.categoryForm.value.catCode === '' && buttonvalue == 0) {
        categoryInput.style.border = "1px solid red";
        categoryError.style.display = "inline";
        errorCount++;
      }
      if (this.categoryForm.value.subCategoryName === '') {
        nameError.style.display = "inline";
        nameInput.style.border = "1px solid red";
        errorCount++;
      } else {
        var subCatName = this.categoryForm.value.subCategoryName.trim();
        const regex = /^[a-zA-Z\s]+$/;

        if (!(subCatName.length <= 100 && regex.test(subCatName))) {
          nameError.innerHTML = "Sub Category name must consist of fewer than 100 letters";
          nameInput.style.border = "1px solid red";
          nameError.style.display = "inline";
          errorCount++;
        }
      }
      if (this.categoryForm.value.subPricerate === '') {
        priceError.innerHTML = "Please enter a Price Rate";
        priceInput.style.border = "1px solid red";
        priceError.style.display = "inline";
        errorCount++;
      } else {
        if (/^\d+(\.\d+)?$/.test(this.categoryForm.value.subPricerate)) {
          var priceDigit = parseFloat(this.categoryForm.value.subPricerate);
          if (!(!isNaN(priceDigit) && priceDigit >= 0 && priceDigit <= 100)) {
            priceError.innerHTML = "Price must be a number between 0 to 100";
            priceError.style.display = "inline";
            priceInput.style.border = "1px solid red";
            errorCount++;
          }
        } else {
          priceError.innerHTML = "Price must be a number between 0 to 100";
          priceError.style.display = "inline";
          priceInput.style.border = "1px solid red";
          errorCount++;
        }
      }
      var desc = this.categoryForm.value.subDescription.trim();
      if (desc.length > 200) {
        descError.style.display = "inline";
        descInput.style.border = "1px solid red";
        errorCount++;
      }
    }
    return errorCount <= 0;
  }

  subSubCategoryValidation(buttonvalue) {
    this.clearForm();
    this.subSubCategory.value.subsubPricerate = (document.getElementById('txt_subs_price_rate') as HTMLInputElement).value
    var nameError = document.getElementById('subSubNameError');
    var priceError = document.getElementById('subSubPriceError');
    var descError = document.getElementById('subSubDescError');
    var categoryError = document.getElementById('categoryError2');
    var subCategoryError = document.getElementById('subCategoryError2');

    var categoryInput = document.getElementById('category_ids');
    var subCategoryInput = document.getElementById('subCategorySelect');
    var nameInput = document.getElementById('validationCustom1');
    var priceInput = document.getElementById('txt_subs_price_rate');
    var descInput = document.getElementById('validationCustom2');

    var errorCount = 0;

    if (this.subSubCategory.value.mainCategoryMain === '' && this.subSubCategory.value.subCategorynameCt === ''
      && this.subSubCategory.value.subSubCategoryDescription === '' && this.subSubCategory.value.subSubCategoryName === ''
      && this.subSubCategory.value.subsubPricerate === '') {
      categoryInput.style.border = "1px solid red";
      nameInput.style.border = "1px solid red";
      priceInput.style.border = "1px solid red";
      descInput.style.border = "1px solid red";
      subCategoryInput.style.border = "1px solid red";

      Swal.fire(
        'Whoops...!',
        'Please fill the required fields!',
        'error'
      );
      return false;
    } else {
      if (this.subSubCategory.value.mainCategoryMain === '' && buttonvalue == 0) {
        categoryError.innerHTML = "Please select a Category";
        categoryInput.style.border = "1px solid red";
        categoryError.style.display = "inline";
        errorCount++;
      }
      if (buttonvalue == 0) {
        if (this.subSubCategory.value.subCategorynameCt === '') {
          subCategoryError.innerHTML = "Please select a Sub Category";
          subCategoryError.style.display = "inline";
          subCategoryInput.style.border = "1px solid red";
          errorCount++;
        }
      }
      if (this.subSubCategory.value.subSubCategoryName === '') {
        nameError.innerHTML = "Please provide a Sub-Sub Category Name";
        nameError.style.display = "inline";
        nameInput.style.border = "1px solid red";
        errorCount++;
      } else {
        var subCatName = this.subSubCategory.value.subSubCategoryName.trim();
        const regex = /^[a-zA-Z\s]+$/;

        if (!(subCatName.length <= 100 && regex.test(subCatName))) {
          nameError.innerHTML = "Sub-Sub Category Name must consist of fewer than 100 letters";
          nameInput.style.border = "1px solid red";
          nameError.style.display = "inline";
          errorCount++;
        }
      }
      if (this.subSubCategory.value.subsubPricerate === '') {
        priceError.innerHTML = "Please enter a Price Rate";
        priceInput.style.border = "1px solid red";
        priceError.style.display = "inline";
        errorCount++;
      } else {
        if (/^\d+(\.\d+)?$/.test(this.subSubCategory.value.subsubPricerate)) {
          var priceDigit = parseFloat(this.subSubCategory.value.subsubPricerate);
          if (!(!isNaN(priceDigit) && priceDigit >= 0 && priceDigit <= 100)) {
            priceError.innerHTML = "Price Rate must be a number between 0 to 100";
            priceError.style.display = "inline";
            priceInput.style.border = "1px solid red";
            errorCount++;
          }
        } else {
          priceError.innerHTML = "Price Rate must be a number between 0 to 100";
          priceError.style.display = "inline";
          priceInput.style.border = "1px solid red";
          errorCount++;
        }
      }
      var desc = this.subSubCategory.value.subSubCategoryDescription.trim();
      if (desc.length > 200) {
        descError.style.display = "inline";
        descInput.style.border = "1px solid red";
        errorCount++;
      }
    }
    return errorCount <= 0;
  }

  subSubSubCategoryValidation(buttonValue) {
    this.clearForm();
    this.subSubSubCategory.value.subsubsubPricerate = (document.getElementById('txt_subsub_price_rate') as HTMLInputElement).value;
    var nameError = document.getElementById('subSubSubNameError');
    var priceError = document.getElementById('subSubSubPriceError');
    var descError = document.getElementById('subSubSubDescError');
    var categoryError = document.getElementById('categoryError3');
    var subCategoryError = document.getElementById('subCategoryError3');
    var subSubCategoryError = document.getElementById('subSubCategoryError2');

    var categoryInput = document.getElementById('category_id_sub_sub');
    var subCategoryInput = document.getElementById('subCategoryIdInSubSubSub');
    var subSubCategoryInput = document.getElementById('subSubCatSelect');
    var nameInput = document.getElementById('validationCustom3');
    var priceInput = document.getElementById('txt_subsub_price_rate');
    var descInput = document.getElementById('descValidationCustom3');

    var errorCount = 0;

    if (this.subSubSubCategory.value.catCode3 === '' && this.subSubSubCategory.value.SubCatCode3 === ''
      && this.subSubSubCategory.value.subSubCatCode3 === '' && this.subSubSubCategory.value.subSubSubCategoryName === ''
      && this.subSubSubCategory.value.subSubSubCategoryDescription === '' && this.subSubSubCategory.value.subsubsubPricerate === '') {
      categoryInput.style.border = "1px solid red";
      nameInput.style.border = "1px solid red";
      priceInput.style.border = "1px solid red";
      descInput.style.border = "1px solid red";
      subCategoryInput.style.border = "1px solid red";
      subSubCategoryInput.style.border = "1px solid red";

      Swal.fire(
        'Whoops...!',
        'Please fill the required fields!',
        'error'
      );
      return false;
    } else {
      if (this.subSubSubCategory.value.catCode3 === '' && buttonValue == 0) {
        categoryError.innerHTML = "Please select a Category";
        categoryInput.style.border = "1px solid red";
        categoryError.style.display = "inline";
        errorCount++;
      }
      if (buttonValue == 0) {
        if (this.subSubSubCategory.value.SubCatCode3 === '') {
          subCategoryError.innerHTML = "Please select a Sub Category";
          subCategoryError.style.display = "inline";
          subCategoryInput.style.border = "1px solid red";
          errorCount++;
        }
      }
      if (this.subSubSubCategory.value.subSubCatCode3 === '' && buttonValue == 0) {
        subSubCategoryError.innerHTML = "Please select a Sub-Sub Category";
        subSubCategoryError.style.display = "inline";
        subSubCategoryInput.style.border = "1px solid red";
        errorCount++;
      }

      if (this.subSubSubCategory.value.subSubSubCategoryName === '') {
        nameError.style.display = "Please provide a Sub-Sub-Sub Category Name";
        nameError.style.display = "inline";
        nameInput.style.border = "1px solid red";
        errorCount++;
      } else {
        var subCatName = this.subSubSubCategory.value.subSubSubCategoryName.trim();
        const regex = /^[a-zA-Z\s]+$/;

        if (!(subCatName.length <= 100 && regex.test(subCatName))) {
          nameError.innerHTML = "Sub-Sub-Sub Category name must consist of fewer than 100 letters";
          nameInput.style.border = "1px solid red";
          nameError.style.display = "inline";
          errorCount++;
        }
      }
      if (this.subSubSubCategory.value.subsubsubPricerate === '') {
        priceError.innerHTML = "Please enter a Price";
        priceInput.style.border = "1px solid red";
        priceError.style.display = "inline";
        errorCount++;
      } else {
        if (/^\d+(\.\d+)?$/.test(this.subSubSubCategory.value.subsubsubPricerate)) {
          var priceDigit = parseFloat(this.subSubSubCategory.value.subsubsubPricerate);
          if (!(!isNaN(priceDigit) && priceDigit >= 0 && priceDigit <= 100)) {
            priceError.innerHTML = "Price Rate must be a number between 0 to 100";
            priceError.style.display = "inline";
            priceInput.style.border = "1px solid red";
            errorCount++;
          }
        } else {
          priceError.innerHTML = "Price Rate must be a number between 0 to 100";
          priceError.style.display = "inline";
          priceInput.style.border = "1px solid red";
          errorCount++;
        }
      }
      var desc = this.subSubSubCategory.value.subSubSubCategoryDescription.trim();
      if (desc.length > 200) {
        descError.style.display = "inline";
        descInput.style.border = "1px solid red";
        errorCount++;
      }
    }
    return errorCount <= 0;
  }

  clearForm() {
    var inputfields = document.getElementsByClassName('catInput');
    var errorMsgs = document.getElementsByClassName('errorMsg');

    for (var i = 0; i < inputfields.length; i++) {
      var inputfield = inputfields[i] as HTMLInputElement;
      inputfield.style.border = "";
    }
    for (var i = 0; i < errorMsgs.length; i++) {
      var errorMsg = errorMsgs[i] as HTMLInputElement;
      errorMsg.style.display = "none";
    }
  }

  callingFunction() {
    var isValidated = this.categoryValidation();
    if (isValidated) {
      var categoryName = this.accountForm.value.categoryName;
      if (categoryName.length > 0 && categoryName[0] === categoryName[0].toLowerCase()) {
        categoryName = categoryName[0].toUpperCase() + categoryName.slice(1);
      }
      if (this.btnValue == 0) {
        const partnerid = sessionStorage.getItem('partnerId');

        const data = {
          code: 'c',
          parentId: partnerid,
          name: categoryName,
          description: this.accountForm.value.description,
          isActive: 1,
          selling_price_margin: this.accountForm.value.price_rate
        };
        this.categoryService.saveCategory(data).subscribe(
          data => this.manageCategoryAdded(data)
        );
        this.btnValue = 0;
      }
      // ===================== Update Category ================ >>>>>>>>>>>>>>>>>>>
      else {
        const payLoard = {
          code: this.accountForm.value.code,
          name: categoryName,
          description: this.accountForm.value.description,
          selling_price_margin: this.accountForm.value.price_rate
        };
        if (this.tempCategoryObj.categoryName == payLoard.name
          && this.tempCategoryObj.description == payLoard.description
          && this.tempCategoryObj.price_rate == payLoard.selling_price_margin) {
          Swal.fire({
            title: "You haven't made any changes",
            icon: "question"
          });
        } else {
          this.categoryService.UpdateCategory(payLoard).subscribe(
            data => this.manageCategoryAdded(data)
          );
          this.btnValue = 0;
        }
      }
    }
  }

  manageCategoryAdded(data) {
    if (data.message_status === 'Failed') {
      Swal.fire(
        'Whoops...!',
        data.message,
        'error'
      );
    } else {
      this.createAccountForm();
      Swal.fire(
        'Good Job...!',
        data.message,
        'success'
      );
    }
    this.getAllCategory();
    this.getLatestCategory();
  }

  getAllCategory() {
    const sendData = {
      code: 'c'
    };

    this.categoryService.getAllCategory(sendData).subscribe(
      data => this.setAllCategory(data),
      // error => this.manageAuthorizeError(error)
    );
  }

  // ++++++++++++++++++++ Categories loading Array set-up for Editable Table ++++++++++++++++
  setAllCategory(data) {
    let cr = {};
    cr = {
      name: '',
      code: ''
    };

    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        cr = {
          name: data.data[i].name,
          code: data.data[i].code
        };
        this.productCategoryArray.push(cr);
      }
    }
  }

  // ============= Save & Update Sub Category ============== >>>>>>>>>>>>>>>
  saveSubcategory() {
    console.log('fffffffyyyyyyyyyyykkkkkkkkkkkkk');
    console.log(this.categoryForm.value.subPricerate);
    var subCategoryName = this.categoryForm.value.subCategoryName;
    if (subCategoryName.length > 0 && subCategoryName[0] === subCategoryName[0].toLowerCase()) {
      subCategoryName = subCategoryName[0].toUpperCase() + subCategoryName.slice(1);
    }

    if (this.subBtnValue == 0) {
      const isValidated = this.subCategoryValidation(this.subBtnValue);
      if (isValidated) {
        const sendData = {
          code: 's',
          parentId: this.categoryForm.value.catCode,
          name: subCategoryName,
          description: this.categoryForm.value.subDescription,
          isActive: 1,
          selling_price_margin: this.categoryForm.value.subPricerate
        };
        this.categoryService.saveSubCategory(sendData).subscribe(
          data => this.manageSubcategory(data),
        );
      }
    }

    // =================== Update Sub Category ============= >>>>>>>>>>>>>>>>>>>
    else if (this.tempCategoryObj.subCategoryName == subCategoryName
      && this.tempCategoryObj.subDescription == this.categoryForm.value.subDescription
      && this.tempCategoryObj.subPricerate == this.categoryForm.value.subPricerate) {
      Swal.fire({
        title: "You haven't made any changes",
        icon: "question"
      });
    } else {
      const isValidated = this.subCategoryValidation(this.subBtnValue);
      if (isValidated) {
        let catCodeVal = '';
        let catName = '';
        if (this.categoryForm.value.catCode == '') {
          catCodeVal = this.categoryForm.value.mainCatCode;
          catName = this.categoryForm.value.mainCatName;

        } else {
          catCodeVal = this.categoryForm.value.catCode;
          catName = '';
        }

        const payLoard = {
          code: this.categoryForm.value.subCatCode,
          parentId: catCodeVal,
          name: subCategoryName,
          description: this.categoryForm.value.subDescription,
          selling_price_margin: this.categoryForm.value.subPricerate
        };
        this.categoryService.updateSubCategory(payLoard).subscribe(
          data => this.manageUpdatedSubcategory(data)
        );
      }
      this.displayHiddenFields();
    }
  }

  manageUpdatedSubcategory(data) {
    this.createAccountForm();
    this.getSubCategoryAll();
    Swal.fire(
      'Good job...!',
      data.message,
      'success'
    );
    document.getElementById('oldCatDev').style.display = 'none';
    document.getElementById('oldCatName').style.display = 'none';
    document.getElementById('subEdit').style.display = 'none';
    document.getElementById('subSave').style.display = 'block';
    this.subBtnValue = 0;
  }

  manageSubcategory(data) {
    if (data.message_status === 'Failed') {
      Swal.fire(
        'warning',
        data.message,
        'warning'
      );
    } else {
      console.log("b4");
      console.log(this.categoryForm.value.subPricerate);
      this.createAccountForm();
      console.log("After");
      console.log(this.categoryForm.value.subPricerate);
      Swal.fire(
        data.data.name,
        data.message,
        'success'
      );
      this.getSubCategoryAll();
    }

  }

  getSubcategory() {
    const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
    const senDdata = {
      code: tex
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageAllSubCategory(data)
    );
  }

  manageAllSubCategory(data) {
    this.productSubCategoryArray = [];
    let cr = {};
    cr = {
      name: '',
      code: ''
    };
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        cr = {
          name: data.data[i].name,
          code: data.data[i].code
        };
        this.productSubCategoryArray.push(cr);
      }
    }
    this.subSubCategory.value.subCategorynameCt = "";
  }

// +++++++++++++++++++++ Save And Update Function For SubSub ++++++++++++++
  saveSubSubcategory() {
    var subSubCategoryName = this.subSubCategory.value.subSubCategoryName;
    if (subSubCategoryName.length > 0 && subSubCategoryName[0] === subSubCategoryName[0].toLowerCase()) {
      subSubCategoryName = subSubCategoryName[0].toUpperCase() + subSubCategoryName.slice(1);
    }
    if (this.subSubBtnValue == 0) {
      var isValidated = this.subSubCategoryValidation(this.subSubBtnValue);
      if (isValidated) {
        const sendData = {
          code: 'k',
          parentId: this.subSubCategory.value.subCategorynameCt,
          name: subSubCategoryName,
          description: this.subSubCategory.value.subSubCategoryDescription,
          isActive: 1,
          selling_price_margin: this.subSubCategory.value.subsubPricerate
        };
        this.categoryService.saveCategory(sendData).subscribe(
          data => this.manageAllSubSubCategory(data),
        );
      }
    }
    // ================================== update part for Sub Sub ======================
    else if (this.tempCategoryObj.subSubCategoryName == subSubCategoryName
      && this.tempCategoryObj.subSubCategoryDescription == this.subSubCategory.value.subSubCategoryDescription
      && this.tempCategoryObj.subsubPricerate == this.subSubCategory.value.subsubPricerate) {
      Swal.fire({
        title: "You haven't made any changes",
        icon: "question"
      });
    } else {
      var isValidated = this.subSubCategoryValidation(this.subSubBtnValue);
      if (isValidated) {
        let payLoard = {};
        let parentId = '';
        if (this.subSubCategory.value.subCategorynameCt == '') {
          parentId = this.subSubCategory.value.subCategoryCode;
        } else {
          parentId = this.subSubCategory.value.subCategorynameCt;
        }

        payLoard = {
          code: this.subSubCategory.value.subSubCategoryCode,
          parentId,
          name: subSubCategoryName,
          cat_code: this.subSubCategory.value.mainCategoryCode,
          sub_cat_code: this.subSubCategory.value.subCategoryCode,
          description: this.subSubCategory.value.subSubCategoryDescription,
          selling_price_margin: this.subSubCategory.value.subsubPricerate
        };
        this.categoryService.updateSubCategory(payLoard).subscribe(
          data => this.manageEditAllSubSubCategory(data)
        );
      }
      this.displayHiddenFields();
    }
  }

  manageEditAllSubSubCategory(data) {
    Swal.fire(
      'Good Job..!',
      data.message,
      'success'
    );
    document.getElementById('lblOldSubCat').style.display = 'none';
    document.getElementById('subCategoryName').style.display = 'none';
    document.getElementById('txt_mainCat').style.display = 'none';
    document.getElementById('lblMainCat').style.display = 'none';
    document.getElementById('subSubSave').style.display = 'block';
    document.getElementById('subSubEdit').style.display = 'none';
    this.subSubBtnValue = 0;
    this.getSubSubCategoryAll();
    this.createAccountForm();
  }

  manageAllSubSubCategory(data) {
    if (data.message_status === 'Failed') {
      Swal.fire(
        'warning',
        data.message,
        'warning'
      );
      this.createAccountForm();
    } else {
      Swal.fire(
        data.data.name,
        data.message,
        'success'
      );
      this.createAccountForm();
    }
  }

  // ========== Edit Category ============ >>>>>>>>>>>>>>>>
  EditCategory(index) {
    this.clearForm();
    document.getElementById('update').style.display = 'block';
    document.getElementById('save').style.display = 'none';
    this.btnValue = 1;

    this.accountForm = new FormGroup({
      code: new FormControl(this.proMainCat[index].code),
      categoryName: new FormControl(this.proMainCat[index].name),
      description: new FormControl(this.proMainCat[index].description),
      price_rate: new FormControl(this.proMainCat[index].priceRate)
    });
    this.tempCategoryObj = this.accountForm.value;
  }

  // =============== Get All Sub Category For Editable table ================ >>>>>>>>>>
  getSubCategoryAll() {
    this.categoryService.getCategoryForEdit().subscribe(
      data => this.manageSubCategoryForEdit(data),
      error => console.log('error')
    );
  }

  manageSubCategoryForEdit(data) {
    this.subcategoryArray = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const or = {
          code: data.data[i].code,
          name: data.data[i].name,
          description: data.data[i].description,
          category: data.data[i].category_name,
          catCode: data.data[i].category_code,
          priceRate: data.data[i].price_rate

        };
        this.subcategoryArray.push(or);
      }
    }
  }

  // ============ Edit Sub Categories ====================== >>>>>>>>>>>>>>
  editSubCategory(index) {
    this.clearForm();
    this.hideningfields();
    this.subBtnValue = 1;
    document.getElementById("select01").style.display = "none";
    document.getElementById('oldCatDev').style.display = 'block';
    document.getElementById('oldCatName').style.display = 'block';
    document.getElementById('subEdit').style.display = 'block';
    document.getElementById('subSave').style.display = 'none';

    this.categoryForm = new FormGroup({
      catCode: new FormControl('', [Validators.required, Validators.minLength(3)]),
      subCatCode: new FormControl(this.subcategoryArray[index].code),
      subCategoryName: new FormControl(this.subcategoryArray[index].name),
      subDescription: new FormControl(this.subcategoryArray[index].description),
      mainCatName: new FormControl(this.subcategoryArray[index].category),
      mainCatCode: new FormControl(this.subcategoryArray[index].catCode),
      subPricerate: new FormControl(this.subcategoryArray[index].priceRate),
    });
    this.tempCategoryObj = this.categoryForm.value;
  }

  // Get Sub Sub Categories For Editable Table ========= >>>>>>>>>>>
  getSubSubCategoryAll() {
    this.categoryService.getSubSubCategoryFOrEdit().subscribe(
      data => this.manageSubSubCategoryFOrEdit(data)
    );
  }

  manageSubSubCategoryFOrEdit(data) {
    this.subsubCatAarray = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const or = {
          code: data.data[i].code,
          name: data.data[i].name,
          subCategory: data.data[i].sub_category_name,
          description: data.data[i].description,
          subcatCode: data.data[i].sub_category_code,
          categoryName: data.data[i].category_name,
          categoryCode: data.data[i].category_code,
          priceRate: data.data[i].price_rate
        };
        this.subsubCatAarray.push(or);
      }
    }
  }

  hideningfields() {
    var content = document.getElementsByClassName('hiddenFields');

    for (var i = 0; i < content.length; i++) {
      var visibleContent = content[i] as HTMLInputElement;
      visibleContent.style.display = "none";
    }
  }

  displayHiddenFields() {
    var hiddenContent = document.getElementsByClassName('hiddenFields');
    for (var i = 0; i < hiddenContent.length; i++) {
      var hidden = hiddenContent[i] as HTMLInputElement;
      hidden.style.display = "block";
    }
    var inputfields = document.getElementsByClassName('catInput');
    for (var i = 0; i < inputfields.length; i++) {
      var inputfield = inputfields[i] as HTMLInputElement;
      inputfield.style.display = "block";
    }
  }

  // ============== Edit Sub Category Methode ============= >>>>>>>>>>>
  editSubSubCategory(index) {
    this.clearForm();
    this.hideningfields();
    this.subSubBtnValue = 1;
    document.getElementById('subSubEdit').style.display = 'block';
    document.getElementById('subSubSave').style.display = 'none';
    document.getElementById('txt_mainCat').style.display = 'block';
    document.getElementById('lblMainCat').style.display = 'block';
    document.getElementById('lblOldSubCat').style.display = 'block';
    document.getElementById('subCategoryName').style.display = 'block';

    this.subSubCategory = new FormGroup({
      subCategoryCode: new FormControl(this.subsubCatAarray[index].subcatCode),
      subCategoryName: new FormControl(this.subsubCatAarray[index].subCategory),
      mainCategoryCode: new FormControl(this.subsubCatAarray[index].categoryCode),
      mainCategoryMain: new FormControl(''),
      mainCategorytxt: new FormControl(this.subsubCatAarray[index].categoryName),
      subCategorynameCt: new FormControl(''),
      subSubCategoryCode: new FormControl(this.subsubCatAarray[index].code),
      subSubCategoryName: new FormControl(this.subsubCatAarray[index].name),
      subSubCategoryDescription: new FormControl(this.subsubCatAarray[index].description),
      subsubPricerate: new FormControl(this.subsubCatAarray[index].priceRate),
    });
    this.tempCategoryObj = this.subSubCategory.value;
    const senDdata = {
      code: this.subsubCatAarray[index].categoryCode
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageAllSubCategory(data)
    );
  }

  // ===================== Get Selected Sub Sub Categories For relevant sub Category =========== >>>>>>>>
  getSubSubcategory() {
    const tex = (document.getElementById('subCategoryIdInSubSubSub') as HTMLInputElement).value;
    const senDdata = {
      code: tex
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageSubSubCategory(data)
    );
  }

  manageSubSubCategory(data) {
    this.productSubSubCategoryArray = [];
    let cr = {};
    cr = {
      name: '',
      code: ''
    };
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        cr = {
          name: data.data[i].name,
          code: data.data[i].code
        };
        this.productSubSubCategoryArray.push(cr);
      }
    }
    this.subSubSubCategory.value.subSubCatCode3 = "";
  }

  // ============= Get Sub Categories For Sub Sub Sub tab =============== >>>>>>>>>>>>>>>>
  getSubcategoryForSubSubSub() {
    const tex = (document.getElementById('category_id_sub_sub') as HTMLInputElement).value;
    const senDdata = {
      code: tex
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageGetSubcategoryForSubSubSub(data)
    );
  }

  manageGetSubcategoryForSubSubSub(data) {
    this.productSubCategoryArray = [];
    let cr = {};
    cr = {
      name: '',
      code: ''
    };
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        cr = {
          name: data.data[i].name,
          code: data.data[i].code
        };
        this.productSubCategoryArray.push(cr);
      }
    }
    this.subSubSubCategory.value.SubCatCode3 = "";
    this.subSubSubCategory.value.subSubCatCode3 = "";
  }

  // ============== Save & Update Sub Sub Sub Categories ============ >>>>>>>>>>>>
  saveSubSubSubcategory() {
    var subSubSubCategoryName = this.subSubSubCategory.value.subSubSubCategoryName;
    if (subSubSubCategoryName.length > 0 && subSubSubCategoryName[0] === subSubSubCategoryName[0].toLowerCase()) {
      subSubSubCategoryName = subSubSubCategoryName[0].toUpperCase() + subSubSubCategoryName.slice(1);
    }
    if (this.subSubSubBtnValue == 0) {
      var isValidate = this.subSubSubCategoryValidation(this.subSubSubBtnValue);
      if (isValidate) {
        const sendData = {
          code: 'l',
          name: subSubSubCategoryName,
          parentId: this.subSubSubCategory.value.subSubCatCode3,
          description: this.subSubSubCategory.value.subSubSubCategoryDescription,
          isActive: 1,
          selling_price_margin: this.subSubSubCategory.value.subsubsubPricerate
        };
        this.categoryService.saveCategory(sendData).subscribe(
          data => this.manageSubSubSubCategory(data)
        );
      }
    }

    // ===============  Update Sub Sub Sub Categories =============== >>>>>>>>>>>>
    else if (this.tempCategoryObj.subSubSubCategoryName == subSubSubCategoryName
      && this.tempCategoryObj.subSubSubCategoryDescription == this.subSubSubCategory.value.subSubSubCategoryDescription
      && this.tempCategoryObj.subsubsubPricerate == this.subSubSubCategory.value.subsubsubPricerate) {
      Swal.fire({
        title: "You haven't made any changes",
        icon: "question"
      });
    } else {
      var isValidate = this.subSubSubCategoryValidation(this.subSubSubBtnValue);
      if (isValidate) {
        let payLoard = {};
        let parentId = '';
        if (this.subSubSubCategory.value.subSubCatCode3 == '') {
          parentId = this.subSubCategory.value.oldSubSubCategorycodeForSubSubSub;
        } else {
          parentId = this.subSubSubCategory.value.subSubCatCode3;
        }

        payLoard = {
          code: this.subSubSubCategory.value.oldSubCategorycodeForSubSubSub,
          parentId,
          name: subSubSubCategoryName,
          cat_code: this.subSubSubCategory.value.mainCategoryCode,
          sub_cat_code: this.subSubSubCategory.value.subCategoryCode,
          description: this.subSubSubCategory.value.subSubSubCategoryDescription,
          selling_price_margin: this.subSubSubCategory.value.subsubsubPricerate
        };
        this.categoryService.updateSubCategory(payLoard).subscribe(
          data => this.manageEditAllSubSubSubCategory(data),
        );
      }
      this.displayHiddenFields();
    }
  }

  manageSubSubSubCategory(data) {

    if (data.message_status === 'Failed') {
      Swal.fire(
        'warning',
        data.message,
        'warning'
      );
      this.createAccountForm();
      this.getSubSubSubCategoriesAll();
    } else {
      Swal.fire(
        data.data.name,
        data.message,
        'success'
      );
      this.createAccountForm();
      this.getSubSubSubCategoriesAll();
    }
  }

  // ==================== Edit Sub Sub Sub category ============= >>>>>>>>>>>>>>>>>
  editSubSubSubCategory(index) {
    this.clearForm();
    this.hideningfields();
    this.subSubSubBtnValue = 1;
    document.getElementById('subSubSubEdit').style.display = 'block';
    document.getElementById('subSubSubSave').style.display = 'none';
    document.getElementById('txt_mainCatInSub3').style.display = 'block';
    document.getElementById('lblMainCatInSub3').style.display = 'block';
    document.getElementById('lblOldSubCatInSub3').style.display = 'block';
    document.getElementById('oldSubCategoryNameInSub3').style.display = 'block';
    document.getElementById('lblSubCatForSubSubSub').style.display = 'block';
    document.getElementById('oldSubSubCategoryNameForSubSubSub').style.display = 'block';

    // this.subSubCategory = new FormGroup({
    //   subCategoryCode: new FormControl(this.subsubCatAarray[index].subcatCode),
    //   subCategoryName: new FormControl(this.subsubCatAarray[index].subCategory),
    //   mainCategoryCode: new FormControl(this.subsubCatAarray[index].categoryCode),
    //   mainCategoryMain: new FormControl(''),
    //   mainCategorytxt: new FormControl(this.subsubCatAarray[index].categoryName),
    //   subCategorynameCt: new FormControl(''),
    //   subSubCategoryCode: new FormControl(this.subsubCatAarray[index].code),
    //   subSubCategoryName: new FormControl(this.subsubCatAarray[index].name),
    //   subSubCategoryDescription: new FormControl(this.subsubCatAarray[index].description),
    // });
    this.subSubSubCategory = new FormGroup({
      catCode3: new FormControl(''),
      mainCategoryCodeForSubSubSub: new FormControl(this.subSubSubCategoryArray[index].category_code),
      mainCategoryForSubSubSub: new FormControl(this.subSubSubCategoryArray[index].category_name),
      SubCatCode3: new FormControl(''),
      oldSubCategoryNameForSubSubSub: new FormControl(this.subSubSubCategoryArray[index].sub_category_name),
      oldSubCategorycodeForSubSubSub: new FormControl(this.subSubSubCategoryArray[index].code),
      subSubCatCode3: new FormControl(''),
      oldSubSubCategoryNameForSubSubSub: new FormControl(this.subSubSubCategoryArray[index].sub_sub_category_name),
      oldSubSubCategorycodeForSubSubSub: new FormControl(this.subSubSubCategoryArray[index].sub_sub_category_code),
      subSubSubCategoryName: new FormControl(this.subSubSubCategoryArray[index].name),
      subSubSubCategoryDescription: new FormControl(this.subSubSubCategoryArray[index].description),
      subsubsubPricerate: new FormControl(this.subSubSubCategoryArray[index].priceRate),
    });
    this.tempCategoryObj = this.subSubSubCategory.value;
    const senDdata = {
      code: this.subsubCatAarray[index].categoryCode
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageAllSubCategory(data)
    );
  }

  // ============= Get All Sub Sub Sub Category For Editable table ========== >>>>>>>>>>>>
  getSubSubSubCategoriesAll() {
    this.categoryService.getSubSubSubCategoryForEdit().subscribe(
      data => this.manageSubSubSubCategoryAll(data)
    );
  }

  private manageSubSubSubCategoryAll(data) {
    this.subSubSubCategoryArray = [];
    for (let i = 0; i < data.data.length; i++) {
      const sr = {
        code: data.data[i].code,
        name: data.data[i].name,
        description: data.data[i].description,
        category: data.data[i].sub_sub_category_name,
        catCode: data.data[i].sub_sub_category_code,
        sub_category_name: data.data[i].sub_category_name,
        category_name: data.data[i].category_name,
        category_code: data.data[i].category_code,
        sub_sub_category_code: data.data[i].sub_sub_category_code,
        sub_sub_category_name: data.data[i].sub_sub_category_name,
        sub_category_code: data.data[i].sub_category_code,
        priceRate: data.data[i].price_rate
        //   "sub_sub_category_name": "test1",
        //             "code": "l2",
        //             "category_name": "Grocery",
        //             "category_code": "c6",
        //             "name": "Shirt",
        //             "sub_category_name": "Sub food",
        //             "description": "Shirt",
        //             "sub_sub_category_code": "k6",
        //             "sub_category_code": "s6"
      };
      this.subSubSubCategoryArray.push(sr);
    }
  }

  private manageEditAllSubSubSubCategory(data: any) {
    Swal.fire(
      'Good Job..!',
      data.message,
      'success'
    );
    this.subSubSubBtnValue = 0;
    document.getElementById('subSubSubEdit').style.display = 'none';
    document.getElementById('subSubSubSave').style.display = 'block';
    document.getElementById('txt_mainCatInSub3').style.display = 'none';
    document.getElementById('lblMainCatInSub3').style.display = 'none';
    document.getElementById('lblOldSubCatInSub3').style.display = 'none';
    document.getElementById('oldSubCategoryNameInSub3').style.display = 'none';
    document.getElementById('lblSubCatForSubSubSub').style.display = 'none';
    document.getElementById('oldSubSubCategoryNameForSubSubSub').style.display = 'none';

    this.getSubSubSubCategoriesAll();
    this.createAccountForm();
  }

  changeTab(event) {
    this.btnValue = 0;
    this.subBtnValue = 0;
    this.subSubBtnValue = 0;
    this.subSubSubBtnValue = 0;
    this.createAccountForm();

    var inputfields = document.getElementsByClassName('inputTxt');
    for (var i = 0; i < inputfields.length; i++) {
      var inputfield = inputfields[i] as HTMLInputElement;
      inputfield.value = "";
    }
  }
}



