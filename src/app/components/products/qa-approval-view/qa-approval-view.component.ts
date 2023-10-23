import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from '../../../shared/service/product.service';
import Swal from 'sweetalert2';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../../environments/environment.prod';

@Component({
  selector: 'app-qa-approval-view',
  templateUrl: './qa-approval-view.component.html',
  styleUrls: ['./qa-approval-view.component.scss']
})
export class QaApprovalViewComponent implements OnInit {
  public imageCliant: FormGroup;
  public checkBoxCon: FormGroup;
  public productGroupCon: FormGroup;
  public maintainStock: FormGroup;
  @Input()
  public catParth = [];
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
  public isDisplay = 'block';
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
  public imageOne = '';
  public imageOne2 = '';
  public imageOne3 = '';
  public imageOne4 = '';
  public imageOne5 = '';
  public ids = '';
  public displayHasGorup = false;
  public imageData = [];
  public isDisabled = false;
  public imagePathURI = environment.imageURIENV;
  public title_name = 'Edit Product';
  public amountBefor = '';


  constructor(private router: Router, private _Activatedroute: ActivatedRoute, private modalService: NgbModal, private productService: ProductService) {
    this.ids = '';
    this._Activatedroute.paramMap.subscribe(params => {
      this.getProductByEdit(params.get('id'));
      this.ids = params.get('id');
    });

    this.imageControlMethord();

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

  public config1: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null
  };

  ngOnInit(): void {
  }

  public onUploadInit(args: any): void {
  }

  public onUploadError(args: any): void {
  }

  public onUploadSuccess(args: any): void {
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
    const searchText = (document.getElementById('mySearch') as HTMLInputElement).value;
    const payloard = {
      partner_u_id: sessionStorage.getItem('partnerId'),
      keyword: searchText
    };

    this.productService.getSearchCategory(payloard).subscribe(
      data => this.manageSerchingCategory(data),
    );
  }

  manageSerchingCategory(data) {
    this.catParth = [];
    for (let i = 0; i < data.data.pathList.length; i++) {
      const ar = {
        parth: data.data.pathList[i].path,
        code: data.data.pathList[i].code,
        pricemargin: data.data.pathList[i].price_margin
      };
      this.catParth.push(ar);
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

  calculateRateForProduct() {
    let priceString = '';
    const rate = Number((document.getElementById('txt_price_rate') as HTMLInputElement).value);
    const price = Number((document.getElementById('txt_price') as HTMLInputElement).value);
    const rateAmount = price * rate / 100;
    const newSellingPrice = price + rateAmount;

    priceString = '' + newSellingPrice;
    (document.getElementById('txt_selling_price') as HTMLInputElement).value = priceString;
    (document.getElementById('txt_hidden_amount') as HTMLInputElement).value = priceString;
    this.amountBefor = priceString
  }

  getColorValue() {
    this.variationValue = '';
    let length = 0;
    const value = (document.getElementById('colorInput') as HTMLInputElement).value;
    (document.getElementById('setColorInput') as HTMLInputElement).value = value;
    length = this.colorArray.length;
    if (length === 0) {
      length = 1;
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
    const ob = {
      colorV: value,
      colors: ccc
    };
    this.colorArray.push(ob);
    this.colorNameArray.push(ccc);
    this.colorCodeArray.push(value);
    this.variationValue = ccc;
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

  addKeyWord() {
    const keyword = (document.getElementById('txt_keyword') as HTMLInputElement).value;
    if (keyword == '') {
    } else {
      const array = {
        key: keyword
      };

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

  // updateProduct() {
  //
  //   const categoryCode = (document.getElementById('category_code') as HTMLInputElement).value;
  //   const themeVar = (document.getElementById('themeVar') as HTMLInputElement).value;
  //   const title = (document.getElementById('txt_title') as HTMLInputElement).value;
  //   const brand = (document.getElementById('txt_brand') as HTMLInputElement).value;
  //   const manufacture = (document.getElementById('txt_manufacture') as HTMLInputElement).value;
  //   const description = (document.getElementById('txt_description') as HTMLInputElement).value;
  //   const specialNotes = (document.getElementById('special_notes') as HTMLInputElement).value;
  //   const availability = (document.getElementById('availability') as HTMLInputElement).value;
  //   const SellerSku = (document.getElementById('txt_seller_sku') as HTMLInputElement).value;
  //   let txtSellingPrice = Number((document.getElementById('txt_selling_price') as HTMLInputElement).value);
  //   let price = Number((document.getElementById('txt_price') as HTMLInputElement).value);
  //   let quantity = Number((document.getElementById('txt_quantity') as HTMLInputElement).value);
  //   const condition = (document.getElementById('condition') as HTMLInputElement).value;
  //   let amount = Number((document.getElementById('txt_amount') as HTMLInputElement).value);
  //   let priceRate = Number((document.getElementById('txt_price_rate') as HTMLInputElement).value);
  //   const businessName = sessionStorage.getItem('businessName');
  //
  //   if (this.checkBoxCon.value.productGroup == true) {
  //     price = Number((document.getElementById('proGCostPrice') as HTMLInputElement).value);
  //     amount = Number((document.getElementById('proGAmount') as HTMLInputElement).value);
  //     priceRate = Number((document.getElementById('proGRate') as HTMLInputElement).value);
  //     txtSellingPrice = Number((document.getElementById('proGSellingPrice') as HTMLInputElement).value);
  //     quantity = Number((document.getElementById('qty') as HTMLInputElement).value);
  //   }
  //
  //   let maintainStockVal = 1;
  //   if (this.maintainStock.value.maintainStockController == true) {
  //     maintainStockVal = 1;
  //   } else {
  //     maintainStockVal = 0;
  //   }
  //
  //
  //   let keyArr = [];
  //   for (let i = 0; i < this.keyWordArray.length; i++) {
  //     if (this.keyWordArray[i].key === '') {
  //       this.keyWordArray.splice(i, 1);
  //       this.keyWordArray2.splice(i, 1);
  //     } else {
  //       keyArr.push(this.keyWordArray[i].key);
  //     }
  //   }
  //
  //   let payloard = {};
  //   let isGroup = 0;
  //   if (this.checkBoxCon.value.productGroup == true) {
  //     isGroup = 1;
  //     this.productVariationArr = [];
  //     for (let i = 0; i < this.productGroupTabel.length; i++) {
  //       let gty = this.productGroupTabel[i].qty;
  //
  //       let or = {
  //         id: this.productGroupTabel[i].id,
  //         variation_theme: this.productGroupTabel[i].theme,
  //         quantity: this.productGroupTabel[i].qty,
  //         variation: this.productGroupTabel[i].value,
  //         cost_price: this.productGroupTabel[i].cost,
  //         changing_amount: this.productGroupTabel[i].amount,
  //         changing_rate: this.productGroupTabel[i].rate,
  //         selling_price: this.productGroupTabel[i].selling
  //       };
  //       this.productVariationArr.push(or);
  //     }
  //   } else {
  //     isGroup = 0;
  //     this.productVariationArr = [];
  //     payloard = {};
  //     for (let i = 0; i < this.nonGroupArray.length; i++) {
  //       let or = {
  //         id: this.nonGroupArray[i].id,
  //         variation_theme: this.nonGroupArray[i].theme,
  //         variation: this.nonGroupArray[i].value,
  //         quantity: this.nonGroupArray[i].qty
  //       };
  //       this.productVariationArr.push(or);
  //     }
  //   }
  //
  //   payloard = {
  //     product_code: this.ids,
  //     category_code: categoryCode,
  //     title: title,
  //     brand: brand,
  //     manufacture: manufacture,
  //     vendor: businessName,
  //     is_active: 0,
  //     has_group: isGroup,
  //     maintain_stock: maintainStockVal,
  //     productDescription: {
  //       description: description,
  //       special_notes: specialNotes,
  //       availability: availability
  //
  //     },
  //     productOffer: {
  //       id: 0,
  //       seller_sku: SellerSku,
  //       quantity: quantity,
  //       condition: condition,
  //       price: price,
  //       amount: amount,
  //       seling_price: txtSellingPrice,
  //       price_rate: priceRate
  //     },
  //     productVariation: this.productVariationArr,
  //     productKeyword: {
  //       keywords: keyArr
  //     }
  //   };
  //
  //
  //   this.productService.UpdatetProduct(payloard).subscribe(
  //     data => this.manageProductResult(data),
  //     error => this.mnageErrorProduct(error)
  //   );
  // }

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
      qty: new FormControl(),
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
      qty: new FormControl(),
      proGSellingPrice: new FormControl(priceString),
    });
  }

  manageProductResult(datas) {
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

      this.productService.updatetProductImage(one, one2, one3, one4, one5, datas.data.product_code).subscribe(
        data => this.successAlert(data),
        error => this.mnageErrorProduct(error)
      );
    }
  }

  mnageErrorProduct(error) {
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
      qty: new FormControl(''),
      proGSellingPrice: new FormControl(''),
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
      (document.getElementById('mainImage') as HTMLInputElement).src = reader.result.toString();
    };

    // ========================================================

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource: file
      });
    }
  }

  changeValue2(event) {

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
      (document.getElementById('imageTwoO') as HTMLInputElement).src = reader.result.toString();
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
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      (document.getElementById('imageTreeE') as HTMLInputElement).src = reader.result.toString();
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
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      (document.getElementById('imageFourR') as HTMLInputElement).src = reader.result.toString();
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
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      (document.getElementById('imageFiveE') as HTMLInputElement).src = reader.result.toString();
    };

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageCliant.patchValue({
        fileSource5: file
      });
    }
  }

  successAlert(data) {
    Swal.fire(
      'Good job!',
      'product Update successful..!',
      'success'
    );
    this.clearAllFeilds();
    let url = '/products/digital/digital-product-list/';
    this.router.navigate([url]);
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
    this.catParth = [];
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
      document.getElementById('TbaleTT').style.display = 'block';
      document.getElementById('TbaleTT2').style.display = 'none';

      document.getElementById('btnTwo').style.display = 'block';
      document.getElementById('btnOne').style.display = 'none';
      // document.getElementById('formProductGroup').style.display = 'block';
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
    }
  }

  addToTbaleProductGroup() {

    let theme = (document.getElementById('themeVar') as HTMLInputElement).value;
    let quantity = (document.getElementById('txt_quantity') as HTMLInputElement).value;

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

      let payData = {
        theme: theme,
        value: this.variationValue,
        cost: this.productGroupCon.value.proGCostPrice,
        amount: amount,
        rate: rate,
        qty: this.productGroupCon.value.qty,
        selling: this.productGroupCon.value.proGSellingPrice
      };

      this.productGroupTabel.push(payData);
      this.productGroupCon = new FormGroup({
        proGAmount: new FormControl(''),
        proGRate: new FormControl(''),
        proGCostPrice: new FormControl(''),
        qty: new FormControl(''),
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
    let theme = (document.getElementById('themeVar') as HTMLInputElement).value;
    let payData = {
      theme: theme,
      value: this.variationValue,
      qty: this.productGroupCon.value.qty
    };
    this.nonGroupArray.push(payData);
  }

  addWeight() {
    let weigth = (document.getElementById('select_weight') as HTMLInputElement).value;
    this.weightValue = weigth;
    this.variationValue = weigth;
    this.weightBool = true;
  }

  removeWeight() {
    this.weightValue = '';
    this.weightBool = false;
  }

  addStorage() {
    let storage = (document.getElementById('txt_storage') as HTMLInputElement).value;
    this.storageValue = storage;
    this.variationValue = storage;
    this.weightBool = true;
  }

  removeStorage() {
    this.storageValue = '';
    this.weightBool = false;
  }

  addCapacity() {
    let capacity = (document.getElementById('txt_capacity') as HTMLInputElement).value;
    this.capacityValue = capacity;
    this.variationValue = capacity;
    this.weightBool = true;
  }

  removeCapacity() {
    this.capacityValue = '';
    this.weightBool = false;
  }

// ===============================================================start edit methods====================================

  getProductByEdit(id) {
    let payloard = {
      product_code: id
    };
    this.productService.getSelecedProductByEdit(payloard).subscribe(
      data => this.managetSelecedProductByEdit(data, id),
    );
  }

  managetSelecedProductByEdit(data, proCodeImg) {

    (document.getElementById('breadcrum') as HTMLInputElement).innerHTML = data.data.category_path;
    (document.getElementById('category_code') as HTMLInputElement).value = data.data.product.category_code;
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
          qty: data.data.product.productVariation[i].quantity
        };
        this.nonGroupArray.push(payData);
      }


    } else {
      this.checkBoxCon = new FormGroup({
        productGroup: new FormControl(true),
      });
      this.addingProductGroups();

      for (let i = 0; i < data.data.product.productVariation.length; i++) {

        let payData = {
          id: data.data.product.productVariation[i].id,
          theme: data.data.product.productVariation[i].variation_theme,
          value: data.data.product.productVariation[i].variation,
          cost: data.data.product.productVariation[i].cost_price,
          amount: data.data.product.productVariation[i].changing_amount,
          rate: data.data.product.productVariation[i].changing_rate,
          qty: data.data.product.productVariation[i].quantity,
          selling: data.data.product.productVariation[i].selling_price
        };
        this.productGroupTabel.push(payData);
      }

    }


    for (let i = 0; i < data.data.product.productKeyword.keywords.length; i++) {
      const array = {
        key: data.data.product.productKeyword.keywords[i]
      };

      this.keyWordArray.push(array);
      this.keyWordArray2.push(data.data.product.productKeyword.keywords[i]);
    }

    (document.getElementById('txt_title') as HTMLInputElement).value = data.data.product.title;
    (document.getElementById('txt_brand') as HTMLInputElement).value = data.data.product.brand;
    (document.getElementById('txt_manufacture') as HTMLInputElement).value = data.data.product.manufacture;
    (document.getElementById('txt_seller_sku') as HTMLInputElement).value = data.data.product.productOffer.seller_sku;
    (document.getElementById('txt_quantity') as HTMLInputElement).value = data.data.product.productOffer.quantity;

    if (data.data.product.productOffer.condition == 'Brand New') {
      (document.getElementById('condition') as HTMLInputElement).innerHTML = '<option value="Brand New">Brand New</option> <option value="Used - Good">Used - Good</option><option value="Used - Like New">Used - Like New</option><option value="">--Select--</option>';
    } else if (data.data.product.productOffer.condition == 'Used - Good') {
      (document.getElementById('condition') as HTMLInputElement).innerHTML = '<option value="Used - Good">Used - Good</option><option value="Brand New">Brand New</option><option value="Used - Like New">Used - Like New</option><option value="">--Select--</option>';
    } else if (data.data.product.productOffer.condition == 'Used - Like New') {
      (document.getElementById('condition') as HTMLInputElement).innerHTML = '<option value="Used - Like New">Used - Like New</option><option value="Used - Good">Used - Good</option><option value="Brand New">Brand New</option><option value="">--Select--</option>';
    }

    (document.getElementById('txt_description') as HTMLInputElement).value = data.data.product.productDescription.description;
    (document.getElementById('special_notes') as HTMLInputElement).value = data.data.product.productDescription.special_notes;

    if (data.data.product.productDescription.availability === 'Yes') {
      (document.getElementById('availability') as HTMLInputElement).innerHTML = '<option value="yes">Yes</option><option value="no">No</option><option value="">--Select--</option>';
    } else {
      (document.getElementById('availability') as HTMLInputElement).innerHTML = '<option value="no">No</option><option value="yes">Yes</option><option value="">--Select--</option>';
    }
    let p_string = '';
    let price_val = data.data.product.productOffer.price + (data.data.product.productOffer.price * data.data.price_margin) / 100;
    p_string = '' + price_val;
    this.amountBefor = p_string;


    (document.getElementById('txt_hidden_amount') as HTMLInputElement).value = p_string;
    (document.getElementById('txt_price') as HTMLInputElement).value = data.data.product.productOffer.price;
    (document.getElementById('txt_amount') as HTMLInputElement).value = data.data.product.productOffer.amount;
    (document.getElementById('txt_price_rate') as HTMLInputElement).value = data.data.product.productOffer.price_rate;
    (document.getElementById('txt_selling_price') as HTMLInputElement).value = data.data.product.productOffer.seling_price;

    if (data.data.product.productOffer.price_rate == 0) {
      (document.getElementById('txt_price_rate') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_amount') as HTMLInputElement).disabled = false;
    } else {
      (document.getElementById('txt_price_rate') as HTMLInputElement).disabled = false;
      (document.getElementById('txt_amount') as HTMLInputElement).disabled = true;
    }

    let payloard = {
      product_code: proCodeImg
    };
    this.productService.getImageForEdit(payloard).subscribe(
      data => this.manageImageForEdit(data),
    );
    this.disableElement(data);
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

    if (data['data'][1] != null) {
      var imageURI02 = data['data'][1];
      imageURI02Output = imageURI02.split('/product');
    }
    if (data['data'][2] != null) {
      var imageURI03 = data['data'][2];
      imageURI03Output = imageURI03.split('/product');
    }

    if (data['data'][3] != null) {
      var imageURI04 = data['data'][3];
      imageURI04Output = imageURI04.split('/product');
    }

    if (data['data'][4] != null) {
      var imageURI05 = data['data'][4];
      imageURI05Output = imageURI05.split('/product');
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

  editRow(row) {
    this.colorArray = [];
    this.colorNameArray = [];
    this.colorCodeArray = [];
    this.variationValue = '';
    (document.getElementById('qty') as HTMLInputElement).value = row.qty;

    if (row.theme == 'color') {

      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="color">Color Name</option><option value="none">None</option><option value="size">Size Name</option><option value="weight">Weight</option><option value="storage">Storage</option><option value="capacity">Capacity</option>';

      this.isColor = true;

      let value = '';
      let ccc = row.value;
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
      let name = row.value;
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

      let weigth = row.value;
      this.weightValue = weigth;
      this.variationValue = weigth;
      this.weightBool = true;

    } else if (row.theme == 'storage') {
      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="storage">Storage</option><option value="weight">Weight</option><option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option><option value="capacity">Capacity</option>';

      let storage = row.value;
      this.storageValue = storage;
      this.variationValue = storage;
      this.weightBool = true;

    } else if (row.theme == 'capacity') {
      (document.getElementById('themeVar') as HTMLInputElement).innerHTML = '<option value="capacity">Capacity</option><option value="storage">Storage</option><option value="weight">Weight</option><option value="size">Size Name</option><option value="color">Color Name</option><option value="none">None</option>';
      let capacity = row.value;
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
  }

  editGroupRow(row) {
    this.colorArray = [];
    this.colorNameArray = [];
    this.colorCodeArray = [];
    this.variationValue = '';

    if (row.theme == 'color') {
      this.isColor = true;

      let value = '';
      let ccc = row.value;
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

    } else if (row.theme == 'weight') {

    } else if (row.theme == 'storage') {

    } else if (row.theme == 'capacity') {
    }
  }

  deleteRow(row) {
    for (let i = 0; i < this.nonGroupArray.length; i++) {
      if (this.nonGroupArray[i].id == row.id) {
        this.nonGroupArray.splice(i, 1);
      }
    }
  }


  maintainStockChange() {
  }


  disableElement(data) {
    if (data.data.product.is_active == 1) {
      (document.getElementById('txt_title') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_brand') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_manufacture') as HTMLInputElement).disabled = true;
      (document.getElementById('flexCheckChecked') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_seller_sku') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_price') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_quantity') as HTMLInputElement).disabled = true;
      (document.getElementById('condition') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_amount') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_price_rate') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_selling_price') as HTMLInputElement).disabled = true;
      (document.getElementById('txt_description') as HTMLInputElement).disabled = true;
      (document.getElementById('special_notes') as HTMLInputElement).disabled = true;
      (document.getElementById('availability') as HTMLInputElement).disabled = true;
      (document.getElementById('g01-01') as HTMLInputElement).disabled = true;

      document.getElementById('variationTheme').style.display = 'none';
      document.getElementById('quantity2').style.display = 'none';
      document.getElementById('buttonGroup').style.display = 'none';
      document.getElementById('CostPriceGroup').style.display = 'none';
      document.getElementById('amountGroup').style.display = 'none';
      document.getElementById('rateGroup').style.display = 'none';
      document.getElementById('sellingPrice').style.display = 'none';
      document.getElementById('quantity2').style.display = 'none';

      (document.getElementById('txt_keyword') as HTMLInputElement).disabled = true;
      (document.getElementById('btnSS') as HTMLInputElement).disabled = true;
      (document.getElementById('keyAdd') as HTMLInputElement).disabled = true;
    }
  }


  backToLIst() {
    let url = 'products/digital/digital-product-list';
    this.router.navigate([url]);
  }


  makeQaApprove() {
    let payloard = {
      product_code: this.ids,
      qa_user_id: sessionStorage.getItem('userId')
    };

    this.productService.qaChecked(payloard).subscribe(
      data => this.manageQaCheckedRes(data),
    );
  }

  manageQaCheckedRes(data) {
    Swal.fire(
      'Success',
      data.message,
      'success'
    );
    let url = 'products/digital/digital-product-list';
    this.router.navigate([url]);
  }

// ===============================================================end edit methods======================================
}
