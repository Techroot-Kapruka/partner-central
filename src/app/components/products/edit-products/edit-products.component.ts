import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from '../../../shared/service/product.service';
import Swal from 'sweetalert2';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../../environments/environment.prod';
import {AngularEditorConfig} from '@kolkov/angular-editor';


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
  @Input()
  public catParth = [];
  public isColor = false;
  public isSize = false;
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
  public selectedimg = '';
  public ids = '';
  public imageData = [];
  public imagePathURI = environment.imageURIENV;
  public title_name = 'Edit Product';
  public amountBefor = '';
  showmsg = false;
  showmsg1 = false;

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
  descriptionContent;

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



  constructor(private router: Router, private _Activatedroute: ActivatedRoute, private modalService: NgbModal, private productService: ProductService) {
    this.ids = '';
    this._Activatedroute.paramMap.subscribe(params => {
      this.getProductByEdit(params.get('id'));
      this.ids = params.get('id');
    });


    this.imageControlMethord();
    this.editFormControlMethode();
    this.getImages();
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
      // imageOne: new FormControl(''),
      // imageOne2: new FormControl(''),
      // imageOne3: new FormControl(''),
      // imageOne4: new FormControl(''),
      // imageOne5: new FormControl(''),
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

  loadimg(x:number){
    switch (x) {
      case 1:
        this.selectedimg=this.imageOne
        break;

      case 2:
        this.selectedimg=this.imageOne2
        break;

      case 3:
        this.selectedimg=this.imageOne3
        break;

      case 4:
        this.selectedimg=this.imageOne4
        break;

      case 5:
        this.selectedimg=this.imageOne5
        break;
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

    // tslint:disable-next-line:variable-name
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

  changeValue2(event: any) {
    // this.selectedimg=this.imageOne2
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
    // this.selectedimg=this.imageOne3
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
    this.selectedimg=this.imageOne4;
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

    // base info

    this.baseInfo.get('Title').setValue(data.data.product.title);
    this.baseInfo.get('Brand').setValue(data.data.product.brand);
    this.baseInfo.get('Manufacture').setValue(data.data.product.manufacture);
    this.oldTitle = data.data.product.title;
    this.oldBrand = data.data.product.brand;
    this.oldManufacture = data.data.product.manufacture;

    // description


    this.description.get('txt_description').setValue(data.data.product.productDescription.description);
    this.descriptionContent = data.data.product.productDescription.description;
    this.description.get('special_notes').setValue(data.data.product.productDescription.special_notes);
    this.description.get('availability').setValue(data.data.product.productDescription.availability.toUpperCase());
    this.old_Txt_description = data.data.product.productDescription.description;
    this.old_special_notes = data.data.product.productDescription.special_notes;
    this.old_availability = data.data.product.productDescription.availability.toUpperCase();

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
      // document.getElementById('saveId').style.display = 'none';
    }
    // (document.getElementById('breadcrum') as HTMLInputElement).innerHTML = data.data.category_path;
    // (document.getElementById('category_code') as HTMLInputElement).value = data.data.product.category_code;
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
      // this.addingProductGroups();

      for (let i = 0; i < data.data.product.productVariation.length; i++) {
        let payData = {};
        let color_value = '';
        let size_value = '';
        for (let j = 0; j < data.data.product.productVariation[i].variations.length; j++) {

          if (data.data.product.productVariation[i].variations[j].theame == 'Color') {
            color_value = data.data.product.productVariation[i].variations[j].theame_value;
          }
          if (data.data.product.productVariation[i].variations[j].theame === 'Size') {
            size_value = data.data.product.productVariation[i].variations[j].theame_value;
          }
          payData = {
            size: size_value,
            color: color_value,

          };
        }
        this.productGroupTabel.push(payData);
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


  backToLIst() {
    let url = 'products/digital/digital-product-list';
    this.router.navigate([url]);
  }

// ===============================================================end edit methods======================================
//   handleTabClick($event) {
//     $event.preventDefault();
//   }

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
      comment: 'Test',
      requestedBy: partnerId,
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
        },
        {
          column_name: 'manufacture',
          old_value: this.oldManufacture,
          new_value: manufacture,
          call_name: 'manufacture',
        }
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

    this.offer.get('txt_seller_sku').disable();
    this.offer.get('condition').disable();
  }

  private manageEditField(data) {
    Swal.fire(
      'well done...!',
      data.message,
      'success'
    );
    this.router.navigate(['products/digital/digital-product-list']);

  }

  saveFieldDescription() {
    let partnerId = sessionStorage.getItem('partnerId');
    let description = this.descriptionContent;
    let specialNotes = this.description.get('special_notes').value;
    let availability = this.description.get('availability').value;
    let productId = this.ids;

    let payload = {
      referenceId: productId,
      type: 'PRODUCT',
      sub_type: 'product_description',
      comment: 'Test',
      requestedBy: partnerId,
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

  saveOfferFields() {
    let partnerId = sessionStorage.getItem('partnerId');
    let txt_seller_sku = this.offer.get('txt_seller_sku').value;
    let txt_price = this.offer.get('txt_price').value;
    let txt_quantity = this.offer.get('txt_quantity').value;
    let condition = this.offer.get('condition').value;
    let txt_amount = this.offer.get('txt_amount').value;
    let txt_price_rate = this.offer.get('txt_price_rate').value;
    let txt_listning_price = this.offer.get('txt_listning_price').value;
    let productId = this.ids;

    let payload = {
      referenceId: productId,
      type: 'PRODUCT',
      sub_type: 'product_offer',
      comment: 'Test',
      requestedBy: partnerId,
      data: [
        {
          column_name: 'seller_sku',
          old_value: this.old_txt_seller_sku,
          new_value: txt_seller_sku,
          call_name: 'seller_sku',
        },
        {
          column_name: 'price',
          old_value: this.old_txt_price,
          new_value: txt_price,
          call_name: 'price',
        },
        {
          column_name: 'quantity',
          old_value: this.old_txt_quantity,
          new_value: txt_quantity,
          call_name: 'quantity',
        },
        {
          column_name: 'condition',
          old_value: this.old_condition,
          new_value: condition,
          call_name: 'condition',
        },
        {
          column_name: 'amount',
          old_value: this.old_txt_amount,
          new_value: txt_amount,
          call_name: 'amount',
        },
        {
          column_name: 'price_rate',
          old_value: this.old_txt_price_rate,
          new_value: txt_price_rate,
          call_name: 'price_rate',
        },
        {
          column_name: 'listning_price',
          old_value: this.old_txt_listning_price,
          new_value: txt_listning_price,
          call_name: 'listning_price',
        }
      ]
    };


    this.productService.editField(payload).subscribe(
      data => this.manageEditField(data),
    );
  }

  saveEditedImage() {
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

    this.productService.editFieldImageSave(one, one2, one3, one4, one5, this.ids).subscribe(
      data => this.successAlert(data),
      error => this.mnageErrorProduct(error)
    );
  }


  mnageErrorProduct(error) {
    Swal.fire(
      'Oops...',
      error.message,
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
}
