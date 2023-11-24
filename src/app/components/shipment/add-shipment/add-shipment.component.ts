import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {ShipmentNewService} from '../../../shared/service/shipment-new.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {OrderShareService} from '../../../shared/service/order-share.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PriceChangeService} from '../../../shared/service/price-change.service';
import {PendingStockAllocationShareService} from '../../../shared/service/pending-stock-allocation-share.service';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import {state} from '@angular/animations';
import {jsPDF} from 'jspdf';

function getColorWord(colorValue) {
  const colorToWordMap = new Map([
    ['#000000', 'Black'],
    ['#ffffff', 'White'],
    ['#ff0000', 'Red'],
    ['#00ff00', 'Green'],
    ['#0000ff', 'Blue'],
    ['#FFFF00', 'yellow'],
    ['#808080', 'gray'],
    ['#800080', 'purple'],
    ['#FFA500', 'orange'],
    ['#800000', 'maroon'],
  ]);
  if (colorToWordMap.has(colorValue)) {
    return colorToWordMap.get(colorValue);
  } else {
    return 'Unknown';
  }
}

@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.scss']
})
export class AddShipmentComponent implements OnInit {
  public shipmentForm: FormGroup;
  public partnerProductArray = [];
  public tableData = [];
  public shipArray = [];
  public productVariationArrayForClothes = [];
  sharedData = [];
  productDetails = [];
  public productVariationArrayForColor = [];
  filteredData = [];

  private quantityMap: Map<number, string> = new Map<number, string>();

  public isPriceChange = 0;
  public qtys = 0;
  private allQty = 0;

  public isClothes = false;
  public isOnDemandShipment = false;
  public isBtnAddDisabled = false;
  public isBtnSaveDisabled = false;
  public isProductExist = false;
  public isOnDemandProduct = false;

  selectProduct = 'Select Product';
  orderRef = '';
  public proCode = '';
  public partCode = '';
  public OnDemandPCode = '';
  // isPriceChange = '';

  changeProName: any;
  changeRate: any;
  changeProCode: any;
  changeVendor: any;
  changeCostPrice: any;
  changeSellingPrice: any;
  modalRef: any;
  shipmentID: any;

  @ViewChild('changePricePopup') changePricePopup: ElementRef;
  @ViewChild(DropdownComponent, { static: false }) dropdownComponent: DropdownComponent;

  constructor(private route: ActivatedRoute, private shipmentNewService: ShipmentNewService, private router: Router,
              private order: OrderShareService, private pendingStockShare: PendingStockAllocationShareService, private modal: NgbModal, private priceChangeService: PriceChangeService) {

    this.createFormConteolerForShipment();
    this.searchProduct();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.proCode = params.productCode;
    });

    this.order.dataArray$.subscribe(data => {
      this.sharedData = data;
    });

    this.pendingStockShare.dataArray$.subscribe(data => {
      this.productDetails = data;
    });

    if (isNotNullOrUndefined(this.proCode)) {
      this.isOnDemandShipment = true;
      this.createFormConteolerForShipment();
      this.processOnDemandShipment();
    }

    if (this.dropdownComponent) {
      this.dropdownComponent.setDefaultValue();
    }
  }

  processOnDemandShipment() {
    for (const item of this.sharedData) {
      const selectedProductObj = this.partnerProductArray.find(product => product.product_code === item.productCode);
      this.orderRef = item.orderRef;
      if (selectedProductObj) {
        this.selectedProduct(selectedProductObj);
        this.isClothes = true;
      }
    }
  }

  changedProduct(selectedValue) {
    let productValueIndex: number;
    let proValueIndex = '';
    if (this.isOnDemandShipment) {
      proValueIndex = '';
    } else {
      // productValueIndex = (document.getElementById('SelectedProduct') as HTMLInputElement).value;
      productValueIndex = this.partnerProductArray.findIndex(item => item.product_code === selectedValue);
      proValueIndex = productValueIndex.toString();
    }

    const selectedProductObj = this.partnerProductArray[productValueIndex];
    if (proValueIndex !== '') {
      if (selectedProductObj.item_group.toUpperCase() === 'CLOATHING' || selectedProductObj.item_group.toUpperCase() === 'CLOTHING') {
        this.isClothes = true;
        this.selectedProduct(selectedProductObj);
      } else {
        this.isClothes = false;
        this.selectedProduct(selectedProductObj);
      }
    } else {
      this.productVariationArrayForClothes = [];
      this.tableData = [];
      this.shipmentForm.get('txtChangingRate').setValue(0.0);
      this.shipmentForm.get('txtChangingAmount').setValue(0.0);
      this.shipmentForm.get('txtGrossAmount').setValue(0.0);
      this.shipmentForm.get('txtTotalSellerIncome').setValue(0.0);
      this.shipmentForm.get('txtAllQuantity').setValue(0);
      this.shipmentForm.get('txtProductCode').setValue('');
      this.shipmentForm.get('txtProductName').setValue('');
      this.shipmentForm.get('txtSellingPrice').setValue('');
      this.shipmentForm.get('txtCostPrice').setValue('');
    }
  }

  createFormConteolerForShipment() {
    this.shipmentForm = new FormGroup({
      txtSearchBox: new FormControl(''),
      txtProductCode: new FormControl(''),
      txtProductName: new FormControl(''),
      txtCostPrice: new FormControl(''),
      txtSellingPrice: new FormControl(''),
      txtQuantity: new FormControl(''),
      txtAmount: new FormControl(''),
      txtAllQuantity: new FormControl(''),
      txtGrossAmount: new FormControl(''),
      txtTotalSellerIncome: new FormControl(''),
      txtChangingAmount: new FormControl(''),
      txtChangingRate: new FormControl('')
    });
  }

  hitShipment() {
    this.selectProduct = 'Select Product';
    if (this.dropdownComponent) {
      this.dropdownComponent.setDefaultValue();
    }
    if (this.tableData.length === 0) {
      Swal.fire(
        'Whoops...!',
        'Shipment Table Cant Empty...',
        'error'
      );
    } else {
      this.isBtnSaveDisabled = true;
      const partnerId = sessionStorage.getItem('partnerId');
      this.shipArray = [];

      for (let i = 0; i < this.tableData.length; i++) {
        const or = {
          product_code: this.tableData[i].product_code,
          product_name: this.tableData[i].product_name,
          cost_price: this.tableData[i].cost_price,
          quantity: this.tableData[i].quantity,
          changing_amount: this.tableData[i].changing_amount,
          changing_rate: this.tableData[i].changing_rate,
          selling_price: this.tableData[i].selling_price,
          variation_code: this.tableData[i].variationCode,
        };
        this.shipArray.push(or);
      }

      const payLoard = {
        vendor_code: partnerId,
        shipmentItem: this.shipArray,
        orderRef: this.orderRef,
        isPriceChange: this.isPriceChange
      };
      this.shipmentNewService.saveShipment(payLoard).subscribe(
        data => {
          this.manageSaveShipment(data);
        },
      );
    }
  }

  manageSaveShipment(data) {
    Swal.fire({
      title: 'Shipment Added...!',
      text: 'Click to Download your Shipment QR Code.',
      icon: 'success',
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Download',
      allowOutsideClick: false,
    }).then((result) => {
      this.isBtnSaveDisabled = false;
      const payLoard = {
        shipment_id: data.data.shipment_id
      };
      this.shipmentID = data.data.shipment_id;
      this.shipmentNewService.generateQRCode(payLoard).subscribe(
        data => {
          this.manageSaveQr(data);
        },
      );

      /*const doc = new jsPDF();
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('Consignment Note', 75, 10);
      doc.setFontSize(10);
      doc.text('Vendor Information', 10, 30);
      doc.setFont('helvetica', 'normal');
      doc.text('Business Name:' + data.data.vendor_name, 20, 40);
      doc.text('Email:' + sessionStorage.getItem('email'), 20, 45);
      doc.text('Phone Number:' + sessionStorage.getItem('contact_number'), 20, 50);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Shipment Details', 10, 70);
      doc.setFont("helvetica", "italic", "bold");
      doc.text('Shipment ID: ' + data.data.shipment_id, 140, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('Product Name', 50, 90);
      doc.text('Quantity', 130, 90);
      doc.text('Seller Income', 155, 90);
      doc.text('Amount', 190, 90);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');

      let x = 100;
      for (let i = 0; i <= this.shipArray.length - 1; i++) {
        doc.text('' + this.shipArray[i].product_name, 10, x);
        doc.text('' + this.shipArray[i].quantity, 135, x);
        doc.text('' + this.shipArray[i].cost_price, 165, x);
        doc.text('' + this.shipArray[i].selling_price, 195, x);
        x += 10;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Sub Total ' + TotalSellerIncome, 130, x + 10);
      doc.save('Consignment Note.pdf');*/
    });

    this.tableData = [];
    this.shipmentForm.get('txtChangingRate').setValue(0.0);
    this.shipmentForm.get('txtChangingAmount').setValue(0.0);
    this.shipmentForm.get('txtGrossAmount').setValue('');
    this.shipmentForm.get('txtTotalSellerIncome').setValue('');
    this.shipmentForm.get('txtAllQuantity').setValue('');

    /*const productSelect = document.getElementById('SelectedProduct') as HTMLSelectElement;
    productSelect.value = '';*/
  }

  manageSaveQr(data) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const dataUrl = canvas.toDataURL('image/png');
      this.downloadQRImage(dataUrl);
    };
    img.src = 'data:image/png;base64,' + data.data.qrByte;
  }

  downloadQRImage(dataUrl: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'QRCode_' + this.shipmentID + '.png';
    link.click();
  }

  searchProduct() {
    const vendorCode = sessionStorage.getItem('partnerId');
    const payLoad = {
      vendor: vendorCode
    };
    this.shipmentNewService.searchProductGet(payLoad).subscribe(
      data => this.ManageSearchProductGet(data),
    );
  }

  ManageSearchProductGet(data) {
    this.partnerProductArray = [];
    if (data.data == null) {
      Swal.fire(
        'Whoops...!',
        'Can not find Product.',
        'error'
      );
      this.partnerProductArray = [];
      this.createFormConteolerForShipment();
    } else {
      if (this.isOnDemandShipment) {
        for (let i = 0; i < data.data.length; i++) {
          if (this.sharedData.some(item => item.productId === data.data[i].product_code)) {
            const od = {
              product_code: data.data[i].product_code,
              name: data.data[i].title,
              value: data.data[i].product_code,
              label: data.data[i].product_code + ' - ' + data.data[i].title,
              qty: data.data[i].qty,
              cost_price: data.data[i].cost_price,
              selling_price: data.data[i].selling_price,
              amount: data.data[i].amount,
              changingAmount: data.data[i].changing_amount,
              changingRate: data.data[i].changing_rate,
              product_variations: data.data[i].productVariation,
              item_group: data.data[i].item_group,
            };
            this.partnerProductArray.push(od);

            const val = '';
            this.changedProduct(val);
          }
        }
      } else {
        for (let i = 0; i < data.data.length; i++) {
          const or = {
            product_code: data.data[i].product_code,
            name: data.data[i].title,
            value: data.data[i].product_code,
            label: data.data[i].product_code + ' - ' + data.data[i].title,
            qty: data.data[i].qty,
            cost_price: data.data[i].cost_price,
            selling_price: data.data[i].selling_price,
            amount: data.data[i].amount,
            changingAmount: data.data[i].changing_amount,
            changingRate: data.data[i].changing_rate,
            product_variations: data.data[i].productVariation,
            item_group: data.data[i].item_group,
          };
          this.partnerProductArray.push(or);
        }
      }
    }
  }

  selectedProduct(code) {
    this.productVariationArrayForClothes = [];
    if (code.changingAmount === 0) {
      (document.getElementById('txtChangingAmount') as HTMLInputElement).disabled = true;
      (document.getElementById('txtChangingRate') as HTMLInputElement).disabled = false;
    } else if (code.changingRate === 0) {
      (document.getElementById('txtChangingAmount') as HTMLInputElement).disabled = false;
      (document.getElementById('txtChangingRate') as HTMLInputElement).disabled = true;
    }

    /*this.OnDemandPCode = '';
    this.isOnDemandProduct = false;
    const indexOfP = code.product_code.indexOf('P');
    if (indexOfP !== -1) {
      this.OnDemandPCode = code.product_code.substring(indexOfP + 1);
    }
    this.isOnDemandProduct = this.OnDemandPCode.includes('OD');*/

    for (let j = 0; j < code.product_variations.length; j++) {
      let gr = {item: 'clothes'};
      for (let x = 0; x < code.product_variations[j].variations.length; x++) {
        const temp = code.product_variations[j].variations[x];
        if (temp.theame.toLowerCase() === 'color') {
          gr = Object.assign(gr, {color: temp.theame_value});
        } else {
          gr = Object.assign(gr, {size: temp.theame_value});
          gr = Object.assign(gr, {variationCode: code.product_variations[j].variation_code});
        }
        this.quantityMap.set(x, '0');
      }
      this.productVariationArrayForClothes.push(gr);
    }

    let grossAmount = 0.0;
    let allQuantity = 0;
    let totalSellerIncome = 0;

    if (this.isClothes) {
      for (let i = 0; i < this.tableData.length; i++) {
        grossAmount = grossAmount + Number(this.tableData[i].amount);
        allQuantity = allQuantity + Number(this.tableData[i].quantity);
        totalSellerIncome += Number(this.tableData[i].seller_income);
      }
    } else {
      for (let i = 0; i < this.tableData.length; i++) {
        grossAmount = grossAmount + Number(this.tableData[i].amount);
        allQuantity = allQuantity + Number(this.tableData[i].quantity);
        totalSellerIncome += Number(this.tableData[i].seller_income);
      }
    }

    this.shipmentForm = new FormGroup({
      txtSearchBox: new FormControl(''),
      txtProductCode: new FormControl(code.product_code),
      txtProductName: new FormControl(code.name),
      txtCostPrice: new FormControl(code.cost_price),
      txtSellingPrice: new FormControl(code.selling_price),
      txtQuantity: new FormControl(code.qty),
      txtAmount: new FormControl(code.amount),
      txtAllQuantity: new FormControl(allQuantity),
      txtGrossAmount: new FormControl(grossAmount),
      txtTotalSellerIncome: new FormControl(totalSellerIncome),
      txtChangingAmount: new FormControl(code.changingAmount),
      txtChangingRate: new FormControl(code.changingRate),
    });

    this.changeProName = code.name;
    this.changeProCode = code.product_code;
    this.changeVendor = sessionStorage.getItem('partnerId');
    this.changeCostPrice = code.cost_price;
    this.changeSellingPrice = code.selling_price;
    this.changeRate = code.product_variations[0].changing_rate;

    if (this.isOnDemandShipment) {
      this.addToTable();
    }
  }

  saveChangePrice() {
    const sellingPrice = (document.getElementById('newSellingPrice') as HTMLInputElement).value;
    const payLoard = {
      newSellingPrice: sellingPrice,
      productCode: this.changeProCode,
      vendor_code: this.changeVendor
    };
    this.priceChangeService.changeSellingPrice(payLoard).subscribe(
      data => this.managechangeSellingPrice(data),
      error => this.manageUserError(error)
    );
  }

  popup() {
    this.modalRef = this.modal.open(this.changePricePopup, {centered: true});
  }

  closePopup() {
    this.modalRef.close();
  }

  addToTable() {
    let summation = 0;
    for (const i of this.quantityMap.keys()) {
      summation += parseInt(this.quantityMap.get(i));
    }
    const dataForm = this.shipmentForm.value;
    if (dataForm.txtProductCode === '') {
      Swal.fire(
        'Whoops...!',
        'Please choose a product and input the quantity before submitting.',
        'error'
      );
    } else if (dataForm.txtProductName === '') {
      Swal.fire(
        'Whoops...!',
        'Product Name empty',
        'error'
      );
    } else if (dataForm.txtCostPrice === '') {
      Swal.fire(
        'Whoops...!',
        'Product Cost Price empty',
        'error'
      );
    } else if (summation === 0) {
      Swal.fire(
        'Whoops...!',
        'Product Quantity empty',
        'error'
      );
    } else if (dataForm.txtSellingPrice === '') {
      Swal.fire(
        'Whoops...!',
        'Selling Price empty',
        'error'
      );
    } else {
      this.isBtnAddDisabled = true;
      this.allQty = 0;
      if (this.isOnDemandShipment) {
        for (let i = 0; i < this.sharedData.length; i++) {
          this.allQty += parseInt(this.quantityMap.get(i));
          const sellerIncome = this.sharedData[i].costPrice * this.sharedData[i].size;
          const grossAmount = this.sharedData[i].sellingPrice * this.sharedData[i].size;
          const tempProductName = this.sharedData[i].name.toString().concat(' - Unknownnone');
          const insertTabelData = {
            product_code: this.sharedData[i].productId,
            product_name: tempProductName,
            cost_price: dataForm.txtCostPrice,
            quantity: this.sharedData[i].size,
            changing_amount: dataForm.txtChangingAmount,
            changing_rate: dataForm.txtChangingRate,
            selling_price: dataForm.txtSellingPrice,
            seller_income: sellerIncome.toString(),
            amount: grossAmount.toString(),
            color: this.productVariationArrayForClothes[0].color,
            size: this.productVariationArrayForClothes[0].size,
            variationCode: this.productVariationArrayForClothes[0].variationCode
          };
          this.tableData.push(insertTabelData);
          this.quantityMap.set(i, '0');
        }
      } else {
        for (let i = 0; i < this.productVariationArrayForClothes.length; i++) {
          this.allQty += parseInt(this.quantityMap.get(i));
          const sellerIncome = parseInt(dataForm.txtCostPrice) * parseInt(this.quantityMap.get(i));
          const grossAmount = parseInt(dataForm.txtSellingPrice) * parseInt(this.quantityMap.get(i));
          const tempProductName = dataForm.txtProductName.concat('-').concat(getColorWord(this.productVariationArrayForClothes[i].color)).concat(this.productVariationArrayForClothes[i].size);

          this.isProductExist = false;
          for (let j = 0; j < this.tableData.length; j++) {
            if (tempProductName === this.tableData[j].product_name && dataForm.txtProductCode === this.tableData[j].product_code) {
              this.isProductExist = true;
            }
          }

          if (!this.isProductExist) {
            const insertTabelData = {
              product_code: dataForm.txtProductCode,
              product_name: tempProductName,
              cost_price: dataForm.txtCostPrice,
              quantity: this.quantityMap.get(i),
              changing_amount: dataForm.txtChangingAmount,
              changing_rate: dataForm.txtChangingRate,
              selling_price: dataForm.txtSellingPrice,
              seller_income: sellerIncome.toString(),
              amount: grossAmount.toString(),
              color: this.productVariationArrayForClothes[i].color,
              size: this.productVariationArrayForClothes[i].size,
              variationCode: this.productVariationArrayForClothes[i].variationCode
            };
            if (Number(this.quantityMap.get(i)) > 0) {
              this.tableData.push(insertTabelData);
              // this.productVariationArrayForClothes = [];
            }
          }else{
            Swal.fire(
              'Warning!',
              'Duplicate products!',
              'warning'
            );
          }
          this.quantityMap.set(i, '0');
        }
      }
      // this.createFormConteolerForShipment();
      this.geAllQtyAndGrossAmount();
      this.selectProduct = 'Select Product';
      if (this.dropdownComponent) {
        this.dropdownComponent.setDefaultValue();
      }
    }
  }

  geAllQtyAndGrossAmount() {
    let grossAmount = 0.0;
    let allQuantity = 0;
    let totalSellerIncome = 0;

    if (this.isClothes) {
      for (let i = 0; i < this.tableData.length; i++) {
        grossAmount = grossAmount + Number(this.tableData[i].amount);
        allQuantity = allQuantity + Number(this.tableData[i].quantity);
        totalSellerIncome += Number(this.tableData[i].seller_income);
      }
    } else {
      for (let i = 0; i < this.tableData.length; i++) {
        grossAmount = grossAmount + Number(this.tableData[i].amount);
        allQuantity = allQuantity + Number(this.tableData[i].quantity);
        totalSellerIncome += Number(this.tableData[i].seller_income);
      }
    }

    this.shipmentForm = new FormGroup({
      txtSearchBox: new FormControl(''),
      txtProductCode: new FormControl(''),
      txtProductName: new FormControl(''),
      txtCostPrice: new FormControl(''),
      txtSellingPrice: new FormControl(''),
      txtQuantity: new FormControl(''),
      txtAmount: new FormControl(''),
      txtAllQuantity: new FormControl(allQuantity),
      txtGrossAmount: new FormControl(grossAmount),
      txtTotalSellerIncome: new FormControl(totalSellerIncome),
      txtChangingAmount: new FormControl(),
      txtChangingRate: new FormControl(),
    });
    this.productVariationArrayForClothes = [];
    this.isBtnAddDisabled = false;
  }

  editTableRow(index) {
    this.shipmentForm = new FormGroup({
      txtSearchBox: new FormControl(''),
      txtProductCode: new FormControl(this.tableData[index].product_code),
      txtProductName: new FormControl(this.tableData[index].product_name),
      txtCostPrice: new FormControl(this.tableData[index].cost_price),
      txtSellingPrice: new FormControl(this.tableData[index].selling_price),
      txtQuantity: new FormControl(this.tableData[index].quantity),
      txtAmount: new FormControl(this.tableData[index].amount),
      txtAllQuantity: new FormControl(this.shipmentForm.value.txtAllQuantity),
      txtGrossAmount: new FormControl(this.shipmentForm.value.txtGrossAmount),
      txtTotalSellerIncome: new FormControl(this.shipmentForm.value.txtTotalSellerIncome),
    });
    this.tableData.splice(index, 1);
  }

  deleteTableRow(index) {
    this.selectProduct = 'Select Product';
    if (this.dropdownComponent) {
      this.dropdownComponent.setDefaultValue();
    }
    this.tableData.splice(index, 1);
    this.geAllQtyAndGrossAmount();
  }

  /*holdShipment() {
    const partnerId = sessionStorage.getItem('partnerId');
    this.shipArray = [];

    if (this.tableData.length === 0) {
      Swal.fire(
        'Whoops...!',
        'Shipment Table Cant Empty...',
        'error'
      );
    } else {
      for (let i = 0; i < this.tableData.length; i++) {
        const or = {
          product_code: this.tableData[i].product_code,
          product_name: this.tableData[i].product_name,
          cost_price: this.tableData[i].cost_price,
          quantity: this.tableData[i].quantity,
          changing_amount: this.tableData[i].changing_amount,
          changing_rate: this.tableData[i].changing_rate,
          selling_price: this.tableData[i].selling_price
        };
        this.shipArray.push(or);
      }
      const payLoard = {
        vendor_code: partnerId,
        shipmentItem: this.shipArray,
        isPriceChange: this.isPriceChange
      };
      this.shipmentNewService.HoldShipment(payLoard).subscribe(
        data => this.manageHoldShipment(data),
      );
    }
  }*/

  /*manageHoldShipment(data) {
    if (data.status_code === 200) {
      Swal.fire(
        'Good Job..!',
        'Shipment Successfully Put on Hold..!',
        'success'
      );
      this.tableData = [];
      this.shipmentForm.get('txtChangingRate').setValue(0.0);
      this.shipmentForm.get('txtChangingAmount').setValue(0.0);
      this.shipmentForm.get('txtGrossAmount').setValue(0.0);
      this.shipmentForm.get('txtTotalSellerIncome').setValue(0.0);
      this.shipmentForm.get('txtAllQuantity').setValue(0);
    }
  }*/

  managechangeSellingPrice(data) {
    if (data.status_code === 200) {
      Swal.fire(
        'Good Job...!',
        'Listing Price Change Success...!',
        'success'
      );
      this.modalRef.close();
      this.shipmentForm = new FormGroup({

        txtCostPrice: new FormControl(data.data.newCostPrice),
        txtSellingPrice: new FormControl(data.data.newSellingPrice),
        txtProductCode: new FormControl(data.data.productCode),
        txtProductName: new FormControl(data.data.productName)
      });
      this.isPriceChange = 1;
    }
  }

  manageUserError(error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.error.error,
    });
  }

  changingAmountCalculation() {
    const sellingAmount = Number(this.shipmentForm.value.txtChangingAmount) + Number(this.shipmentForm.value.txtCostPrice);
    this.shipmentForm.get('txtSellingPrice').setValue(sellingAmount);
  }

  changingRateCal() {
    const sellingAmount = Number(this.shipmentForm.value.txtCostPrice) + (Number(this.shipmentForm.value.txtChangingRate) * Number(this.shipmentForm.value.txtCostPrice)) / 100;
    this.shipmentForm.get('txtSellingPrice').setValue(sellingAmount);
  }

  calculateAmount() {
    const costPrice: number = Number(this.shipmentForm.value.txtCostPrice);
    const quantity: number = Number(this.shipmentForm.value.txtQuantity);
    const amount: number = costPrice * quantity;
    this.shipmentForm.get('txtAmount').setValue(amount);
  }

  calculateCost() {
    const sellingAmount = (Number(this.shipmentForm.value.txtCostPrice) + (Number(this.shipmentForm.value.txtChangingRate) * Number(this.shipmentForm.value.txtCostPrice)) / 100) + Number(this.shipmentForm.value.txtChangingAmount);
    this.shipmentForm.get('txtSellingPrice').setValue(sellingAmount);
    const costPrice: number = Number(this.shipmentForm.value.txtCostPrice);
    const quantity: number = Number(this.shipmentForm.value.txtQuantity);
    const amount: number = costPrice * quantity;
    this.shipmentForm.get('txtAmount').setValue(amount);
  }

  ChangeValue(i) {
    let qty = '0';
    qty = (document.getElementById('txtQtyForClothes' + i) as HTMLInputElement).value;
    const index = i;
    this.quantityMap.set(parseInt(index), qty);
  }
}
