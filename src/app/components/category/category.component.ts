import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {CategoryService} from '../../shared/service/category.service';
import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {AuthGuard} from "../../auth.guard";

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

  callingFunction() {
    if (this.btnValue == 0) {
      if (this.accountForm.value.categoryName === '') {
        Swal.fire(
          'Whoops...!',
          'Category name empty...!',
          'error'
        );
      } else {
        const partnerid = sessionStorage.getItem('partnerId');
        const data = {
          code: 'c',
          parentId: partnerid,
          name: this.accountForm.value.categoryName,
          description: this.accountForm.value.description,
          isActive: 1,
          selling_price_margin: this.accountForm.value.price_rate
        };
        this.categoryService.saveCategory(data).subscribe(
          data => this.manageCategoryAdded(data)
        );
      }
      this.btnValue = 0;
    }

    // ===================== Update Category ================ >>>>>>>>>>>>>>>>>>>
    else {
      const payLoard = {
        code: this.accountForm.value.code,
        name: this.accountForm.value.categoryName,
        description: this.accountForm.value.description,
        selling_price_margin: this.accountForm.value.price_rate
      };
      this.categoryService.UpdateCategory(payLoard).subscribe(
        data => this.manageCategoryAdded(data)
      );
      this.btnValue = 0;
    }

    document.getElementById('update').style.display = 'none';
    document.getElementById('save').style.display = 'block';
    this.accountForm = new FormGroup({
      categoryName: new FormControl(''),
      description: new FormControl(''),
    });
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
    if (this.subBtnValue == 0) {
      const sendData = {
        code: 's',
        parentId: this.categoryForm.value.catCode,
        name: this.categoryForm.value.subCategoryName,
        description: this.categoryForm.value.subDescription,
        isActive: 1,
        selling_price_margin: this.categoryForm.value.subPricerate
      };

      this.categoryService.saveSubCategory(sendData).subscribe(
        data => this.manageSubcategory(data),
      );
    }

    // =================== Update Sub Category ============= >>>>>>>>>>>>>>>>>>>
    else {
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
        name: this.categoryForm.value.subCategoryName,
        description: this.categoryForm.value.subDescription,
        selling_price_margin: this.categoryForm.value.subPricerate
      };
      this.categoryService.updateSubCategory(payLoard).subscribe(
        data => this.manageUpdatedSubcategory(data)
      );
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
      this.createAccountForm();
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
  }

// +++++++++++++++++++++ Save And Update Function For SubSub ++++++++++++++
  saveSubSubcategory() {
    if (this.subSubBtnValue == 0) {
      const sendData = {
        code: 'k',
        parentId: this.subSubCategory.value.subCategorynameCt,
        name: this.subSubCategory.value.subSubCategoryName,
        description: this.subSubCategory.value.subSubCategoryDescription,
        isActive: 1,
        selling_price_margin: this.subSubCategory.value.subsubPricerate
      };
      this.categoryService.saveCategory(sendData).subscribe(
        data => this.manageAllSubSubCategory(data)
      );
    }
    // ================================== update part for Sub Sub ======================
    else {
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
        name: this.subSubCategory.value.subSubCategoryName,
        cat_code: this.subSubCategory.value.mainCategoryCode,
        sub_cat_code: this.subSubCategory.value.subCategoryCode,
        description: this.subSubCategory.value.subSubCategoryDescription,
        selling_price_margin: this.subSubCategory.value.subsubPricerate
      };

      this.categoryService.updateSubCategory(payLoard).subscribe(
        data => this.manageEditAllSubSubCategory(data)
      );
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
    document.getElementById('update').style.display = 'block';
    document.getElementById('save').style.display = 'none';
    this.btnValue = 1;
    this.accountForm = new FormGroup({
      code: new FormControl(this.proMainCat[index].code),
      categoryName: new FormControl(this.proMainCat[index].name),
      description: new FormControl(this.proMainCat[index].description),
      price_rate: new FormControl(this.proMainCat[index].priceRate)
    });
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
    this.subBtnValue = 1;
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

  // ============== Edit Sub Category Methode ============= >>>>>>>>>>>
  editSubSubCategory(index) {
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
  }

  // ============== Save & Update Sub Sub Sub Categories ============ >>>>>>>>>>>>
  saveSubSubSubcategory() {
    if (this.subSubSubBtnValue == 0) {
      const sendData = {
        code: 'l',
        name: this.subSubSubCategory.value.subSubSubCategoryName,
        parentId: this.subSubSubCategory.value.subSubCatCode3,
        description: this.subSubSubCategory.value.subSubSubCategoryDescription,
        isActive: 1,
        selling_price_margin: this.subSubSubCategory.value.subsubsubPricerate
      };
      this.categoryService.saveCategory(sendData).subscribe(
        data => this.manageSubSubSubCategory(data)
      );
    }

    // ===============  Update Sub Sub Sub Categories =============== >>>>>>>>>>>>
    else {
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
        name: this.subSubSubCategory.value.subSubSubCategoryName,
        cat_code: this.subSubSubCategory.value.mainCategoryCode,
        sub_cat_code: this.subSubSubCategory.value.subCategoryCode,
        description: this.subSubSubCategory.value.subSubSubCategoryDescription,
        selling_price_margin: this.subSubSubCategory.value.subsubsubPricerate
      };
      this.categoryService.updateSubCategory(payLoard).subscribe(
        data => this.manageEditAllSubSubSubCategory(data),
      );
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
    this.getSubSubSubCategoriesAll();
    this.createAccountForm();
  }
}



