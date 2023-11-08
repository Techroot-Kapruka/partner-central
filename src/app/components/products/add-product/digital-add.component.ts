import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from '../../../shared/service/product.service';
import Swal from 'sweetalert2';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CategoryService} from '../../../shared/service/category.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';

interface Item {
  id: number;
  name: string;
}


@Component({
  selector: 'app-digital-add',
  templateUrl: './digital-add.component.html',
  styleUrls: ['./digital-add.component.scss']
})


export class DigitalAddComponent implements OnInit {

  @ViewChild('txtKeyword') txtKeyword: ElementRef;

  constructor(private modalService: NgbModal, private productService: ProductService, private router: Router, private categoryService: CategoryService, private el: ElementRef) {
    this.imageControlMethord();
    this.getCategory();
    this.isDisplay = 'block';
    this.getVariationColors();
    // this.addCopyPasteListeners();
  }

  ngAfterViewInit() {
    this.addCopyPasteListeners();
  }

  fileTypeError = false;
  private categoryMargin = 0.00;
  private categoryMarginMain = 0.00;
  public categoryNameForItemGroup = '';
  public categoryCode = '';
  public variationKeyArray = [];
  public variationvalueSizeTypeObjArray = [];
  public variationvalueArrayForNonObject = [];
  public variationvalueArrayObject = [];
  public hashmapForVariations = {};
  public hashmapForVariationsObj = {};
  public inputValue = '';
  descriptionContent = '';
  textArea = '';
  isSizeTypeSelected = false;
  selectedType = '';
  showMoreMode = true;
  isColorVariation = false;
  showImageCropper = false;

  public keyArrays = [];
  attributesKeyArr = [];
  public isSelect = false;
  public isAvailableVariation = false;
  public isDivDisabled = true;
  public isAttrDisabled = true;
  public sellerSku = '';
  public emptyHashMap = true;
  selectedVariationKey = null;
  addProductClicked = false;

  /************* Help ************/
  showHint = false;
  showHintPI = false;
  showHintPD = false;
  showHintPA = false;
  showHintPV = false;
  showHintBrand = false;
  showHintSku = false;
  showHintSCP = false;
  showHintKey = false;
  margin: any;
  variationColors = [];
  variationOptions = [];

  visibleElementCount = 6;
  totalElementCount: number;
  loadMoreElements = 30;
  imgUploaded1: boolean = false;
  imgUploaded2: boolean = false;
  imgUploaded3: boolean = false;
  imgUploaded4: boolean = false;
  imgUploaded5: boolean = false;


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

  @ViewChild('angularEditor', {static: false}) angularEditor: any;
  @ViewChild('productDescriptionTextarea', {static: false}) productDescriptionTextarea: ElementRef;


  public imageCliant: FormGroup;
  public checkBoxCon: FormGroup;
  public productGroupCon: FormGroup;
  public maintainStock: FormGroup;

  @Input()
  public categoryArray = [];
  public isColor = false;
  public isSize = false;
  public isWeight = false;
  public isStorage = false;
  public isCapacity = false;
  public colorsAndSize = false;
  public closeResult: string;
  public colorArray = [];
  public sizeArray = [];
  public productGroupTabel = [];
  public keyWordArray = [];
  public keyWordArray2 = [];
  public isDisplay = 'none';
  public sizeAndColorArray = [];
  public colorNameArray = [];
  public colorCodeArray = [];
  public sizeNameArray = [];
  public colorAndSizeArray = [];
  public imageArr = [];
  public variationValue = '';
  public productVariationArr = [];
  public weightValue = '';
  public weightBool = false;
  public storageValue = '';
  public capacityValue = '';
  public nonGroupArray = [];
  public globleIndex = 0;
  public isNone = true;
  public amountBefor = '';

  public SubCategoryArray = [];
  public subSubCategoryArray = [];
  public allCategoryBreadcrumbArr = [];
  public setCategoryCount = 0;
  public categoryRequestArr = [];
  public mainCategoryArr = [];
  public selectedOption = '';
  public isClothing = false;
  public selectedParth = '';
  public isInternational = false;
  public SelectedSize = '';
  public clothesArray = [];
  public colorArrayForClothes = [];
  public sizeArrayForClothes = [];
  public matchCountOfSizeAndColorsArrays = true;
  public colorArrayForClothesJob = [];
  public sizeArrayForClothesJob = [];
  public isCollapsed = true;
  public isAttributesCollapsed = true;
  public isCategoryPath = [];
  public categoryPath = '';
  public isAvailableCat = false;
  public isAvailableSubCat = false;
  public isAvailableSubSubCat = false;
  public indexCat = 0;
  public indexSubCat = 0;
  public indexSubSubCat = 0;
  public subSubSubCategoryArray = [];
  public sizeString = '';
  public objectCategoryCode = '';
  public attributesArray = [];
  public hashMap = {};
  oneTimeClicked = false;
  mainImageAdded = false;
  showmsg = false;
  showmsg1 = false;
  selectedVariationId;
  attributeArr = [];
  selectColorErrorStyle = '';

  textAreaContent = '';

  items: Item[] = [
    {id: 1, name: 'Item 1'},
    {id: 2, name: 'Item 2'},
    {id: 3, name: 'Item 3'}
  ];
  selectedItemId: number | null = null;

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

  public config1: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };

  readonly Object = Object;

  getColorWord(colorValue) {
    const colorToWordMap = new Map();

    this.variationColors.forEach(item => {
      colorToWordMap.set(item.colorCode, item.colorName);
    });

    if (colorToWordMap.has(colorValue)) {
      return colorToWordMap.get(colorValue);
    } else {
      return 'Unknown';
    }
  }


  ngOnInit() {
  }

  copyEditorContentToTextarea() {
    this.productDescriptionTextarea = this.angularEditor.value;
  }

  updateInputValue() {
    if (this.categoryMarginMain === 0) {
      Swal.fire(
        'First Add Category',
        'Fill Form Step by Step',
        'warning'
      );
      (document.getElementById('initialMargin') as HTMLInputElement).value = '0.00';
    } else {
      const inputElement = (document.getElementById('initialMargin') as HTMLInputElement);
      if (inputElement && parseFloat(inputElement.value) < this.margin) {
        inputElement.value = this.categoryMargin.toFixed(2).toString();
        Swal.fire(
          'You are Not Allowed to Degrade the Margin.',
          'Only Increasing is Allowed',
          'warning'
        );

      } else {
        if (parseFloat(inputElement.value) > 100.00 || inputElement.value === '') {
          inputElement.value = this.categoryMargin.toFixed(2).toString();
          Swal.fire(
            'Please Enter Valid Margin',
            '',
            'warning'
          );
        } else {
          this.categoryMargin = Number(inputElement.value);
          this.setSellingPrice();
        }
      }
    }
  }


  toggleDiv() {
    this.isDivDisabled = !this.isDivDisabled;
    if (this.isDivDisabled) {
      (document.getElementById('Seller_SKU_2') as HTMLInputElement).value = (document.getElementById('Seller_SKU') as HTMLInputElement).value;
      (document.getElementById('Seller_SKU') as HTMLInputElement).disabled = false;
    } else {
      (document.getElementById('Seller_SKU') as HTMLInputElement).disabled = true;
    }
  }

  toggleAttribute() {
    this.isAttrDisabled = !this.isAttrDisabled;
    (document.getElementById('attrId') as HTMLInputElement).hidden = !this.isAttrDisabled;
  }

  readUrl(event: any, i) {

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
    // tslint:disable-next-line:variable-name
    reader.onload = (_event) => {
      this.url[i].img = reader.result.toString();
    };
  }


  getResultDemo() {
    const getDetails = (document.getElementById('themeVar') as HTMLInputElement).value;
    if (getDetails === 'none') {
      this.isColor = false;
      this.isSize = false;
      this.colorsAndSize = false;
      this.isWeight = false;
      this.isStorage = false;
      this.isCapacity = false;
      document.getElementById('isNone').style.display = 'none';

    }

    if (getDetails === 'color') {
      document.getElementById('isNone').style.display = 'block';
      this.isColor = true;
      this.isSize = false;
      this.colorsAndSize = false;
      this.isWeight = false;
      this.isStorage = false;
      this.isCapacity = false;


    }

    if (getDetails === 'size') {
      document.getElementById('isNone').style.display = 'block';
      this.isColor = false;
      this.isSize = true;
      this.colorsAndSize = false;
      this.isWeight = false;
      this.isStorage = false;
      this.isCapacity = false;

    }

    if (getDetails === 'color-size-name') {
      document.getElementById('isNone').style.display = 'block';
      this.isColor = false;
      this.isSize = false;
      this.colorsAndSize = true;
      this.isWeight = false;
      this.isStorage = false;
      this.isCapacity = false;

    }
    if (getDetails === 'weight') {
      document.getElementById('isNone').style.display = 'block';
      this.isColor = false;
      this.isSize = false;
      this.colorsAndSize = false;
      this.isWeight = true;
      this.isStorage = false;
      this.isCapacity = false;

    }
    if (getDetails === 'storage') {
      document.getElementById('isNone').style.display = 'block';
      this.isColor = false;
      this.isSize = false;
      this.colorsAndSize = false;
      this.isWeight = false;
      this.isStorage = true;
      this.isCapacity = false;

    }

    if (getDetails === 'capacity') {
      document.getElementById('isNone').style.display = 'block';
      this.isColor = false;
      this.isSize = false;
      this.colorsAndSize = false;
      this.isWeight = false;
      this.isStorage = false;
      this.isCapacity = true;

    }
    this.weightBool = false;
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

  getCategory() {
    const searchText = '';
    const payloard = {
      partner_u_id: sessionStorage.getItem('partnerId'),
      keyword: searchText
    };
    this.productService.getSearchCategory(payloard).subscribe(
      data => this.manageSerchingCategory(data),
    );
  }

  manageSerchingCategory(data) {
    this.categoryArray = [];
    for (let i = 0; i < data.data.pathList.length; i++) {
      const ar = {
        id: i,
        path: data.data.pathList[i].path,
        code: data.data.pathList[i].code,
        pricemargin: data.data.pathList[i].price_margin
      };
      this.categoryArray.push(ar);
    }
    // this.getSub_category();
  }

  changeEvent(data, code, priceMargin) {
    (document.getElementById('breadcrum') as HTMLInputElement).innerHTML = data;
    (document.getElementById('category' + '' + '_code') as HTMLInputElement).value = code;
    if (priceMargin != null) {
      (document.getElementById('txt_price_rate') as HTMLInputElement).value = priceMargin;
      (document.getElementById('txt_price_rate_hidden') as HTMLInputElement).value = priceMargin;
      (document.getElementById('txt_amount') as HTMLInputElement).disabled = true;
    }
  }


  removeColor(color: any) {
    (document.getElementById('setColorInput') as HTMLInputElement).value = '';
    for (let i = 0; i < this.colorArray.length; i++) {
      if (this.colorArray[i].colorV === color) {
        this.colorArray.splice(i, 1);
      }
    }
  }

  getSizeBySelect() {
    this.variationValue = '';
    const size = (document.getElementById('size') as HTMLInputElement).value;
    let name = '';
    if (size === '1') {
      name = 'XS';
    } else if (size === '2') {
      name = 'S';
    } else if (size === '3') {
      name = 'M';
    } else if (size === '4') {
      name = 'L';
    } else if (size === '5') {
      name = 'XL';
    } else if (size === '6') {
      name = 'XXL';
    }
    const sizeValue = {
      sizeS: name,
      sizeValue: size
    };
    this.sizeArray.push(sizeValue);
    this.sizeNameArray.push(name);
    this.variationValue = name;
  }

  removeSize(sizeN: any) {

    for (let i = 0; i < this.sizeArray.length; i++) {
      if (this.sizeArray[i].sizeS === sizeN) {
        this.sizeArray.splice(i, 1);
      }
    }
  }

  getOptionsList(array) {
    const options = [];
    let i = 0;
    for (const arrayKey of array) {
      const data = {
        value: arrayKey,
        label: arrayKey
      };
      i++;
      options.push(data);
    }
    return options;
  }

  addKeyWord() {
    let keyword = (document.getElementById('txt_keyword') as HTMLInputElement).value;
    keyword = keyword.replace(',', '');
    const array = {
      key: keyword
    };

    if (keyword === '') {
    } else if (this.keyWordArray.length === 5) {
      Swal.fire(
        'Hey',
        'You can add only 5 Keywords!',
        'info'
      );
      return;
    } else {
      this.keyWordArray.push(array);
      this.keyWordArray2.push(keyword);
    }


    (document.getElementById('txt_keyword') as HTMLInputElement).value = '';
  }

  removeKeyWord(keyWord) {
    for (let i = 0; i < this.keyWordArray.length; i++) {
      if (this.keyWordArray[i].key === keyWord) {
        this.keyWordArray.splice(i, 1);
      }
    }
  }

  addSizeAndColor() {
    const value = (document.getElementById('colorInputss') as HTMLInputElement).value;
    const size = (document.getElementById('sizeIN') as HTMLInputElement).value;

    let name = '';
    if (size === '1') {
      name = 'XS';
    } else if (size === '2') {
      name = 'S';
    } else if (size === '3') {
      name = 'M';
    } else if (size === '4') {
      name = 'L';
    } else if (size === '5') {
      name = 'XL';
    } else if (size === '6') {
      name = 'XXL';
    }

    let ccc = '';
    if (value === '#ffffff') {
      ccc = 'White';
    } else if (value === '#ff0000') {
      ccc = 'Red';
    } else if (value === '#0000ff') {
      ccc = 'Blue';
    } else if (value === '#ffff00') {
      ccc = 'Yellow';
    } else if (value === '#00ff00') {
      ccc = 'Green';
    } else if (value === '#808080') {
      ccc = 'Gray';
    } else if (value === '#800080') {
      ccc = 'Purple';
    } else if (value === '#ffa500') {
      ccc = 'Orange';
    } else if (value === '#800000') {
      ccc = 'Maroon';
    } else if (value === '#000000') {
      ccc = 'Black';
    } else {
      ccc = 'Black';
    }
    const ccllf = ccc + '-' + name;
    const array = {
      colorNS: ccc,
      sizeSZ: name,
      colorVal: value
    };
    this.sizeAndColorArray.push(array);
    this.colorAndSizeArray.push(ccllf);
    this.colorCodeArray.push(value);
  }

  removeSizeAndColor(size: any, color: any) {
    for (let i = 0; i < this.sizeAndColorArray.length; i++) {
      if (this.sizeAndColorArray[i].sizeSZ === size && this.sizeAndColorArray[i].colorVal === color) {
        this.sizeAndColorArray.splice(i, 1);
      }
    }
  }

  saveProduct() {

    if (this.showmsg1 === false && this.showmsg === false) {

    } else {
      Swal.fire(
        'Whoops...!',
        'Please Check the Description',
        'error'
      );
      return;
    }
    if (this.mainImageAdded === false) {
      Swal.fire(
        'Whoops..!',
        'Main Image cannot be empty!',
        'error'
      );
      return;
    }

    let isEmpty = false;
    let isListingPrice = false;

    const partner_uid = sessionStorage.getItem('partnerId');
    const price = Number((document.getElementById('price') as HTMLInputElement).value);
    const sellerSKU = (document.getElementById('Seller_SKU') as HTMLInputElement).value;
    const product_name = (document.getElementById('product_name') as HTMLInputElement).value;
    // const product_description = (document.getElementById('product_description') as HTMLInputElement).value;
    const product_description = this.descriptionContent;
    const sellerPrice = Number((document.getElementById('sellerPrice') as HTMLInputElement).value);

    isEmpty = this.checkEmptyField();
    isListingPrice = this.validateListingPrice();

    if (isEmpty) {
      if (isListingPrice) {
        this.addProductClicked = true;
        const productVariation = [];

        //set images
        let one = this.imageCliant.get('fileSource').value;
        let one2 = this.imageCliant.get('fileSource2').value;
        let one3 = this.imageCliant.get('fileSource3').value;
        let one4 = this.imageCliant.get('fileSource4').value;
        let one5 = this.imageCliant.get('fileSource5').value;

        console.log(one);
        const pricecc = new File([''], '');
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

        if (this.clothesArray.length === 0) {
          const pp = {
            changing_amount: 0,
            changing_rate: 0.0,
            cost_price: sellerPrice,
            selling_price: price,
            variation: 'None',
            variation_theme: 'None',
            variations: [],
          };
          productVariation.push(pp);
          const brandHtml = (document.getElementById('Brand') as HTMLInputElement);
          let brand_ = 'none';
          if (brandHtml) {
            brand_ = (document.getElementById('Brand') as HTMLInputElement).value;
          }
          const payload = {
            category_code: this.objectCategoryCode,
            title: product_name,
            brand: brand_,
            manufacture: '',
            vendor: partner_uid,
            has_group: 1,
            maintain_stock: 1,
            stock_uom: 'Nos',
            item_group: this.categoryNameForItemGroup,
            productDescription: {
              description: product_description,
              special_notes: ' ',
              availability: 'no'
            },
            productOffer: {
              seller_sku: sellerSKU,
              price: 0.0,
              condition: 'Brand New',
              amount: 0.0,
              price_rate: 0.0,
              seling_price: price
            },
            productVariation,
            productKeyword: {
              keywords: this.keyWordArray2
            },
            productAttributes: this.attributeArr
          };


          this.productService.insertProductWithImages(one, one2, one3, one4, one5, payload).subscribe(
            data => this.successAlert(data),
            error => this.mnageErrorProduct(error)
          );

        } else {
          for (let i = 0; i < this.clothesArray.length; i++) {
            const pp = {
              changing_amount: 0,
              changing_rate: 0.0,
              cost_price: sellerPrice,
              selling_price: price,
              variation: 'Black',
              variation_theme: 'color',
              variations: [
                {
                  theame: 'color',
                  theame_value: this.clothesArray[i].color_
                },
                {
                  theame: 'size',
                  theame_value: this.clothesArray[i].size_
                }
              ]
            };
            productVariation.push(pp);
          }
          const brandHtml = (document.getElementById('Brand') as HTMLInputElement);
          let brand_ = 'none';
          if (brandHtml) {
            brand_ = (document.getElementById('Brand') as HTMLInputElement).value;
          }
          const payload = {
            category_code: this.objectCategoryCode,
            title: product_name,
            brand: brand_,
            manufacture: '',
            vendor: partner_uid,
            has_group: 1,
            maintain_stock: 1,
            stock_uom: 'Nos',
            item_group: this.categoryNameForItemGroup,
            productDescription: {
              description: product_description,
              special_notes: ' ',
              availability: 'no'
            },
            productOffer: {
              seller_sku: sellerSKU,
              price: 0.0,
              condition: 'Brand New',
              amount: 0.0,
              price_rate: 0.0,
              seling_price: price
            },
            productVariation,
            productKeyword: {
              keywords: this.keyWordArray2
            },
            productAttributes: this.attributeArr
          };
          this.productService.insertProductWithImages(one, one2, one3, one4, one5, payload).subscribe(
            data => this.successAlert(data),
            error => this.mnageErrorProduct(error)
          );

        }
      } else {
        Swal.fire(
          'Whoops...!',
          'Price should be positive....',
          'error'
        );
      }
    }

  }

  checkEmptyField() {
    let isVEmpty = true; // Assume all fields are filled initially

    const listing_price = ((document.getElementById('price') as HTMLInputElement).value);
    const sellerSKU = (document.getElementById('Seller_SKU') as HTMLInputElement).value;
    // const sellerSKU2 = (document.getElementById('Seller_SKU_2') as HTMLInputElement).value;
    const product_name = (document.getElementById('product_name') as HTMLInputElement).value;
    const product_description = (document.getElementById('product_description') as HTMLInputElement).value;
    const productBrandHtml = (document.getElementById('Brand') as HTMLInputElement);
    if (productBrandHtml) {
      const productBrand = (document.getElementById('Brand') as HTMLInputElement).value;
    }

    // Check if any of the fields are empty, and update isVEmpty accordingly
    if (product_name === '' || sellerSKU === '' || listing_price === '' || product_description === '' || this.categoryPath === '') {
      isVEmpty = false;
    }
    document.getElementById('product_name').style.borderColor = product_name ? 'green' : 'red';
    document.getElementById('Seller_SKU').style.borderColor = sellerSKU ? 'green' : 'red';
    document.getElementById('price').style.borderColor = listing_price ? 'green' : 'red';
    // document.getElementById('Brand').style.borderColor = productBrand ? 'green' : 'red';
    document.getElementById('product_description').style.borderColor = product_description ? 'green' : 'red';

    if (!isVEmpty) {
      Swal.fire(
        'Whoops...!',
        'Please ensure that all fields are completed before submitting',
        'error'
      );
    }
    return isVEmpty;
  }

  validateListingPrice() {
    let listingPrice = false;

    const listing_price = Number((document.getElementById('price') as HTMLInputElement).value);

    if (isNaN(listing_price) || listing_price <= 0) {
      document.getElementById('price').style.borderColor = 'red';
      listingPrice = false;
    } else {
      document.getElementById('price').style.borderColor = 'green';
      listingPrice = true;
    }
    return listingPrice;
  }


  mnageErrorProduct(error) {
    this.addProductClicked = false;
    switch (error.status) {
      case 200: {
        Swal.fire(
          'Oops...',
          error.message,
          'error'
        );
        break;
      }
      case 401: {
        Swal.fire(
          'Oops...',
          'Unauthorized! Please login agin',
          'error'
        );
        break;
      }
      case 400: {
        Swal.fire(
          'Oops...',
          'Invalid Request! Please check your values',
          'error'
        );
        break;
      }
      case 500: {
        Swal.fire(
          'Oops...',
          'Something Went Wrong! Please contact the administrator.',
          'error'
        );
        break;
      }
    }

  }

  imageControlMethord() {
    this.imageCliant = new FormGroup({
      imageOne: new FormControl(''),
      imageOne2: new FormControl(''),
      imageOne3: new FormControl(''),
      imageOne4: new FormControl(''),
      imageOne5: new FormControl(''),
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
      qty: new FormControl(0),
      proGSellingPrice: new FormControl(''),
    });
  }

  onSelectAttribute($event) {
    const key = $event.target.id;
    const value = $event.target.value;
    const existingAttributeIndex = this.attributeArr.findIndex(attr => Object.keys(attr)[0] === key);

    if (value === '') {
      if (existingAttributeIndex !== -1) {
        this.attributeArr.splice(existingAttributeIndex, 1);
      }
    } else {
      const attribute = {
        [key]: value
      };
      if (existingAttributeIndex !== -1) {
        this.attributeArr[existingAttributeIndex][key] = value;
      } else {
        this.attributeArr.push(attribute);
      }
    }
  }

  resizeImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 700;
      canvas.height = 700;

      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        // Calculate the new image dimensions, maintaining aspect ratio
        let width, height;
        if (image.width > image.height) {
          width = canvas.width;
          height = image.height * (canvas.width / image.width);
        } else {
          height = canvas.height;
          width = image.width * (canvas.height / image.height);
        }

        // Calculate position to center the image
        const offsetX = (canvas.width - width) / 2;
        const offsetY = (canvas.height - height) / 2;


        // Create a white background
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the centered and resized image onto the canvas
        try {
          ctx.drawImage(image, offsetX, offsetY, width, height);
        } catch (e) {
          reject('Image Drawing Error');
          return;
        }

        // Convert the canvas content to a File
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {type: file.type});
            resolve(resizedFile);
          } else {
            reject('Canvas toBlob Error');
          }
        }, file.type);
      };

      image.onerror = () => {
        reject('Image Loading Error');
      };
    });
  }


  async changeValue(event: any, i) {
    if (event.target.files.length === 0) {
      return;
    }

    // Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'Error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return; // Stop further actions if the image is not a JPEG
    }

    // Check the image resolution
    let image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);

    // Create a promise to hold the async operation
    const checkImageResolution = new Promise<void>((resolve, reject) => {
      image.onload = () => {
        if (image.naturalWidth > 5000 || image.naturalHeight > 5000) {
          Swal.fire(
            'Error',
            'The maximum resolution supported for images is 5000x5000 pixels.',
            'error'
          );
          this.removeimg(0);
          reject('Invalid image resolution'); // Reject the promise to stop further actions
        } else {
          resolve(); // Resolve the promise to continue with further actions
        }
      };
    });

    try {
      // Wait for the image resolution check to complete
      await checkImageResolution;

      // Continue with further actions here because the image is valid
      this.showImageCropper = true;
      this.mainImageAdded = true;
      this.imgUploaded1 = true;

      // Display the image
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        (document.getElementById('imageOneO') as HTMLInputElement).src = reader.result.toString();
        (document.getElementById('mainImage') as HTMLInputElement).src = reader.result.toString();
      };

      // Upload and handle the image
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.resizeImage(file)
          .then((resizedFile) => {
            this.imageCliant.patchValue({
              fileSource: resizedFile
            });
          })
          .catch((error) => {
            this.removeimg(1);
            Swal.fire(
              'error',
              'Image upload error: ' + error,
              'error'
            );
          });
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'The maximum resolution supported for images is 5000x5000 pixels.',
        'error'
      );
    }
  }


  removeimg(x: number) {
    switch (x) {
      case 1:
        this.imgUploaded1 = false;
        this.mainImageAdded = false;
        this.imageCliant.patchValue({
          fileSource: '',
          imageOne: '',
        });
        (document.getElementById('imageOneO') as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
        break;
      case 2:
        this.imgUploaded2 = false;
        this.imageCliant.patchValue({
          fileSource2: '',
          imageOne2: '',
        });
        (document.getElementById('imageTwoO') as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
        break;
      case 3:
        this.imgUploaded3 = false;
        this.imageCliant.patchValue({
          fileSource3: '',
          imageOne3: '',
        });
        (document.getElementById('imageTreeE') as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
        break;
      case 4:
        this.imgUploaded4 = false;
        this.imageCliant.patchValue({
          fileSource4: '',
          imageOne4: '',
        });
        (document.getElementById('imageFourR') as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
        break;
      case 5:
        this.imgUploaded5 = false;
        this.imageCliant.patchValue({
          fileSource5: '',
          imageOne5: '',
        });
        (document.getElementById('imageFiveE') as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
        break;
    }
  }

  async changeValue2(event) {
    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'Error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return;
    }
    // Check the image resolution
    let image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);

    // Create a promise to hold the async operation
    const checkImageResolution = new Promise<void>((resolve, reject) => {
      image.onload = () => {
        if (image.naturalWidth > 5000 || image.naturalHeight > 5000) {
          Swal.fire(
            'Error',
            'The maximum resolution supported for images is 5000x5000 pixels.',
            'error'
          );
          this.removeimg(2);
          reject('Invalid image resolution'); // Reject the promise to stop further actions
        } else {
          resolve(); // Resolve the promise to continue with further actions
        }
      };
    });

    try {
      // Wait for the image resolution check to complete
      await checkImageResolution;

      // Continue with further actions here because the image is valid
      this.showImageCropper = true;
      this.mainImageAdded = true;
      this.imgUploaded2 = true;

      // Display the image
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        (document.getElementById('imageTwoO') as HTMLInputElement).src = reader.result.toString();
      };

      // Upload and handle the image
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.resizeImage(file)
          .then((resizedFile) => {
            this.imageCliant.patchValue({
              fileSource2: resizedFile
            });
          })
          .catch((error) => {
            this.removeimg(2);
            Swal.fire(
              'error',
              'Image upload error: ' + error,
              'error'
            );
          });
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'The maximum resolution supported for images is 5000x5000 pixels.',
        'error'
      );
    }
  }

  async changeValue3(event) {

    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    // Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'Error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return;
    }
    // Check the image resolution
    let image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);

    // Create a promise to hold the async operation
    const checkImageResolution = new Promise<void>((resolve, reject) => {
      image.onload = () => {
        if (image.naturalWidth > 5000 || image.naturalHeight > 5000) {
          Swal.fire(
            'Error',
            'The maximum resolution supported for images is 5000x5000 pixels.',
            'error'
          );
          this.removeimg(3);
          reject('Invalid image resolution'); // Reject the promise to stop further actions
        } else {
          resolve(); // Resolve the promise to continue with further actions
        }
      };
    });

    try {
      // Wait for the image resolution check to complete
      await checkImageResolution;

      // Continue with further actions here because the image is valid
      this.showImageCropper = true;
      this.mainImageAdded = true;
      this.imgUploaded3 = true;

      // Display the image
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        (document.getElementById('imageTreeE') as HTMLInputElement).src = reader.result.toString();
      };

      // Upload and handle the image
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.resizeImage(file)
          .then((resizedFile) => {
            this.imageCliant.patchValue({
              fileSource3: resizedFile
            });
          })
          .catch((error) => {
            this.removeimg(3);
            Swal.fire(
              'error',
              'Image upload error: ' + error,
              'error'
            );
          });
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'The maximum resolution supported for images is 5000x5000 pixels.',
        'error'
      );
    }
  }

  async changeValue4(event) {

    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'Error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return;
    }
    // Check the image resolution
    let image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);

    // Create a promise to hold the async operation
    const checkImageResolution = new Promise<void>((resolve, reject) => {
      image.onload = () => {
        if (image.naturalWidth > 5000 || image.naturalHeight > 5000) {
          Swal.fire(
            'Error',
            'The maximum resolution supported for images is 5000x5000 pixels.',
            'error'
          );
          this.removeimg(4);
          reject('Invalid image resolution'); // Reject the promise to stop further actions
        } else {
          resolve(); // Resolve the promise to continue with further actions
        }
      };
    });

    try {
      // Wait for the image resolution check to complete
      await checkImageResolution;

      // Continue with further actions here because the image is valid
      this.showImageCropper = true;
      this.mainImageAdded = true;
      this.imgUploaded4 = true;

      // Display the image
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        (document.getElementById('imageFourR') as HTMLInputElement).src = reader.result.toString();
      };

      // Upload and handle the image
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.resizeImage(file)
          .then((resizedFile) => {
            this.imageCliant.patchValue({
              fileSource4: resizedFile
            });
          })
          .catch((error) => {
            this.removeimg(4);
            Swal.fire(
              'error',
              'Image upload error: ' + error,
              'error'
            );
          });
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'The maximum resolution supported for images is 5000x5000 pixels.',
        'error'
      );
    }
  }

  async changeValue5(event) {

    if (event.target.files.length === 0) {
      return;
    }
// Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'Error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return;
    }
    // Check the image resolution
    let image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);

    // Create a promise to hold the async operation
    const checkImageResolution = new Promise<void>((resolve, reject) => {
      image.onload = () => {
        if (image.naturalWidth > 5000 || image.naturalHeight > 5000) {
          Swal.fire(
            'Error',
            'The maximum resolution supported for images is 5000x5000 pixels.',
            'error'
          );
          this.removeimg(5);
          reject('Invalid image resolution'); // Reject the promise to stop further actions
        } else {
          resolve(); // Resolve the promise to continue with further actions
        }
      };
    });

    try {
      // Wait for the image resolution check to complete
      await checkImageResolution;

      // Continue with further actions here because the image is valid
      this.showImageCropper = true;
      this.mainImageAdded = true;
      this.imgUploaded5 = true;

      // Display the image
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (_event) => {
        (document.getElementById('imageFiveE') as HTMLInputElement).src = reader.result.toString();
      };

      // Upload and handle the image
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.resizeImage(file)
          .then((resizedFile) => {
            this.imageCliant.patchValue({
              fileSource4: resizedFile
            });
          })
          .catch((error) => {
            this.removeimg(5);
            Swal.fire(
              'Error',
              'Image upload error: ' + error,
              'error'
            );
          });
      }
    } catch (error) {
      Swal.fire(
        'Error',
        'The maximum resolution supported for images is 5000x5000 pixels.',
        'error'
      );
    }
  }

  successAlert(data) {
    this.addProductClicked = false;
    if (data.message_status === 'Success') {
      Swal.fire(
        'New Product Added Successfully...!',
        'Your product will go live after Approved by Kapruka.This may take upto 6-12 Hrs',
        'success'
      );
      const partId = sessionStorage.getItem('partnerId');
      const url = 'products/digital/digital-product-list';
      this.router.navigate([url]);


      // this.clearAllFeilds();
      this.colorNameArray = [];
      this.colorCodeArray = [];
      this.sizeNameArray = [];
      this.colorArray = [];
      this.sizeArray = [];
      this.productGroupTabel = [];
      this.nonGroupArray = [];
      this.weightValue = '';
      // const url = '/products/digital/digital-product-list/';
      // this.router.navigate([url]);
    } else {
      Swal.fire(
        'Failed',
        data.message,
        'warning'
      );
    }

  }


  clearArrysAndVarilables() {
    this.categoryArray = [];
    this.isColor = false;
    this.isSize = false;
    this.isWeight = false;
    this.isStorage = false;
    this.isCapacity = false;
    this.colorsAndSize = false;
    this.colorArray = [];
    this.sizeArray = [];
    this.keyWordArray = [];
    this.keyWordArray2 = [];
    this.sizeAndColorArray = [];
    this.colorNameArray = [];
    this.colorCodeArray = [];
    this.sizeNameArray = [];
    this.colorAndSizeArray = [];
    this.variationValue = '';
    this.productVariationArr = [];
    this.weightValue = '';
    this.weightBool = false;
    this.storageValue = '';
    this.capacityValue = '';
    this.nonGroupArray = [];
    this.globleIndex = 0;
  }


  getSub_category(catCode, catName, index, catMargin) {
    this.margin = catMargin;
    // variation arrays clear
    // this.variationKeyArray = [];
    this.variationvalueSizeTypeObjArray = [];
    this.variationvalueArrayObject = [];
    this.variationvalueArrayForNonObject = [];
    this.variationvalueSizeTypeObjArray = [];


    this.categoryCode = catCode;

    if (catName.toUpperCase() == 'CLOATHING' || catName.toUpperCase() == 'CLOTHING' || catName.toUpperCase() == 'BAGS/FASHION/SHOES') {
      this.isClothing = true;
    } else {
      this.isClothing = false;
    }

    this.categoryNameForItemGroup = catName;
    this.categoryMargin = parseFloat(catMargin);
    this.categoryMarginMain = parseFloat(catMargin);
    (document.getElementById('initialMargin') as HTMLInputElement).value = this.categoryMarginMain.toFixed(2).toString();
    if (catMargin != null) {
      (document.getElementById('priceMargin') as HTMLInputElement).value = catMargin;
    }


    this.subSubCategoryArray = [];
    for (let i = 0; i < this.categoryArray.length; i++) {
      if (i === index) {
        document.getElementById(index.toString()).style.backgroundColor = '#c8fcf2';
        document.getElementById(index.toString()).style.color = '#000000';

      } else {
        document.getElementById(i.toString()).style.backgroundColor = '#fcfbfb';
        document.getElementById(i.toString()).style.color = '#464545';
      }


    }
    this.objectCategoryCode = catCode;
    const tex = catCode;
    const senDdata = {
      code: tex
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageAllSubCategory(data, catName, index),
    );
  }

  manageAllSubCategory(data, catName, i) {

    this.indexCat = i;
    this.SubCategoryArray = [];
    this.categoryPath = '';
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const cr = {
          name: data.data[i].name,
          code: data.data[i].code,
          path: data.data[i].path,
          pricemargin: data.data[i].rate
        };
        this.SubCategoryArray.push(cr);
      }
    }
    this.categoryPath = catName + '>';
  }

  getSub_sub_category(subSubSubCatCode, subCatName, index, catMargin) {
    this.subSubSubCategoryArray = [];
    const idString = 'sub' + index.toString();
    for (let i = 0; i < this.SubCategoryArray.length; i++) {
      if (i === index) {
        document.getElementById(idString).style.backgroundColor = '#c8fcf2';
        document.getElementById(idString).style.color = '#000000';

      } else {
        document.getElementById('sub' + i.toString()).style.backgroundColor = '#fcfbfb';
        document.getElementById('sub' + i.toString()).style.color = '#464545';
      }
      (document.getElementById('sellerPrice') as HTMLInputElement).value = '';
      (document.getElementById('price') as HTMLInputElement).value = '';
      if (catMargin !== 0) {
        this.categoryMargin = catMargin;
      } else {
        this.categoryMargin = this.categoryMarginMain;
      }
      (document.getElementById('initialMargin') as HTMLInputElement).value = this.categoryMargin.toFixed(2).toString();
      if (catMargin != null) {
        (document.getElementById('priceMargin') as HTMLInputElement).value = catMargin;
      }
    }

    this.objectCategoryCode = subSubSubCatCode;
    const senDdata = {
      code: subSubSubCatCode
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageAllSub_subCategory(data, subCatName, index),
    );
  }

  private manageAllSub_subCategory(data, subCatName, index) {
    this.subSubCategoryArray = [];
    this.indexSubCat = index;
    this.categoryPath = '';
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const cr = {
          name: data.data[i].name,
          code: data.data[i].code,
          path: data.data[i].path,
          pricemargin: data.data[i].rate
        };
        this.subSubCategoryArray.push(cr);
      }
    }
    this.categoryPath = this.categoryArray[this.indexCat].path + '>' + subCatName;
  }



  setSelectedType(SizeType) {
    this.sizeArrayForClothes = [];
    this.sizeString = SizeType;
    this.selectedType = SizeType;

  }

  loadMore() {
    if (this.showMoreMode) {
      this.visibleElementCount += this.loadMoreElements;

      // Ensure that visibleElementCount does not exceed the totalElementCount
      if (this.visibleElementCount > this.totalElementCount) {
        this.visibleElementCount = this.totalElementCount;
      }
    } else {
      this.visibleElementCount = 6;
    }
    this.showMoreMode = !this.showMoreMode;
  }


  AddToTable() {

    if (this.colorArrayForClothes.length === 0) {
      Swal.fire(
        'Oops',
        'Please Select a Color',
        'warning'
      );
      this.selectColorErrorStyle = 'border: 0.5px solid rgba(255, 0, 1, 0.3);';
      return;
    } else {
      this.selectColorErrorStyle = '';
    }

    const type = this.sizeString;
    const gender = '';
    const size = '';

    let tableData = {};
    this.matchCountOfSizeAndColorsArrays = true;

    if (this.isClothing) {
      for (let i = 0; i < this.colorArrayForClothes.length; i++) {
        if (this.sizeArrayForClothes.length === 0) {
          tableData = {
            type_: type,
            gender_: gender,
            size_: 'free-Size',
            sku_: `${this.sellerSku}-${this.getColorWord(this.colorArrayForClothes[i])}-${type}-free-Size`,
            color_: this.colorArrayForClothes[i]
          };
          this.clothesArray.push(tableData);
        }
        for (let j = 0; j < this.sizeArrayForClothes.length; j++) {

          tableData = {
            type_: type,
            gender_: gender,
            size_: this.sizeArrayForClothes[j],
            color_: this.colorArrayForClothes[i],
            sku_: `${this.sellerSku}-${this.getColorWord(this.colorArrayForClothes[i])}-${type}-${this.sizeArrayForClothes[j]}`
          };
          this.clothesArray.push(tableData);

        }
      }
    } else {
      for (let i = 0; i < this.colorArrayForClothes.length; i++) {
        tableData = {
          type_: type,
          gender_: gender,
          color_: this.colorArrayForClothes[i],
          sku_: `${this.sellerSku}-${this.getColorWord(this.colorArrayForClothes[i])}-${type}`,
        };
        this.clothesArray.push(tableData);
      }
    }

    this.colorArrayForClothes = [];
    this.sizeArrayForClothes = [];
    this.sizeString = '';
    this.selectedType = '';
  }

  deleteClothsRow(index) {
    this.clothesArray.splice(index, 1);
  }


  removeColorForClothes(i) {
    this.colorArrayForClothes.splice(i, 1);
  }

  removeSizeForClothes(i) {
    this.sizeArrayForClothes.splice(i, 1);
  }

  AddToSizeArray() {
    const newSize = this.isInternational
      ? (document.getElementById('clothesSizeInternational') as HTMLInputElement).value
      : (document.getElementById('clothesSizeUk') as HTMLInputElement).value;

    // Check if the size is not already in the array before adding it
    if (!this.sizeArrayForClothes.includes(newSize)) {
      this.sizeArrayForClothes.push(newSize);
    }
  }

  onChange($event) {
    const selectedVariation = $event.value;
    this.selectColorErrorStyle = '';

    // Check if the color already exists in the array
    if (!this.colorArrayForClothes.includes(selectedVariation)) {
      this.colorArrayForClothes.push(selectedVariation);
      this.colorArrayForClothesJob = this.colorArrayForClothes;
    } else {
      // Handle the case when the color already exists (e.g., show an error message)
    }
  }

  getsub_sub_sub_category(subSubSubCatCode, subsubCatName, index, catMargin) {
    const idString = 'subSub' + index.toString();
    for (let i = 0; i < this.subSubCategoryArray.length; i++) {
      if (i == index) {
        document.getElementById(idString).style.backgroundColor = '#c8fcf2';
        document.getElementById(idString).style.color = '#000000';
      } else {
        document.getElementById('subSub' + i.toString()).style.backgroundColor = '#fcfbfb';
        document.getElementById('subSub' + i.toString()).style.color = '#464545';
      }
      (document.getElementById('sellerPrice') as HTMLInputElement).value = '';
      (document.getElementById('price') as HTMLInputElement).value = '';
      if (catMargin !== 0) {
        this.categoryMargin = catMargin;
      } else {
        this.categoryMargin = this.categoryMarginMain;
      }
      (document.getElementById('initialMargin') as HTMLInputElement).value = this.categoryMargin.toFixed(2).toString();
      if (catMargin != null) {
        (document.getElementById('priceMargin') as HTMLInputElement).value = catMargin;
      }


    }
    this.objectCategoryCode = subSubSubCatCode;
    const senDdata = {
      code: subSubSubCatCode
    };
    this.categoryService.getAllCategory(senDdata).subscribe(
      data => this.manageAllSubSub_subCategory(data, subsubCatName, index),
    );
  }

  private manageAllSubSub_subCategory(data, subsubCatName, index) {
    this.subSubSubCategoryArray = [];
    this.indexSubSubCat = index;
    this.categoryPath = '';
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const cr = {
          name: data.data[i].name,
          code: data.data[i].code,
          path: data.data[i].path,
          pricemargin: data.data[i].rate
        };
        this.subSubSubCategoryArray.push(cr);
      }
    }
    this.categoryPath = this.categoryArray[this.indexCat].path + '>' + this.SubCategoryArray[this.indexSubCat].name + '>' + subsubCatName;

  }

  finalArrayCreater(subSubSubCatName, index, catMargin) {
    const duplicateSub3Array = this.subSubSubCategoryArray;
    const idString3 = 'subSubSub' + index.toString();
    for (let i = 0; i < duplicateSub3Array.length; i++) {
      if (i == index) {
        document.getElementById(idString3).style.backgroundColor = '#c8fcf2';
        document.getElementById(idString3).style.color = '#000000';

      } else {
        document.getElementById('subSubSub' + i.toString()).style.backgroundColor = '#fcfbfb';
        document.getElementById('subSubSub' + i.toString()).style.color = '#464545';
      }
      (document.getElementById('sellerPrice') as HTMLInputElement).value = '';
      (document.getElementById('price') as HTMLInputElement).value = '';
      if (catMargin !== 0) {
        this.categoryMargin = catMargin;
      } else {
        this.categoryMargin = this.categoryMarginMain;
      }
      (document.getElementById('initialMargin') as HTMLInputElement).value = this.categoryMargin.toFixed(2).toString();
      if (catMargin != null) {
        (document.getElementById('priceMargin') as HTMLInputElement).value = catMargin;
      }
    }

    this.categoryPath = this.categoryArray[this.indexCat].path + '>' + this.SubCategoryArray[this.indexSubCat].name + '>' + this.subSubCategoryArray[this.indexSubSubCat].name + '>' + subSubSubCatName;
  }

  getAttribytes(code) {
    this.attributesArray = [];
    for (const key in this.hashMap) {
      delete this.hashMap[key];
    }
    const payLoard = {
      category_code: code
    };
    this.productService.getAttributes(payLoard).subscribe(
      data => this.manageAttributes(data),
      error => this.manageError(error)
    );
  }

  private manageError(error) {
    this.isAvailableVariation = false;
  }

  isEmptyHash(value) {
    return value.length === 0;
  }

  private manageAttributes(data) {

    if (data.data.attribute_object != null) {
      this.attributesArray = Object.keys(data.data.attribute_object);
    }

    this.variationKeyArray = Object.keys(data.data.variation_object);

    this.variationvalueSizeTypeObjArray = [];
    this.variationvalueArrayObject = [];
    this.variationvalueArrayForNonObject = [];
    this.variationvalueSizeTypeObjArray = [];

    for (let i = 0; i < this.variationKeyArray.length; i++) {
      const key = this.variationKeyArray[i];

      const obj = data.data.variation_object[key];
      if (Array.isArray(obj)) {
        this.hashmapForVariations[key] = obj;
        this.variationvalueArrayForNonObject.push(key);

      } else {
        this.keyArrays = Object.keys(obj);
        for (let i = 0; i < this.keyArrays.length; i++) {
          this.hashmapForVariationsObj[this.keyArrays[i]] = obj[this.keyArrays[i]];
        }
        this.variationvalueSizeTypeObjArray.push(obj);
        this.variationvalueArrayObject.push(key);
      }
    }
    // Creating a hash map

// Converting object to hash map
    for (const key in data.data.attribute_object) {
      this.hashMap[key] = data.data.attribute_object[key];
    }


    if (this.variationKeyArray.length != 0) {
      this.isSelect = true;
      this.isAvailableVariation = true;
    } else {
      this.isAvailableVariation = false;
    }

    // attributes
    for (let i = 0; i < this.attributesArray.length; i++) {
      const key = this.attributesArray[i];

      const obj = data.data.variation_object[key];
      if (Array.isArray(obj)) {
        this.hashmapForVariations[key] = obj;
        this.variationvalueArrayForNonObject.push(key);

      } else {
        this.keyArrays = Object.keys(obj);
        for (let i = 0; i < this.keyArrays.length; i++) {
          this.hashmapForVariationsObj[this.keyArrays[i]] = obj[this.keyArrays[i]];
        }
        this.variationvalueSizeTypeObjArray.push(obj);
        this.variationvalueArrayObject.push(key);
      }
    }
    // Creating a hash map

// Converting object to hash map
    for (const key in data.data.attribute_object) {
      this.hashMap[key] = data.data.attribute_object[key];
    }


    if (this.variationKeyArray.length !== 0) {
      this.isSelect = true;
      this.isAvailableVariation = true;
    } else {
      this.isAvailableVariation = false;
    }

    this.attributeArr = this.attributesArray;
  }

  formatCurrency(event: any) {
    let value = event.target.value.replace(/[^\d]/g, '').replace(/^0+/, '');

    // Add commas for thousands separators
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');


    (document.getElementById('price') as HTMLInputElement).value = value;

    // Call your function to set the selling price
    // this.setSellingPrice();
  }

  setSellingPrice() {
    if ((document.getElementById('categoryPathInput') as HTMLInputElement).value === '') {
      Swal.fire(
        'Error',
        'category path should not be empty..!',
        'warning'
      );
      (document.getElementById('price') as HTMLInputElement).value = '';
      (document.getElementById('sellerPrice') as HTMLInputElement).value = '';
    } else {
      const listeningPrice = parseFloat(parseFloat((document.getElementById('price') as HTMLInputElement).value).toFixed(2));


      const sellingPrice = listeningPrice - (this.categoryMargin * listeningPrice / 100);

      (document.getElementById('sellerPrice') as HTMLInputElement).value = sellingPrice.toString();

    }
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

    // const textarea = document.getElementById('product_description') as HTMLTextAreaElement;
    // const textLength = textarea.value.length;
    const textLength = this.descriptionContent.length;

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

  updateValueSku() {
    const newSellerSku = (document.getElementById('Seller_SKU_2') as HTMLInputElement).value;

    this.clothesArray.forEach(data => {
      data.sku_ = data.sku_.replace(this.sellerSku, newSellerSku);
    });
    this.sellerSku = newSellerSku;
  }

  updateSku() {
    (document.getElementById('Seller_SKU_2') as HTMLInputElement).value = (document.getElementById('Seller_SKU') as HTMLInputElement).value;
    this.updateValueSku();
  }

  /************* Help ************/

  /* Product Images  */
  toggleHint() {
    this.showHint = !this.showHint;
  }

  /* Product Information  */
  toggleHintPI() {
    this.showHintPI = !this.showHintPI;
  }

  /* Product Description  */
  toggleHintPD() {
    this.showHintPD = !this.showHintPD;
  }

  toggleHintPA() {
    this.showHintPA = !this.showHintPA;
  }

  /* Product Variation  */
  toggleHintPV() {
    this.showHintPV = !this.showHintPV;
  }

  /* Product Variation  */
  toggleHintKey() {
    this.showHintKey = !this.showHintKey;
  }

  /* Product Key  */
  toggleHintBrand() {
    this.showHintBrand = !this.showHintBrand;
  }

  toggleHintsku() {
    this.showHintSku = !this.showHintSku;

  }

  toggleHintSCP() {
    this.showHintSCP = !this.showHintSCP;
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

  onColorChange($event) {
    // let selectedColorCode: string = this.variationColors[0].colorCode;
    // const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    // selectedColorCode = this.variationColors[selectedIndex].colorCode;
  }

  separateFromComma($event) {
    console.log($event.key);
    if ($event.key === ',') {
      this.addKeyWord();
      console.log('sep-working');
    } else {
      console.log('else return');
      return;
    }
  }

  addCopyPasteListeners() {
    const inputElement = this.txtKeyword.nativeElement;

    inputElement.addEventListener('paste', (event) => {
      event.preventDefault();
    });
  }

}

