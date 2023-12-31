import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import {ModalDismissReasons, NgbModal, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from '../../../shared/service/product.service';
import Swal from 'sweetalert2';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../../environments/environment.prod';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {CategoryService} from "../../../shared/service/category.service";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {ImageService} from "../../../shared/service/image.service";
import {__values} from "tslib";


@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.scss']
})
export class EditProductsComponent implements OnInit {
  public imageCliant: FormGroup;
  public checkBoxCon: FormGroup;
  public productGroupCon: FormGroup;
  public maintainStock: FormGroup;
  public baseInfo: FormGroup;
  public description: FormGroup;
  public offer: FormGroup;
  public category: FormGroup;
  @Input()
  public catParth = [];
  public isColor = false;
  public isSize = false;
  public colorsAndSize = false;
  public showSizeAdd = false;
  public viewVariationAdd = false;
  public closeResult: string;
  modalRef: any;
  public colorArray = [];
  public sizeArray = [];
  public productGroupTabel = [];
  public keyWordArray = [];
  public keyWordArray2 = [];
  public isDisplay = 'block';
  public sizeAndColorArray = [];
  public colorNameArray = [];
  public colorCodeArray = [];
  public sizeNameArray = [];
  public colorAndSizeArray = [];
  public imageArr = [];
  public variationValue = '';
  public weightValue = '';
  public weightBool = false;
  public isAdmin = false;
  public storageValue = '';
  public capacityValue = '';
  public nonGroupArray = [];
  public productCategoryArray = [];
  public productSubCategoryArray = [];
  public productSubSubCategoryArray = [];
  public parts = [];
  public imageOne = '';
  public imageOne2 = '';
  public imageOne3 = '';
  public imageOne4 = '';
  public imageOne5 = '';
  public ids = '';
  public imageData = [];
  public imagePathURI = environment.imageURIENV;
  public title_name = 'Edit Product';
  public amountBefor = '';
  showmsg = false;
  showmsg1 = false;
  inputValue: any;
  variationColors = [];
  variationOptions = [];
  public colorArrayForClothes = [];
  public colorArrayForClothesJob = [];
  sizeCategory: string = '';

  hideRemove2 = false;
  hideRemove3 = false;
  hideRemove4 = false;
  hideRemove5 = false;

  public activeUpdate = false;
  public showUpdateButton = false;
  imageUrl: any;
  filteredSubCategory = [];
  filteredSubSubCategory = [];
  newAddedVariations = [];

  productAttributeList: any = [];

  public oldTitle = '';
  public oldBrand = '';
  public oldManufacture = '';
  public old_Txt_description = '';
  public old_special_notes = '';
  public old_txt_amount = '';
  public old_condition = '';
  public old_txt_quantity = '';
  public old_txt_price = '';
  public old_txt_seller_sku = '';
  public old_availability = '';
  public old_txt_listning_price = '';
  public old_txt_price_rate = '';
  public productCode = '';
  public imagedefaultPathURI = '';

  public editPrice = false;
  public btnUpdatePrice = false;

  public vendorCode = '';
  public oldCostPrice = '';
  public oldChangingRate = '';
  public oldSellingPrice = '';
  tableSize: number;
  public type = '';

  descriptionContent;
  titleValue;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter Description',
    translate: 'no',
    defaultParagraphSeparator: 'br',
    defaultFontName: 'Arial',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    rawPaste: true,
    toolbarHiddenButtons: [
      ['strikeThrough', 'subscript'],
      ['backgroundColor', 'color'],
      ['align'],
      ['blockquote', 'code-block'],
      ['link', 'unlink'],
      ['insertImage', 'insertVideo'],
      ['fontSize', 'fontFamily', 'font', 'toggleEditorMode', 'fontName'],
      ['textColor', 'backgroundColor'],
      ['indent', 'outdent'],
      ['undo', 'redo'],
      ['html'],
    ],
  };
  @ViewChild('imagePopup') imagePopup: ElementRef;

  constructor(private categoryService: CategoryService, private router: Router, private _Activatedroute: ActivatedRoute, private modalService: NgbModal, private productService: ProductService, private imageService: ImageService) {
    this.ids = '';
    this.getAllCategory();
    this.getVariationColors();
    this._Activatedroute.paramMap.subscribe(params => {
      this.getProductByEdit(params.get('id'));
      this.ids = params.get('id');

      const sessionUserRole = sessionStorage.getItem('userRole');
      const pattern = /0V\d+POD/;
      const isMatch = pattern.test(this.ids); // check ondemand id
      if (isMatch && sessionUserRole === 'ROLE_PARTNER') {
        this.editPrice = true;
      } else {
        this.editPrice = false;
      }

    });

    this.imageControlMethord();
    this.editFormControlMethode();
    this.getImages();
    this.hideElement();

  }

  hideElement(): void {
    const role = sessionStorage.getItem('userRole');

    if (role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_CATEGORY_MANAGER' || role === 'ROLE_STORES_MANAGER') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  getImages() {

    let payloard = {
      product_code: this.ids
    };
    this.productService.getImageForEdit(payloard).subscribe(
      data => this.manageImageForEdit(data),
    );
  }

  onKeyPress(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z0-9\s."'/\\,-]*$/; // Regular expression to allow alphanumeric characters

    const inputChar = event.key;
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Prevents the character from being entered
      Swal.fire(
        'Please don\'t add special Characters.',
        'Warning',
        'warning'
      );
    }
  }

  checkChars() {

    const textarea = document.getElementById('product_description') as HTMLTextAreaElement;
    const textLength = textarea.value.length;

    if (textLength > 200 && textLength <= 6000) {
      this.showmsg = false;
      this.showmsg1 = false;
    } else if (textLength <= 200) {
      this.showmsg = true;
      this.showmsg1 = false;
    } else {
      this.showmsg = false;
      this.showmsg1 = true;
    }

  }

  public url = [{
    img: 'assets/images/user.png',
  },
    {
      img: 'assets/images/user.png',
    },
    {
      img: 'assets/images/user.png',
    },
    {
      img: 'assets/images/user.png',
    },
    {
      img: 'assets/images/user.png',
    }
  ];


  ngOnInit(): void {
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


  changeEvent(data, code, priceMargin) {
    (document.getElementById('breadcrum') as HTMLInputElement).innerHTML = data;
    (document.getElementById('category_code') as HTMLInputElement).value = code;
    this.isDisplay = 'block';

    if (priceMargin != null) {
      (document.getElementById('txt_price_rate') as HTMLInputElement).value = priceMargin;
      (document.getElementById('txt_price_rate_hidden') as HTMLInputElement).value = priceMargin;
      (document.getElementById('txt_amount') as HTMLInputElement).disabled = true;
    }

  }


  /*
  calculte price using Amount
   */


  /*
  calculte price using rate
   */


  imageControlMethord() {
    this.imageCliant = new FormGroup({
      imageOne: new FormControl(''),
      imageOne2: new FormControl(''),
      imageOne3: new FormControl(''),
      imageOne4: new FormControl(''),
      imageOne5: new FormControl(''),
      type2: new FormControl(''),
      type3: new FormControl(''),
      type4: new FormControl(''),
      type5: new FormControl(''),
      fileSource: new FormControl(''),
      fileSource2: new FormControl(''),
      fileSource3: new FormControl(''),
      fileSource4: new FormControl(''),
      fileSource5: new FormControl(''),
    });
    this.checkBoxCon = new FormGroup({
      productGroup: new FormControl(''),
    });

    this.maintainStock = new FormGroup({
      maintainStockController: new FormControl(true),
    });

    this.productGroupCon = new FormGroup({
      proGAmount: new FormControl(''),
      proGRate: new FormControl(''),
      proGCostPrice: new FormControl(''),
      qty: new FormControl(''),
      proGSellingPrice: new FormControl(''),
    });
  }

  popImageView(newImgSrc) {
    this.imageUrl = newImgSrc;
    this.modalRef = this.modalService.open(this.imagePopup, {centered: true});
  }

  closePopup() {
    this.modalRef.close();
    this.imageUrl = undefined;
  }

  removeimg(x: number) {
    this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
    switch (x) {
      case 2:
        this.imageCliant.patchValue({
          fileSource2: '',
          imageOne2: '',
          type2: 'remove'
        });
        this.imageOne2 = this.imagedefaultPathURI + '/1.jpg';
        break;
      case 3:
        this.imageCliant.patchValue({
          fileSource3: '',
          imageOne3: '',
          type3: 'remove'
        });
        this.imageOne3 = this.imagedefaultPathURI + '/1.jpg';
        break;
      case 4:
        this.imageCliant.patchValue({
          fileSource4: '',
          imageOne4: '',
          type4: 'remove'
        });
        this.imageOne4 = this.imagedefaultPathURI + '/1.jpg';
        break;
      case 5:
        this.imageCliant.patchValue({
          fileSource5: '',
          imageOne5: '',
          type5: 'remove'
        });
        this.imageOne5 = this.imagedefaultPathURI + '/1.jpg';
        break;
    }
  }

  loadimg(x: number) {
    switch (x) {
      case 1:
        var newImgSrc = document.getElementById("imageOneO").getAttribute('src');
        this.popImageView(newImgSrc);
        break;

      case 2:
        var newImgSrc = document.getElementById("imageTwoO").getAttribute('src');
        this.popImageView(newImgSrc);
        break;

      case 3:
        var newImgSrc = document.getElementById("imageTreeE").getAttribute('src');
        this.popImageView(newImgSrc);
        break;

      case 4:
        var newImgSrc = document.getElementById("imageFourR").getAttribute('src');
        this.popImageView(newImgSrc);
        break;

      case 5:
        var newImgSrc = document.getElementById("imageFiveE").getAttribute('src');
        this.popImageView(newImgSrc);
        break;
    }
  }

  changeTab(event: any) {
    if (event.nextId == '3') {
      this.imageControlMethord();
    }
  }

  async imageAssign(event, imgID, index) {
    const result = await this.imageService.validateImage(event, imgID, "edit");
    switch (index) {
      case 1:
        if (result) {
          this.imageCliant.patchValue({
            fileSource: result
          });
        }
        break;
      case 2:
        if (result) {
          this.imageCliant.patchValue({
            fileSource2: result,
            type2: 'edit'
          });
        }
        break;
      case 3:
        if (result) {
          this.type = 'edit';
          this.imageCliant.patchValue({
            fileSource3: result,
            type3: 'edit'
          });
        }
        break;
      case 4:
        if (result) {
          this.type = 'edit';
          this.imageCliant.patchValue({
            fileSource4: result,
            type4: 'edit'
          });
        }
        break;
      case 5:
        if (result) {
          this.type = 'edit';
          this.imageCliant.patchValue({
            fileSource5: result,
            type5: 'edit'
          });
        }
        break;
    }
  }

// ===============================================================start edit methods====================================

  // ============================================================================
  getAllCategory() {
    const sendData = {
      code: 'c'
    };

    this.categoryService.getAllCategory(sendData).subscribe(
      data => this.setAllCategory(data),
    );
  }

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

  getSubcategoryForSubSub(code) {
    // const tex = (document.getElementById('category_id_sub_sub') as HTMLInputElement).value;
    const senDdata = {
      code: code
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageGetSubcategoryForSubSubSub(data)
    );
  }

  manageGetSubcategoryForSubSubSub(data) {
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

  selectSubcategory(event, x: number) {

    switch (x) {
      case 1:
        const tex = (document.getElementById('category_ids') as HTMLInputElement).value;
        this.filteredSubCategory = this.productSubCategoryArray.filter((item) => (item as any).name === tex);

        this.category.get('Category2').setValue(tex);
        this.category.get('Category3').setValue('');
        event.target.value = ''
        this.filteredSubSubCategory = [];
        this.activeUpdate = true;

        this.getSubcategoryForSubSub(this.filteredSubCategory[0].code);
        break;
      case 2:
        const sub = (document.getElementById('category_sub_subids') as HTMLInputElement).value;
        this.filteredSubSubCategory = this.productSubSubCategoryArray.filter((item) => (item as any).name === sub);

        this.category.get('Category3').setValue(sub);
        event.target.value = ''
        break;
      default:
    }
  }

  updateSubSubCategory() {
    if (this.filteredSubSubCategory.length > 0) {
      const payload = {
        column: 'category_code',
        tblname: 'product_basic_info',
        value: this.filteredSubSubCategory[0].code,
        whereClause: 'product_code',
        whereValue: this.ids
      }
      this.productService.editAdminSave(payload).subscribe(
        data => {
          Swal.fire(
            'Updated!',
            '',
            'success'
          ),
            this.getProductByEdit(this.ids);
          this.activeUpdate = false;
          this.productSubSubCategoryArray = []
        }
      );

    } else {
      Swal.fire(
        'Updated!',
        '',
        'success'
      );
      this.activeUpdate = false;
      this.productSubSubCategoryArray = []
      this.getProductByEdit(this.ids);
    }
  }

  getSubcategory(cate) {
    for (let i = 0; i < this.productCategoryArray.length; i++) {
      if (this.productCategoryArray[i].name === cate) {
        const senDdata = {
          code: this.productCategoryArray[i].code
        };
        this.categoryService.getAllCategory(senDdata).subscribe(
          data => this.manageAllSubCategory(data)
        );
      }
    }
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

  // ------------------------------------------------------------------------
  getProductByEdit(id) {
    let payloard = {
      product_code: id
    };
    this.productService.getSelecedProductByEdit(payloard).subscribe(
      data => this.managetSelecedProductByEdit(data, id),
    );
  }

  managetSelecedProductByEdit(data, proCodeImg) {
    if(data.data.product.productVariation[0].variations[1].theame_value == 'none'){
      this.viewVariationAdd = false;
    }else{
      this.viewVariationAdd = true;
    }
    this.getSubcategory(data.data.product.item_group);
    // base info
    this.baseInfo.get('Title').setValue(data.data.product.title);
    this.productCode = data.data.product.product_code;
    this.baseInfo.get('Brand').setValue(data.data.product.brand);
    this.baseInfo.get('Manufacture').setValue(data.data.product.manufacture);
    this.oldTitle = data.data.product.title;
    this.oldBrand = data.data.product.brand;
    this.oldManufacture = data.data.product.manufacture;
    this.vendorCode = data.data.product.vendor;

    // description
    this.description.get('txt_description').setValue(data.data.product.productDescription.description);
    this.descriptionContent = data.data.product.productDescription.description;
    this.description.get('special_notes').setValue(data.data.product.productDescription.special_notes);
    // this.description.get('availability').setValue(data.data.product.productDescription.availability.toUpperCase());
    this.old_Txt_description = data.data.product.productDescription.description;
    this.old_special_notes = data.data.product.productDescription.special_notes;
    // this.old_availability = data.data.product.productDescription.availability.toUpperCase();

// category
    this.parts = data.data.category_path.split('> ');
    switch (this.parts.length) {
      case 1:
        this.category.get('Category1').setValue(data.data.category_path);
        break;
      case 2:
        this.category.get('Category1').setValue(data.data.category_path);
        this.category.get('Category2').setValue(this.parts[1]);
        break;
      case 3:
        this.category.get('Category1').setValue(data.data.category_path);
        this.category.get('Category2').setValue(this.parts[1]);
        this.category.get('Category3').setValue(this.parts[2]);
        break;
    }

    //offer

    this.offer.get('txt_seller_sku').setValue(data.data.product.productOffer.seller_sku);
    this.offer.get('condition').setValue(data.data.product.productOffer.condition);
    this.old_txt_seller_sku = data.data.product.productOffer.seller_sku;
    this.old_condition = data.data.product.productOffer.condition;

    for (let i = 0; i < data.data.product.productKeyword.keywords.length; i++) {
      const array = {
        key: data.data.product.productKeyword.keywords[i]
      };

      this.keyWordArray.push(array);
      this.keyWordArray2.push(data.data.product.productKeyword.keywords[i]);
    }


    if (data.data.product.is_active == 1) {
      this.title_name = 'Edit Product';
    }

    // VARIATION DETAIL SET
    if (data.data.product.has_group == 0) {
      this.checkBoxCon = new FormGroup({
        productGroup: new FormControl(false),
      });

      this.nonGroupArray = [];
      for (let i = 0; i < data.data.product.productVariation.length; i++) {
        let payData = {
          id: data.data.product.productVariation[i].id,
          theme: data.data.product.productVariation[i].variation_theme,
          value: data.data.product.productVariation[i].variation,
          qty: data.data.product.productVariation[i].quantity,

        };
        this.nonGroupArray.push(payData);
      }

    } else {
      this.checkBoxCon = new FormGroup({
        productGroup: new FormControl(true),
      });
      // this.addingProductGroups();

      for (let i = 0; i < data.data.product.productVariation.length; i++) {
        let payData = {};
        let color_value = '';
        let size_value = '';
        for (let j = 0; j < data.data.product.productVariation[i].variations.length; j++) {

          if (data.data.product.productVariation[i].variations[j].theame === 'Color') {
            color_value = data.data.product.productVariation[i].variations[j].theame_value;
          }
          if (data.data.product.productVariation[i].variations[j].theame === 'Size') {
            size_value = data.data.product.productVariation[i].variations[j].theame_value;
          }
          payData = {
            size: size_value,
            color: color_value,
            changing_rate: data.data.product.productVariation[i].changing_rate,
            cost_price: data.data.product.productVariation[i].cost_price,
            selling_price: data.data.product.productVariation[i].selling_price,

          };
        }
        this.productGroupTabel.push(payData);
      }
      this.tableSize = this.productGroupTabel.length;

      const payLoard = {
        category_code: data.data.product.category_code
      };

      const size_type = data.data.product.productVariation[0].variations[1].size_type;
      this.productService.getAttributes(payLoard).subscribe(
        data => {
          this.productAttributeList = data.data.variation_object['Select Your size Type'][size_type];
        }
      );

      // ++++++++++++++++ondemand price set values++++++++++++++++++++++++
      if (this.editPrice) {
        this.oldSellingPrice = this.productGroupTabel[0].selling_price;
        this.oldChangingRate = this.productGroupTabel[0].changing_rate;
        this.oldCostPrice = this.productGroupTabel[0].cost_price;
      }
    }

    if (data.data.product.productOffer.condition == 'Brand New') {
      (document.getElementById('condition') as HTMLInputElement).innerHTML = '<option value="Brand New">Brand New</option> <option value="Used - Good">Used - Good</option><option value="Used - Like New">Used - Like New</option><option value="">--Select--</option>';
    } else if (data.data.product.productOffer.condition == 'Used - Good') {
      (document.getElementById('condition') as HTMLInputElement).innerHTML = '<option value="Used - Good">Used - Good</option><option value="Brand New">Brand New</option><option value="Used - Like New">Used - Like New</option><option value="">--Select--</option>';
    } else if (data.data.product.productOffer.condition == 'Used - Like New') {
      (document.getElementById('condition') as HTMLInputElement).innerHTML = '<option value="Used - Like New">Used - Like New</option><option value="Used - Good">Used - Good</option><option value="Brand New">Brand New</option><option value="">--Select--</option>';
    }

    let p_string = '';
    let price_val = data.data.product.productOffer.price + (data.data.product.productOffer.price * data.data.price_margin) / 100;
    p_string = '' + price_val;
    this.amountBefor = p_string;

    let payloard = {
      product_code: proCodeImg
    };

    this.productService.getImageForEdit(payloard).subscribe(
      data => this.manageImageForEdit(data),
    );

    // this.disableElement(data);
  }

  manageImageForEdit(data) {
    var imageURI01Output = [];
    var imageURI02Output = [];
    var imageURI03Output = [];
    var imageURI04Output = [];
    var imageURI05Output = [];
    if (data['data'][0] != null) {
      var imageURI01 = data['data'][0];
      imageURI01Output = imageURI01.split('/product');
    }

    if (data['data'][1] != "none") {
      var imageURI02 = data['data'][1];
      imageURI02Output = imageURI02.split('/product');
      this.hideRemove2 = false;
    } else {
      this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
      imageURI02Output[1] = this.imagedefaultPathURI + '/1.jpg';
      this.hideRemove2 = true;
    }

    if (data['data'][2] != "none") {
      var imageURI03 = data['data'][2];
      imageURI03Output = imageURI03.split('/product');
      this.hideRemove3 = false;
    } else {
      this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
      imageURI03Output[1] = this.imagedefaultPathURI + '/1.jpg';
      this.hideRemove3 = true;
    }

    if (data['data'][3] != "none") {
      var imageURI04 = data['data'][3];
      imageURI04Output = imageURI04.split('/product');
      this.hideRemove4 = false;
    } else {
      this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
      imageURI04Output[1] = this.imagedefaultPathURI + '/1.jpg';
      this.hideRemove4 = true;
    }

    if (data['data'][4] != "none") {
      var imageURI05 = data['data'][4];
      imageURI05Output = imageURI05.split('/product');
      this.hideRemove5 = false;
    } else {
      this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
      imageURI05Output[1] = this.imagedefaultPathURI + '/1.jpg';
      this.hideRemove5 = true;
    }

    this.imageOne = imageURI01Output[1];
    this.imageOne2 = imageURI02Output[1];
    this.imageOne3 = imageURI03Output[1];
    this.imageOne4 = imageURI04Output[1];
    this.imageOne5 = imageURI05Output[1];

    let or = {
      'imageOne': data.data[0],
      'imageOne2': data.data[0],
      'imageOne3': data.data[0],
      'imageOne4': data.data[0],
      'imageOne5': data.data[0]
    };
    this.imageData.push(or);
  }

  backToLIst() {
    let url = 'products/digital/digital-product-list';
    this.router.navigate([url]);
  }

// ===============================================================end edit methods======================================
//   handleTabClick($event) {
//     $event.preventDefault();
//   }
  saveFieldCategory() {

    if (this.filteredSubCategory.length > 0) {
      const payload = {
        column: 'category_code',
        tblname: 'product_basic_info',
        value: this.filteredSubCategory[0].code,
        whereClause: 'product_code',
        whereValue: this.ids
      }
      this.productService.editAdminSave(payload).subscribe(
        data => this.updateSubSubCategory());
    } else {
      Swal.fire(
        'No Changes Found!',
        '',
        'info'
      );
    }
  }

  saveFieldBaseInfo() {
    let partnerId = sessionStorage.getItem('partnerId');
    let title = this.baseInfo.get('Title').value;
    let brand = this.baseInfo.get('Brand').value;
    let productId = this.ids;
    let manufacture = this.baseInfo.get('Manufacture').value;
    let payload = {
      referenceId: productId,
      type: 'PRODUCT',
      sub_type: 'product_basic',
      comment: 'product_basic',
      requestedBy: partnerId,
      userId: sessionStorage.getItem('userId'),

      data: [
        {
          column_name: 'title',
          old_value: this.oldTitle,
          new_value: title,
          call_name: 'title',
        },
        {
          column_name: 'brand',
          old_value: this.oldBrand,
          new_value: brand,
          call_name: 'brand',
        }
        // ,
        // {
        //   column_name: 'manufacture',
        //   old_value: this.oldManufacture,
        //   new_value: manufacture,
        //   call_name: 'manufacture',
        // }
      ]
    };
    this.productService.editField(payload).subscribe(
      data => this.manageEditField(data),
    );
  }

  private editFormControlMethode() {
    // ----------- base info ---------------
    this.baseInfo = new FormGroup({
      Title: new FormControl(''),
      Brand: new FormControl(''),
      ProductCode: new FormControl(''),
      Manufacture: new FormControl(''),
    });
    // ----------- Description ---------------
    this.description = new FormGroup({
      txt_description: new FormControl(''),
      special_notes: new FormControl(''),
      availability: new FormControl(''),
    });

    // ----------- Offer ---------------
    this.offer = new FormGroup({
      txt_seller_sku: new FormControl(''),
      condition: new FormControl(''),
    });
    // -------------category-----------
    this.category = new FormGroup({
      Category1: new FormControl(''),
      Category2: new FormControl(''),
      Category3: new FormControl('')
    });

    this.offer.get('txt_seller_sku').disable();
    this.offer.get('condition').disable();
  }

  private manageEditField(data) {

    if (data.message_status === 'Error') {
      Swal.fire(
        'error...!',
        data.message,
        'error'
      );
    } else if (data.message_status === 'Success') {
      Swal.fire(
        'well done...!',
        data.message,
        'success'
      );
    }
    this.router.navigate(['products/digital/digital-product-list']);
  }

  saveFieldDescription() {
    if (this.isAdmin) {
      if (this.old_Txt_description === this.descriptionContent) {
        Swal.fire(
          'No Changes Found!',
          '',
          'info'
        );
      } else {
        const payload = {
          column: 'description',
          tblname: 'product_description',
          value: this.descriptionContent,
          whereClause: 'pro_code',
          whereValue: this.ids
        }
        this.productService.editAdminSave(payload).subscribe(
          data => {
            Swal.fire(
              'Updated!',
              '',
              'success'
            ).then((result) => {
              if (result.isConfirmed) {
                this.descriptionContent === this.old_Txt_description
              }
            });
          }
        );
      }
    } else {
      let partnerId = sessionStorage.getItem('partnerId');
      let description = this.descriptionContent;
      let specialNotes = this.description.get('special_notes').value;
      let availability = this.description.get('availability').value;
      let productId = this.ids;

      let payload = {
        referenceId: productId,
        type: 'PRODUCT',
        sub_type: 'product_description',
        comment: 'product_description',
        requestedBy: partnerId,
        userId: sessionStorage.getItem('userId'),

        data: [
          {
            column_name: 'description',
            old_value: this.old_Txt_description,
            new_value: description,
            call_name: 'description',
          },
          {
            column_name: 'special_notes',
            old_value: this.old_special_notes,
            new_value: specialNotes,
            call_name: 'special_notes',
          },
          {
            column_name: 'availability',
            old_value: this.old_availability,
            new_value: availability,
            call_name: 'availability',
          }
        ]
      };


      this.productService.editField(payload).subscribe(
        data => this.manageEditField(data),
      );
    }
  }

  saveEditedImage() {
    let one = this.imageCliant.get('fileSource').value;
    let one2 = this.imageCliant.get('fileSource2').value;
    let one3 = this.imageCliant.get('fileSource3').value;
    let one4 = this.imageCliant.get('fileSource4').value;
    let one5 = this.imageCliant.get('fileSource5').value;

    let type2 = this.imageCliant.get('type2').value;
    let type3 = this.imageCliant.get('type3').value;
    let type4 = this.imageCliant.get('type4').value;
    let type5 = this.imageCliant.get('type5').value;
    const pricecc = new File([''], '');


    // *************************************************************

    if (one === '' && one2 === '' && one3 === '' && one4 === '' && one5 === '' && type2 === '' && type3 === '' && type4 === '' && type5 === '') {
      Swal.fire(
        "You haven't made any changes",
        '',
        'warning'
      );
      return;
    }

    if (one === '') {
      one = pricecc;
    }

    if (one2 === '') {
      one2 = pricecc;
    }

    if (one3 === '') {
      one3 = pricecc;
    }

    if (one4 === '') {
      one4 = pricecc;
    }

    if (one5 === '') {
      one5 = pricecc;
    }


    this.productService.editFieldImageSave(one, one2, one3, one4, one5, this.ids, type2, type3, type4, type5).subscribe(
      data => this.successAlert(data),
      error => this.mnageErrorProduct(error)
    );

    // *************************************************************
  }

  mnageErrorProduct(error) {
    Swal.fire(
      'Oops...',
      'Something Went Wrong!',
      'error'
    );
  }

  successAlert(data) {
    Swal.fire(
      'Good job!',
      'product save successful..!',
      'success'
    );
  }

  protected readonly event = event;
  protected readonly Event = Event;


  calcSellerIncomeBySellingPrice() {
    if ((document.getElementById('onDemandSellingPriceID') as HTMLInputElement).value === '' || (document.getElementById('onDemandMarginID') as HTMLInputElement).value === '') {
      // Swal.fire(
      //   'Error',
      //   'Pleas fill all the field',
      //   'warning'
      // );
      this.btnUpdatePrice = false;
      (document.getElementById('onDemandCostPriceID') as HTMLInputElement).value = this.oldCostPrice;
    } else {
      this.btnUpdatePrice = true;
      const sellingPrice = parseFloat((document.getElementById('onDemandSellingPriceID') as HTMLInputElement).value.trim());
      const margin = parseFloat((document.getElementById('onDemandMarginID') as HTMLInputElement).value.trim());

      const oldMargin = parseFloat(this.oldChangingRate);
      if (sellingPrice > 0 && margin > 0) {

        if (oldMargin <= margin) {
          const newCostPrice = sellingPrice - (margin * sellingPrice / 100);
          (document.getElementById('onDemandCostPriceID') as HTMLInputElement).value = newCostPrice.toString();
        } else {
          Swal.fire(
            'Error',
            'Margin must be greater than ' + oldMargin,
            'warning'
          );
          (document.getElementById('onDemandMarginID') as HTMLInputElement).value = this.oldChangingRate;
        }
      } else {
        Swal.fire(
          'Error',
          'Values must be greater than 0',
          'warning'
        );
        (document.getElementById('onDemandSellingPriceID') as HTMLInputElement).value = this.oldSellingPrice;
        (document.getElementById('onDemandMarginID') as HTMLInputElement).value = this.oldChangingRate;
      }

    }
  }

  updatePrice() {

    const productId = this.ids;
    const newCostPrice = parseFloat((document.getElementById('onDemandCostPriceID') as HTMLInputElement).value.trim());
    const newChangingRate = parseFloat((document.getElementById('onDemandMarginID') as HTMLInputElement).value.trim());
    const newSellingPrice = parseFloat((document.getElementById('onDemandSellingPriceID') as HTMLInputElement).value.trim());

    const payload = {
      referenceId: productId,
      type: 'PRODUCT_PRICE',
      sub_type: 'product_price',
      comment: 'PRODUCT_PRICE',
      requestedBy: sessionStorage.getItem('partnerId'),
      userId: sessionStorage.getItem('userId'),
      data: [
        {
          column_name: 'cost_price',
          old_value: this.oldCostPrice,
          new_value: newCostPrice,
          call_name: 'cost_price',
        },
        {
          column_name: 'changing_rate',
          old_value: this.oldChangingRate,
          new_value: newChangingRate,
          call_name: 'changing_rate',
        },
        {
          column_name: 'selling_price',
          old_value: this.oldSellingPrice,
          new_value: newSellingPrice,
          call_name: 'selling_price',
        }
      ]
    };


    if (productId === '') {
      Swal.fire(
        'Error',
        'Error',
        'warning'
      );
    } else {
      this.productService.editField(payload).subscribe(
        data => this.manageEditField(data),
      );
    }
  }

  updateTitle() {
    if (this.isAdmin) {

      if (this.oldTitle === this.titleValue) {
        Swal.fire(
          'No Changes Found!',
          '',
          'info'
        );
      } else {
        const payload = {
          column: 'title',
          tblname: 'product_basic_info',
          value: this.titleValue,
          whereClause: 'product_code',
          whereValue: this.ids
        }
        this.productService.editAdminSave(payload).subscribe(
          data => {
            Swal.fire(
              'Updated!',
              '',
              'success'
            ).then((result) => {
              if (result.isConfirmed) {
                this.titleValue === this.oldTitle;
              }
            });
          }
        );
      }
    }
  }

  getVariationColors() {
    this.productService.getAllColorsForVariation().subscribe(
      data => {
        this.variationColors = data.data;
        for (const color of this.variationColors) {
          const option = {value: color.colorCode, label: color.colorName};
          this.variationOptions.push(option);
        }
      }
    );
  }

  selectColor(event) {
    const selectedVariation = event.target.value;
    this.colorArrayForClothes = [];
    if (selectedVariation) {
      // this.selectColorErrorStyle = '';
      if (!this.colorArrayForClothes.includes(selectedVariation)) {
        this.colorArrayForClothes.push(selectedVariation);
        this.colorArrayForClothesJob = this.colorArrayForClothes;
        this.showSizeAdd = true;
      }
    }

  }

  removeColorForClothes() {
    this.colorArrayForClothes = [];
    const colorSelect = document.getElementById('colorSelect') as HTMLSelectElement;
    colorSelect.value = '';
    this.inputValue = null;
    this.showSizeAdd = false;
  }

  addNewVariation() {
    if (!this.inputValue) {
      Swal.fire(
        'Oops',
        'Please Select Size',
        'warning'
      );
      return;
    }

    const existsAtIndex = this.productGroupTabel.findIndex(item => item.color === this.colorArrayForClothes[0] && item.size === this.inputValue.toString());
    if (existsAtIndex !== -1) {
      Swal.fire(
        'Oops',
        'Already Added!',
        'warning'
      );
      return;
    }

    const or = {
      color: this.colorArrayForClothes[0],
      size: this.inputValue.toString(),
      cost_price: this.productGroupTabel[0].cost_price,
      changing_rate: this.productGroupTabel[0].changing_rate,
      selling_price: this.productGroupTabel[0].selling_price
    };
    this.productGroupTabel.push(or);
    this.newAddedVariations.push(or);
    this.showUpdateButton = true;
    this.removeColorForClothes();
  }

  removeAddedVariation(i) {
    this.productGroupTabel.splice(i, 1);
    this.newAddedVariations.splice(i - this.tableSize, 1);

    if (this.newAddedVariations.length === 0) {
      this.showUpdateButton = false;
    }
  }

  updateVariation() {
    const exportData = [];
    for (let i = 0; i < this.newAddedVariations.length; i++) {
      const data = [
        {
          column_name: 'color',
          new_value: this.newAddedVariations[i].color,
          old_value: this.newAddedVariations[i].size,
          call_name: 'color',
        }
      ];
      exportData.push(data);
    }
    const payload = {
      referenceId: this.ids,
      type: 'PRODUCT',
      sub_type: 'product_variation',
      comment: 'product_variation',
      requestedBy: sessionStorage.getItem('partnerId'),
      userId: sessionStorage.getItem('userId'),
      data: this.newAddedVariations
    };
    this.productService.editField(payload).subscribe(
      data => this.manageEditField(data),
    );
  }

  addSize() {
    const newSize = (document.getElementById('clothesSizeUk') as HTMLInputElement).value;
    this.inputValue = newSize;
  }
}
