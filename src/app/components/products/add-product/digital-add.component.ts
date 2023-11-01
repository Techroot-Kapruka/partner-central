import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
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
  margin: any;
  variationColors = [];
  variationOptions = [];

  visibleElementCount = 6;
  totalElementCount: number;
  loadMoreElements = 30;
  imgUploaded1:boolean=false;
  imgUploaded2:boolean=false;
  imgUploaded3:boolean=false;
  imgUploaded4:boolean=false;
  imgUploaded5:boolean=false;


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

      }else {
        if (parseFloat(inputElement.value) > 100.00 || inputElement.value === '') {
          inputElement.value = this.categoryMargin.toFixed(2).toString();
          Swal.fire(
            'Please Enter Valid Margin',
            '',
            'warning'
          );
        }else{
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
              availability: 'yes'
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
            data => this.manageProductResult(data),
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


  /*
  calculte price using Amount
   */

  calculatePriceForAmount() {
    const price = (document.getElementById('txt_price') as HTMLInputElement).value;
    (document.getElementById('txt_price_rate') as HTMLInputElement).style.borderColor = '#ced4da';
    if (price != '') {
      (document.getElementById('txt_price') as HTMLInputElement).style.borderColor = '#ced4da';
      let priceString = '';
      const amount = (document.getElementById('txt_amount') as HTMLInputElement).value;
      const newPrice = Number(price);
      const newamount = Number(amount);
      const newSellingPrice = newPrice + newamount;
      const firstAmount = Number((document.getElementById('txt_hidden_amount') as HTMLInputElement).value);
      if (firstAmount <= newSellingPrice) {
        (document.getElementById('txt_amount') as HTMLInputElement).style.borderColor = '#e9ecef';
        document.getElementById('condition2').style.display = 'none';
      } else {
        document.getElementById('condition2').style.display = 'block';
        (document.getElementById('txt_amount') as HTMLInputElement).style.borderColor = 'red';
      }

      if (amount === '') {
        (document.getElementById('txt_price_rate') as HTMLInputElement).disabled = false;

      } else {
        (document.getElementById('txt_price_rate') as HTMLInputElement).disabled = true;

      }
      priceString = '' + newSellingPrice;
      (document.getElementById('txt_selling_price') as HTMLInputElement).value = priceString;
    } else {
      Swal.fire(
        'Whoops...!',
        'Price cant be empty....',
        'error'
      );
      (document.getElementById('txt_price') as HTMLInputElement).style.borderColor = 'red';
      (document.getElementById('txt_price_rate') as HTMLInputElement).disabled = true;
    }

  }

  calculateRateForProduct() {
    let priceString = '';
    const rate = Number((document.getElementById('txt_price_rate') as HTMLInputElement).value);
    const price = Number((document.getElementById('txt_price') as HTMLInputElement).value);
    const rateAmount = price * rate / 100;
    const newSellingPrice = price + rateAmount;

    priceString = '' + newSellingPrice;
    (document.getElementById('txt_selling_price') as HTMLInputElement).value = priceString;
    (document.getElementById('txt_hidden_amount') as HTMLInputElement).value = priceString;
    this.amountBefor = priceString;
  }

  calculatePriceForAmount2() {

    let priceString = '';
    const price = this.productGroupCon.value.proGCostPrice;
    const amount = this.productGroupCon.value.proGAmount;
    const newPrice = Number(price);
    const newamount = Number(amount);
    const newSellingPrice = newPrice + newamount;

    if (amount === '') {
      (document.getElementById('proGRate') as HTMLInputElement).disabled = false;

    } else {
      (document.getElementById('proGRate') as HTMLInputElement).disabled = true;

    }
    priceString = '' + newSellingPrice;
    // (document.getElementById('proGSellingPrice') as HTMLInputElement).value = priceString;
    this.productGroupCon = new FormGroup({
      proGAmount: new FormControl(amount),
      proGRate: new FormControl(''),
      proGCostPrice: new FormControl(price),
      qty: new FormControl('0'),
      proGSellingPrice: new FormControl(priceString),
    });
  }

  /*
  calculte price using rate
   */


  calculatePriceForPriceRate() {
    const price = (document.getElementById('txt_price') as HTMLInputElement).value;
    (document.getElementById('txt_amount') as HTMLInputElement).style.borderColor = '#ced4da';
    if (price != '') {

      (document.getElementById('txt_price') as HTMLInputElement).style.borderColor = '#ced4da';
      let priceString = '';
      const priceRate = (document.getElementById('txt_price_rate') as HTMLInputElement).value;

      const price = (document.getElementById('txt_price') as HTMLInputElement).value;
      const newPrice = Number(price);
      const priceRateNew = Number(priceRate);

      const newSellingPrice = newPrice * priceRateNew / 100;
      const sellPricee = newSellingPrice + newPrice;

      const firstAmount = Number((document.getElementById('txt_hidden_amount') as HTMLInputElement).value);
      if (firstAmount <= sellPricee) {
        (document.getElementById('txt_price_rate') as HTMLInputElement).style.borderColor = '#e9ecef';
        document.getElementById('condition2').style.display = 'none';
      } else {
        document.getElementById('condition2').style.display = 'block';
        (document.getElementById('txt_price_rate') as HTMLInputElement).style.borderColor = 'red';
      }


      if (priceRate === '') {
        (document.getElementById('txt_amount') as HTMLInputElement).disabled = false;
      } else {
        (document.getElementById('txt_amount') as HTMLInputElement).disabled = true;
      }
      priceString = '' + sellPricee;
      (document.getElementById('txt_selling_price') as HTMLInputElement).value = priceString;
    } else {
      Swal.fire(
        'Whoops...!',
        'Price cant be empty....',
        'error'
      );
      (document.getElementById('txt_price') as HTMLInputElement).style.borderColor = 'red';
      (document.getElementById('txt_amount') as HTMLInputElement).disabled = true;
    }


  }

  calculatePriceForPriceRate2() {
    let priceString = '';
    const priceRate = this.productGroupCon.value.proGRate;

    const price = this.productGroupCon.value.proGCostPrice;
    const newPrice = Number(price);
    const priceRateNew = Number(priceRate);

    const newSellingPrice = newPrice * priceRateNew / 100;
    const sellPricee = newSellingPrice + newPrice;

    if (priceRate === '') {
      (document.getElementById('proGAmount') as HTMLInputElement).disabled = false;
    } else {
      (document.getElementById('proGAmount') as HTMLInputElement).disabled = true;
    }
    priceString = '' + sellPricee;
    // (document.getElementById('proGSellingPrice') as HTMLInputElement).value = priceString;
    this.productGroupCon = new FormGroup({
      proGAmount: new FormControl(''),
      proGRate: new FormControl(priceRate),
      proGCostPrice: new FormControl(price),
      qty: new FormControl(0),
      proGSellingPrice: new FormControl(priceString),
    });
  }

  manageProductResult(datas) {
    this.oneTimeClicked = true;
    if (datas.status_code === 200) {
      let one = this.imageCliant.get('fileSource').value;
      let one2 = this.imageCliant.get('fileSource2').value;
      let one3 = this.imageCliant.get('fileSource3').value;
      let one4 = this.imageCliant.get('fileSource4').value;
      let one5 = this.imageCliant.get('fileSource5').value;
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

      this.productService.insertProductImage(one, one2, one3, one4, one5, datas.data.product_code).subscribe(
        data => this.successAlert(data),
        error => this.mnageErrorProduct(error)
      );
    }
  }

  mnageErrorProduct(error) {
    this.addProductClicked = false;
    Swal.fire(
      'Oops...',
      error.message,
      'error'
    );
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

  resizeImage(src: string, callback: (resizedImage: string) => void) {
    const image = new Image();
    image.src = src;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const targetWidth = 400;
      const targetHeight = 400;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Fill the canvas with a white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const width = image.width;
      const height = image.height;
      const aspectRatio = width / height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (aspectRatio > 1) {
        // Landscape orientation (wider than tall)
        drawWidth = canvas.width;
        drawHeight = canvas.width / aspectRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        // Portrait orientation (taller than wide)
        drawWidth = canvas.height * aspectRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      try {
        // Draw the image on the canvas
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        const resizedImage = canvas.toDataURL('image/jpeg');
        callback(resizedImage);
      } catch (error) {
        console.log(error);
        Swal.fire('error', 'Error while resizing the image.', 'error');
        callback(null);
      }
    };
  }

  changeValue(event: any, i) {

    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return;
    }


    this.mainImageAdded = true;
    this.imgUploaded1 = true;
    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      const originalImageSrc = reader.result.toString();

      // Resize the image to 400x400
      this.resizeImage(originalImageSrc, (resizedImage) => {
        // Set the resized image as the source of 'imageOneO' and 'mainImage'
        (document.getElementById('imageOneO') as HTMLImageElement).src = resizedImage;
        // (document.getElementById('mainImage') as HTMLImageElement).src = resizedImage;
      });
    };

    // ========================================================
    if (event.target.files.length > 0) {

      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource: file
      });
    }
  }

  removeimg(x: number){
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
          imageOne2:'',
        });
        (document.getElementById('imageTwoO') as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
        break;
      case 3:
        this.imgUploaded3 = false;
        this.imageCliant.patchValue({
          fileSource3: '',
          imageOne3:'',
        });
        (document.getElementById('imageTreeE') as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
        break;
      case 4:
        this.imgUploaded4 = false;
        this.imageCliant.patchValue({
          fileSource4: '',
          imageOne4:'',
        });
        (document.getElementById('imageFourR') as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
        break;
      case 5:
        this.imgUploaded5 = false;
        this.imageCliant.patchValue({
          fileSource5: '',
          imageOne5:'',
        });
        (document.getElementById('imageFiveE') as HTMLImageElement).src = 'assets/images/dashboard/icons8-plus.gif';
        break;
    }
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


  changeValue2(event) {
    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return;
    }
    // Image upload
    this.imgUploaded2 = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      const originalImageSrc = reader.result.toString();

      // Resize the image to 400x400
      this.resizeImage(originalImageSrc, (resizedImage) => {
        // Set the resized image as the source of 'imageOneO' and 'mainImage'
        (document.getElementById('imageTwoO') as HTMLImageElement).src = resizedImage;
        // (document.getElementById('mainImage') as HTMLImageElement).src = resizedImage;
      });
    };


    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource2: file
      });
    }
  }

  changeValue3(event) {

    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    // Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return;
    }
    // Image upload
    this.imgUploaded3 = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      const originalImageSrc = reader.result.toString();

      // Resize the image to 400x400
      this.resizeImage(originalImageSrc, (resizedImage) => {
        // Set the resized image as the source of 'imageOneO' and 'mainImage'
        (document.getElementById('imageTreeE') as HTMLImageElement).src = resizedImage;
        // (document.getElementById('mainImage') as HTMLImageElement).src = resizedImage;
      });
    };

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource3: file
      });
    }
  }

  changeValue4(event) {

    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return;
    }
    // Image upload
    this.imgUploaded4 = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      const originalImageSrc = reader.result.toString();

      // Resize the image to 400x400
      this.resizeImage(originalImageSrc, (resizedImage) => {
        // Set the resized image as the source of 'imageOneO' and 'mainImage'
        (document.getElementById('imageFourR') as HTMLImageElement).src = resizedImage;
        // (document.getElementById('mainImage') as HTMLImageElement).src = resizedImage;
      });

    };

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource4: file
      });
    }
  }

  changeValue5(event) {

    if (event.target.files.length === 0) {
      return;
    }
// Image upload validation
    const mimeType = event.target.files[0].type;

    if (!mimeType.match(/^image\/jpeg$/i)) {
      Swal.fire(
        'error',
        'Please select a JPEG (jpg) image.',
        'warning'
      );
      return;
    }
    // Image upload
    this.imgUploaded5 = true;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      const originalImageSrc = reader.result.toString();

      // Resize the image to 400x400
      this.resizeImage(originalImageSrc, (resizedImage) => {
        // Set the resized image as the source of 'imageOneO' and 'mainImage'
        (document.getElementById('imageFiveE') as HTMLImageElement).src = resizedImage;
        // (document.getElementById('mainImage') as HTMLImageElement).src = resizedImage;
      });

    };

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource5: file
      });
    }
  }

  successAlert(data) {
    if (data.message_status === 'Success'){
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
        "Failed",
        data.message,
        'warning'
      )
    }

  }

  clearAllFeilds() {
    this.checkBoxCon = new FormGroup({
      productGroup: new FormControl(false),
    });
    (document.getElementById('category_code') as HTMLInputElement).value = '';
    (document.getElementById('themeVar') as HTMLInputElement).value = '';
    (document.getElementById('txt_title') as HTMLInputElement).value = '';
    (document.getElementById('txt_brand') as HTMLInputElement).value = '';
    (document.getElementById('txt_manufacture') as HTMLInputElement).value = '';
    (document.getElementById('txt_description') as HTMLInputElement).value = '';
    (document.getElementById('special_notes') as HTMLInputElement).value = '';
    (document.getElementById('availability') as HTMLInputElement).value = '';
    (document.getElementById('txt_seller_sku') as HTMLInputElement).value = '';
    (document.getElementById('txt_price') as HTMLInputElement).value = '';
    (document.getElementById('txt_quantity') as HTMLInputElement).value = '';
    (document.getElementById('condition') as HTMLInputElement).value = '';
    (document.getElementById('txt_amount') as HTMLInputElement).value = '';
    (document.getElementById('txt_price_rate') as HTMLInputElement).value = '';
    (document.getElementById('category_code') as HTMLInputElement).value = '';
    (document.getElementById('breadcrum') as HTMLInputElement).innerHTML = '';
    this.categoryArray = [];
    this.isColor = false;
    this.isSize = false;
    this.colorsAndSize = false;
    this.colorArray = [];
    this.sizeArray = [];
    this.keyWordArray = [];
    this.keyWordArray2 = [];
    this.isDisplay = 'none';
    this.sizeAndColorArray = [];
    this.colorNameArray = [];
    this.colorCodeArray = [];
    this.sizeNameArray = [];
    this.colorAndSizeArray = [];
    this.imageArr = [];
    this.nonGroupArray = [];
    this.productGroupTabel = [];
    const urlImg = 'assets/images/user.png';
    (document.getElementById('mainImage') as HTMLInputElement).src = 'assets/images/1.jpg';
    // (document.getElementById('imageOneO') as HTMLInputElement).src = urlImg;
    (document.getElementById('imageTwoO') as HTMLInputElement).src = urlImg;
    (document.getElementById('imageTreeE') as HTMLInputElement).src = urlImg;
    (document.getElementById('imageFourR') as HTMLInputElement).src = urlImg;
    (document.getElementById('imageFiveE') as HTMLInputElement).src = urlImg;
    // document.getElementById('groupPrice').style.display = 'none';

  }

  addingProductGroups() {
    if (this.checkBoxCon.value.productGroup == true) {
      document.getElementById('groupPrice').style.display = 'none';
      document.getElementById('CostPriceGroup').style.display = 'block';
      document.getElementById('treePriceCol').style.display = 'none';
      document.getElementById('amountGroup').style.display = 'block';
      document.getElementById('rateGroup').style.display = 'block';
      document.getElementById('sellingPrice').style.display = 'block';
      document.getElementById('TSbaleTT').style.display = 'block';
      document.getElementById('TbaleTT2').style.display = 'none';

      document.getElementById('btnTwo').style.display = 'block';
      document.getElementById('btnOne').style.display = 'none';
      document.getElementById('btnEditTwo').style.display = 'none';
    } else {
      document.getElementById('groupPrice').style.display = 'block';
      document.getElementById('treePriceCol').style.display = 'block';
      document.getElementById('CostPriceGroup').style.display = 'none';
      document.getElementById('amountGroup').style.display = 'none';
      document.getElementById('rateGroup').style.display = 'none';
      document.getElementById('sellingPrice').style.display = 'none';
      document.getElementById('TbaleTT').style.display = 'none';
      document.getElementById('TbaleTT2').style.display = 'block';
      document.getElementById('btnOne').style.display = 'block';
      document.getElementById('btnTwo').style.display = 'none';
      document.getElementById('btnEditTwo').style.display = 'none';
    }
  }

  addToTbaleProductGroup() {

    const theme = (document.getElementById('themeVar') as HTMLInputElement).value;
    const quantity = (document.getElementById('txt_quantity') as HTMLInputElement).value;

    if (quantity == '') {
      Swal.fire(
        'Oops...',
        'First you enterd quantity....',
        'error'
      );
      document.getElementById('txt_quantity').style.borderColor = 'red';
    } else {
      let rate: string = this.productGroupCon.value.proGRate;
      if (rate == '') {
        rate = '0.0';
      }
      let amount: string = this.productGroupCon.value.proGAmount;

      if (amount == '') {
        amount = '0.0';
      }

      const payData = {
        theme,
        value: this.variationValue,
        cost: this.productGroupCon.value.proGCostPrice,
        amount,
        rate,
        qty: this.productGroupCon.value.qty,
        selling: this.productGroupCon.value.proGSellingPrice
      };

      this.productGroupTabel.push(payData);
      this.productGroupCon = new FormGroup({
        proGAmount: new FormControl(''),
        proGRate: new FormControl(''),
        proGCostPrice: new FormControl(''),
        qty: new FormControl(0),
        proGSellingPrice: new FormControl(''),
      });

      (document.getElementById('proGRate') as HTMLInputElement).disabled = false;
      (document.getElementById('txt_amount') as HTMLInputElement).disabled = false;
      this.sizeArray = [];
      this.colorArray = [];

      document.getElementById('txt_quantity').style.borderColor = 'green';

    }
  }

  addToTbaleProductNone() {
    const theme = (document.getElementById('themeVar') as HTMLInputElement).value;

    const payData = {
      theme,
      value: this.variationValue,
      qty: this.productGroupCon.value.qty
    };
    this.nonGroupArray.push(payData);

    this.productGroupCon = new FormGroup({
      proGAmount: new FormControl(''),
      proGRate: new FormControl(''),
      proGCostPrice: new FormControl(''),
      qty: new FormControl(0),
      proGSellingPrice: new FormControl(''),
    });


    this.colorNameArray = [];
    this.colorCodeArray = [];
    this.sizeNameArray = [];
    this.colorArray = [];
    this.sizeArray = [];
    this.weightValue = '';
  }

  addWeight() {
    const weigth = (document.getElementById('select_weight') as HTMLInputElement).value;
    this.weightValue = weigth;
    this.variationValue = weigth;
    this.weightBool = true;
  }

  removeWeight() {
    this.weightValue = '';
    this.weightBool = false;
  }

  addStorage() {
    const storage = (document.getElementById('txt_storage') as HTMLInputElement).value;
    this.storageValue = storage;
    this.variationValue = storage;
    this.weightBool = true;
  }

  removeStorage() {
    this.storageValue = '';
    this.weightBool = false;
  }

  addCapacity() {
    const capacity = (document.getElementById('txt_capacity') as HTMLInputElement).value;
    this.capacityValue = capacity;
    this.variationValue = capacity;
    this.weightBool = true;
  }

  removeCapacity() {
    this.capacityValue = '';
    this.weightBool = false;
  }

  editRow(index) {

    const row = this.nonGroupArray[index];
    if (row.theme == 'color') {

      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="color">Color Name</option><option value="none">None</option><option value="size">Size Name</option><option value="weight">Weight</option><option value="storage">Storage</option><option value="capacity">Capacity</option>';

      this.isColor = true;

      let value = '';
      const ccc = row.value;
      if (ccc === 'White') {
        value = '#ffffff';

      } else if (ccc === 'Red') {
        value = '#ff0000';

      } else if (ccc === 'Blue') {
        value = '#0000ff';

      } else if (ccc === 'Yellow') {

        value = '#ffff00';
      } else if (value === 'Green') {

        value = '#00ff00';
      } else if (ccc === 'Gray') {
        value = '#808080';
      } else if (ccc === 'Purple') {

        value = '#800080';
      } else if (ccc === 'Orange') {

        value = '#ffa500';
      } else if (ccc === 'Maroon') {

        value = '#800000';
      } else if (ccc === 'Black') {
        value = '#000000';

      } else {
        value = '#000000';
      }
      const ob = {
        colorV: value,
        colors: ccc
      };
      this.colorArray.push(ob);
      this.colorNameArray.push(ccc);
      this.colorCodeArray.push(value);
      this.variationValue = ccc;

    } else if (row.theme == 'size') {
      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option><option value="weight">Weight</option><option value="storage">Storage</option><option value="capacity">Capacity</option>';
      this.isSize = true;
      this.variationValue = '';
      let size = '';
      const name = row.value;
      if (name === 'XS') {
        size = '1';
      } else if (name === 'S') {
        size = '2';
      } else if (name === 'M') {
        size = '3';
      } else if (name === 'L') {
        size = '4';
      } else if (name === 'XL') {
        size = '5';
      } else if (name === 'XXL') {
        size = '6';
      }
      const sizeValue = {
        sizeS: name,
        sizeValue: size
      };
      this.sizeArray.push(sizeValue);
      this.sizeNameArray.push(name);
      this.variationValue = name;

    } else if (row.theme == 'weight') {
      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="weight">Weight</option><option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option><option value="storage">Storage</option><option value="capacity">Capacity</option>';

      const weigth = row.value;
      this.weightValue = weigth;
      this.variationValue = weigth;
      this.weightBool = true;

    } else if (row.theme == 'storage') {
      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="storage">Storage</option><option value="weight">Weight</option><option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option><option value="capacity">Capacity</option>';

      const storage = row.value;
      this.storageValue = storage;
      this.variationValue = storage;
      this.weightBool = true;

    } else if (row.theme == 'capacity') {
      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="capacity">Capacity</option><option value="storage">Storage</option><option value="weight">Weight</option><option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option>';
      const capacity = row.value;
      this.capacityValue = capacity;
      this.variationValue = capacity;
      this.weightBool = true;
    }


    this.productGroupCon = new FormGroup({
      proGAmount: new FormControl(''),
      proGRate: new FormControl(''),
      proGCostPrice: new FormControl(''),
      qty: new FormControl(row.qty),
      proGSellingPrice: new FormControl(''),
    });

    this.nonGroupArray.splice(index, 1);
  }

  deleteRow(index) {
    this.nonGroupArray.splice(index, 1);
  }

  editGroupRow(index) {
    this.globleIndex = index;
    document.getElementById('btnEditTwo').style.display = 'block';
    document.getElementById('btnTwo').style.display = 'none';
    document.getElementById('btnOne').style.display = 'none';

    this.productGroupCon = new FormGroup({
      proGAmount: new FormControl(this.productGroupTabel[index].amount),
      proGRate: new FormControl(this.productGroupTabel[index].rate),
      proGCostPrice: new FormControl(this.productGroupTabel[index].cost),
      qty: new FormControl(this.productGroupTabel[index].qty),
      proGSellingPrice: new FormControl(this.productGroupTabel[index].selling),
    });

    if (this.productGroupTabel[index].theme === 'color') {

      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="color">Color Name</option><option value="size">Size Name</option><option value="none">None</option><option value="weight">Weight</option><option value="storage">Storage</option><option value="capacity">Capacity</option>';

      this.isColor = true;

      let value = '';
      const ccc = this.productGroupTabel[index].value;
      if (ccc === 'White') {
        value = '#ffffff';

      } else if (ccc === 'Red') {
        value = '#ff0000';

      } else if (ccc === 'Blue') {
        value = '#0000ff';

      } else if (ccc === 'Yellow') {

        value = '#ffff00';
      } else if (value === 'Green') {

        value = '#00ff00';
      } else if (ccc === 'Gray') {
        value = '#808080';
      } else if (ccc === 'Purple') {

        value = '#800080';
      } else if (ccc === 'Orange') {

        value = '#ffa500';
      } else if (ccc === 'Maroon') {

        value = '#800000';
      } else if (ccc === 'Black') {
        value = '#000000';

      } else {
        value = '#000000';
      }
      const ob = {
        colorV: value,
        colors: ccc
      };
      this.colorArray.push(ob);
      this.colorNameArray.push(ccc);
      this.colorCodeArray.push(value);
      this.variationValue = ccc;


    } else if (this.productGroupTabel[index].theme === 'size') {

      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option><option value="weight">Weight</option><option value="storage">Storage</option><option value="capacity">Capacity</option>';
      this.isSize = true;
      this.variationValue = '';
      let size = '';
      const name = this.productGroupTabel[index].value;
      if (name === 'XS') {
        size = '1';
      } else if (name === 'S') {
        size = '2';
      } else if (name === 'M') {
        size = '3';
      } else if (name === 'L') {
        size = '4';
      } else if (name === 'XL') {
        size = '5';
      } else if (name === 'XXL') {
        size = '6';
      }
      const sizeValue = {
        sizeS: name,
        sizeValue: size
      };
      this.sizeArray.push(sizeValue);
      this.sizeNameArray.push(name);
      this.variationValue = name;


    } else if (this.productGroupTabel[index].theme === 'weight') {

      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="weight">Weight</option><option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option><option value="storage">Storage</option><option value="capacity">Capacity</option>';

      const weigth = this.productGroupTabel[index].value;
      this.weightValue = weigth;
      this.variationValue = weigth;
      this.weightBool = true;

    } else if (this.productGroupTabel[index].theme === 'storage') {
      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="storage">Storage</option><option value="weight">Weight</option><option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option><option value="capacity">Capacity</option>';

      const storage = this.productGroupTabel[index].value;
      this.storageValue = storage;
      this.variationValue = storage;
      this.weightBool = true;

    } else if (this.productGroupTabel[index].theme === 'capacity') {

      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="capacity">Capacity</option><option value="storage">Storage</option><option value="weight">Weight</option><option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option>';
      const capacity = this.productGroupTabel[index].value;
      this.capacityValue = capacity;
      this.variationValue = capacity;
      this.weightBool = true;

    } else {

    }
  }

  deleteGroupRow(index) {
    this.productGroupTabel.splice(index, 1);
  }

  editToTbaleProductGroup() {
    const theme = (document.getElementById('themeVar') as HTMLInputElement).value;
    this.productGroupTabel[this.globleIndex].cost = this.productGroupCon.value.proGCostPrice;
    this.productGroupTabel[this.globleIndex].amount = this.productGroupCon.value.proGAmount;
    this.productGroupTabel[this.globleIndex].qty = this.productGroupCon.value.qty;
    this.productGroupTabel[this.globleIndex].rate = this.productGroupCon.value.proGRate;
    this.productGroupTabel[this.globleIndex].selling = this.productGroupCon.value.proGSellingPrice;
    this.productGroupTabel[this.globleIndex].theme = theme;
    this.productGroupTabel[this.globleIndex].value = this.variationValue;


    let priceString = '';
    const price = this.productGroupCon.value.proGCostPrice;
    const amount = this.productGroupCon.value.proGAmount;
    const newPrice = Number(price);
    const newamount = Number(amount);
    const newSellingPrice = newPrice + newamount;

    if (amount === '') {
      (document.getElementById('proGRate') as HTMLInputElement).disabled = false;

    } else {
      (document.getElementById('proGRate') as HTMLInputElement).disabled = true;

    }
    priceString = '' + newSellingPrice;

    document.getElementById('btnEditTwo').style.display = 'none';
    document.getElementById('btnTwo').style.display = 'block';
    document.getElementById('btnOne').style.display = 'none';
    this.clearArrysAndVarilables();
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

  maintainStockChange() {
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

  //
  // onChangeCatSubs($event) {
  //   const payload = {
  //     keyword: $event.target.value
  //   };
  //   this.categoryService.searchByPath(payload).subscribe(
  //     data => this.manageMarginRate(data)
  //   );
  // }
  //
  // manageMarginRate(data){
  //   if (data.data)
  // }

  addCategoryBredCrums() {
    if (this.allCategoryBreadcrumbArr.length < 1) {
      const categoryIdValuesSpliter = ((document.getElementById('Category_') as HTMLInputElement).value).split('+');
      const categoryId = categoryIdValuesSpliter[0];
      const subCategoryId = (document.getElementById('sub_category_') as HTMLInputElement).value;
      const categorySubSubId = (document.getElementById('sub_sub_category_') as HTMLInputElement).value;
      let categoryName = '';
      let subCategoryName = '';
      let subSubCategoryName = '';

      let categoryNameBool = true;
      let subCategoryNameBool = true;
      let subSubCategoryNameBool = true;

      if (subCategoryId === '' && categorySubSubId === '') {
        this.categoryRequestArr.push(categoryId);

      } else if (categorySubSubId === '') {
        this.categoryRequestArr.push(subCategoryId);

      } else {
        this.categoryRequestArr.push(categorySubSubId);

      }

      for (let i = 0; i < this.categoryArray.length; i++) {
        if (categoryId === '') {
          categoryNameBool = false;
        }

        if (subCategoryId === '') {
          subCategoryNameBool = false;
        }

        if (categorySubSubId === '') {
          subSubCategoryNameBool = false;
        }

        if (this.categoryArray[i].code === categoryId) {
          categoryName = this.categoryArray[i].path;

          for (let x = 0; x < this.subSubCategoryArray.length; x++) {
            if (this.SubCategoryArray[x].code === subCategoryId) {
              subCategoryName = this.SubCategoryArray[x].name;

              for (let z = 0; z < this.subSubCategoryArray.length; z++) {
                if (this.subSubCategoryArray[z].code === categorySubSubId) {
                  subSubCategoryName = this.subSubCategoryArray[z].name;
                }
              }
            }
          }
        }
      }

      const arr = {
        categoryId,
        categoryName,
        subCategoryName,
        subSubCategoryName,
        categoryNameBool,
        subCategoryNameBool,
        subSubCategoryNameBool
      };

      this.allCategoryBreadcrumbArr.push(arr);
      document.getElementById('sub_cat_dev').style.display = 'block';
      document.getElementById('sub_sub_cat_dev').style.display = 'block';

      // this.getAllCategory();
    }
  }

  removeCategoryBreadcrum(index) {
    for (let i = 0; i < this.allCategoryBreadcrumbArr.length; i++) {
      if (this.allCategoryBreadcrumbArr[index] === this.allCategoryBreadcrumbArr[i]) {
        this.allCategoryBreadcrumbArr.splice(i, 1);
      }
    }
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
  }

  deleteClothsRow(index) {
    this.clothesArray.splice(index, 1);
  }

  setColorArray() {
    const newColor = (document.getElementById('colorInput1') as HTMLInputElement).value;

    // Check if the color already exists in the array
    if (!this.colorArrayForClothes.includes(newColor)) {
      this.colorArrayForClothes.push(newColor);
      this.colorArrayForClothesJob = this.colorArrayForClothes;
    } else {
      // Handle the case when the color already exists (e.g., show an error message)
    }
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

  formatCurrency(event:any){
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
        'error',
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

  /* Product Brand  */
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

