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
import {DropdownComponent} from '../../../shared/dropdown/dropdown.component';
import {state} from '@angular/animations';
import {jsPDF} from 'jspdf';
import {ProductService} from "../../../shared/service/product.service";
import {OrderService} from "../../../shared/service/order.service";
import {classNames} from "@angular/cdk/schematics";

function getColorWord(colorValue) {
  const colorToWordMap = new Map([
    ['#FF0000', 'Red'],
    ['#008000', 'Green'],
    ['#0000FF', 'Blue'],
    ['#FFFF00', 'Yellow'],
    ['#800080', 'Purple'],
    ['#FFA500', 'Orange'],
    ['#FFC0CB', 'Pink'],
    ['#A52A2A', 'Brown'],
    ['#000000', 'Black'],
    ['#FFFFFF', 'White'],
    ['#808080', 'Gray'],
    ['#F5F5DC', 'Beige'],
    ['#40E0D0', 'Turquoise'],
    ['#00FFFF', 'Cyan'],
    ['#FF00FF', 'Magenta'],
    ['#E6E6FA', 'Lavender'],
    ['#EE82EE', 'Violet'],
    ['#008080', 'Teal'],
    ['#000080', 'Navy'],
    ['#800000', 'Maroon'],
    ['#4B0082', 'Indigo'],
    ['#808000', 'Olive'],
    ['#FFDAB9', 'Peach'],
    ['#98FF98', 'Mint'],
    ['#C0C0C0', 'Silver'],
    ['#FFD700', 'Gold'],
    ['#9B111E', 'Ruby'],
    ['#50C878', 'Emerald'],
    ['#0F52BA', 'Sapphire'],
    ['#FF7F50', 'Coral'],
    ['#8E4585', 'Plum'],
    ['#E0B0FF', 'Mauve'],
    ['#FFFFF0', 'Ivory'],
    ['#FFFDD0', 'Cream'],
    ['#D2B48C', 'Tan'],
    ['#F7E7CE', 'Champagne'],
    ['#C8A2C8', 'Lilac'],
    ['#CCCCFF', 'Periwinkle'],
    ['#FFA07A', 'Tangerine'],
    ['#00FFFF', 'Aqua'],
    ['#FF00FF', 'Fuchsia'],
    ['#708090', 'Slate'],
    ['#36454F', 'Charcoal'],
    ['#FFF700', 'Lemon'],
    ['#800020', 'Burgundy'],
    ['#FFDB58', 'Mustard'],
    ['#5A5A5A', 'Eggplant'],
    ['#DA70D6', 'Orchid'],
    ['#FA8072', 'Salmon'],
    ['#0047AB', 'Cobalt'],
    ['#98FF98', 'Mint Green'],
    ['#DE5D83', 'Blush'],
    ['#87CEEB', 'Sky Blue'],
    ['#C04000', 'Mahogany'],
    ['#CD7F32', 'Bronze'],
    ['#F0E68C', 'Khaki'],
    ['#D2691E', 'Cinnamon'],
    ['#C2B280', 'Sand'],
    ['#965A3E', 'Caramel'],
    ['#585858', 'Graphite'],
    ['#6A5ACD', 'Slate Blue'],
    ['#C0C0C0', 'Silver Grey'],
    ['#F5F5F5', 'Creamy White'],
    ['#71EEB8', 'Seafoam'],
    ['#B0A6A4', 'Pewter'],
    ['#4B3621', 'Cappuccino'],
    ['#1560BD', 'Denim'],
    ['#E2725B', 'Terracotta'],
    ['#556B2F', 'Olive Green'],
    ['#6F2DA8', 'Grape'],
    ['#7B3F00', 'Chocolate']
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
  filteredData = [];
  productDetails = [];
  changeFeids = [];
  submitShipmentchangeFeids = [];
  public productVariationArrayForColor = [];

  private quantityMap: Map<number, string> = new Map<number, string>();

  public isPriceChange = 0;
  public qtys = 0;
  private allQty = 0;

  callingCount = 0;


  public isClothes = false;
  public isOnDemandShipment = false;
  public isBtnAddDisabled = false;
  public isBtnSaveDisabled = true;
  public isProductExist = false;
  public isOnDemandProduct = false;
  public showPriceChange = false;
  public priceChangeClick = false;

  selectProduct = 'Select Product';
  orderRef = '';
  qrImage = '';
  public proCode = '';
  public partCode = '';
  public OnDemandPCode = '';
  public btnSaveShipmentColor: string = '#6f6f6f';
  // isPriceChange = '';

  passChangePriceToAddTable: any;
  changeProName: any;
  changeRate: any;
  changeProCode: any;
  changeVendor: any;
  changeCostPrice: any;
  changeSellingPrice: any;
  modalRef: any;
  shipmentID: any;

  changeChangingRate: any;


  @ViewChild('changePricePopup') changePricePopup: ElementRef;
  @ViewChild(DropdownComponent, {static: false}) dropdownComponent: DropdownComponent;

  constructor(private route: ActivatedRoute, private shipmentNewService: ShipmentNewService, private router: Router, private productService: ProductService,
              private order: OrderShareService, private pendingStockShare: PendingStockAllocationShareService,
              private modal: NgbModal, private priceChangeService: PriceChangeService, private orderService: OrderService) {

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

    console.log(this.sharedData)
    for (const item of this.sharedData) {
      console.log(item)
      console.log(this.partnerProductArray)
      console.log(this.partnerProductArray.find(product => product.product_code === item.productCode))
      let proCode = item.productId
      if (proCode.includes('_TC')) {
        proCode = proCode.split('_TC')[0]
      }
      const selectedProductObj = this.partnerProductArray.find(product => product.product_code === item.productCode);
      this.orderRef = item.orderRef;
      console.log(selectedProductObj)
      if (selectedProductObj) {
        console.log(selectedProductObj)
        this.selectedProduct(selectedProductObj);
        this.isClothes = true;
      }
    }
  }

  changedProduct(selectedValue) {
    let productValueIndex: number;
    let proValueIndex = '';
    if (this.isOnDemandShipment) {
      productValueIndex = 0;
      proValueIndex = '0'

    } else {
      // productValueIndex = (document.getElementById('SelectedProduct') as HTMLInputElement).value;
      productValueIndex = this.partnerProductArray.findIndex(item => item.product_code === selectedValue);
      proValueIndex = productValueIndex.toString();
    }

    const selectedProductObj = this.partnerProductArray[productValueIndex];
    console.log(selectedProductObj)
    console.log(this.partnerProductArray)
    console.log(this.partnerProductArray[productValueIndex])
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

      txtChangingRate: new FormControl(''),
      txtIsPriceChange: new FormControl('')

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
    this.shipmentID = data.data.shipment_id;
    for (let x = 0; x < this.changeFeids.length; x++) {
      const or = {
        shipment_id: this.shipmentID,
        product_code: this.changeFeids[x].productCode,
        isPriceChange: 1
      };

      this.shipmentNewService.updateShipmentItemsIsPriceChange(or).subscribe(
        error => {
          this.manageIsPriceUpdateError(error);
        },
      );
    }
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
      this.btnSaveShipmentColor = 'darkblue';
      const payLoard = {
        shipment_id: data.data.shipment_id
      };

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


    this.isPriceChange = 0;
    this.changeFeids = [];
    this.submitShipmentchangeFeids = [];
    this.tableData = [];
    this.shipmentForm.get('txtChangingRate').setValue(0.0);
    this.shipmentForm.get('txtChangingAmount').setValue(0.0);
    this.shipmentForm.get('txtGrossAmount').setValue('');
    this.shipmentForm.get('txtTotalSellerIncome').setValue('');
    this.shipmentForm.get('txtAllQuantity').setValue('');

    /*const productSelect = document.getElementById('SelectedProduct') as HTMLSelectElement;
    productSelect.value = '';*/
  }


  manageIsPriceUpdateError(error) {
    console.log(error);
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

  splitFromTC(productCode: string) {
    if (productCode.includes('_TC')) {
      return productCode.split('_TC')[0]
    } else {
      return productCode;
    }
  }

  ManageSearchProductGet(data) {
    console.log(data)
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
        console.log(this.isOnDemandShipment)
        console.log(this.sharedData)
        for (let i = 0; i < data.data.length; i++) {
          let prodCode = data.data[i].product_code
          if (this.sharedData.some(item => this.splitFromTC(item.productId) === prodCode)) {
            console.log(data.data[i].product_code)
            console.log()
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
          if (!data.data[i].product_code.includes('POD')) {
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
  }

  selectedProduct(code) {
    console.log(this.sharedData)
    if (code.product_code.includes("POD")) {
      this.showPriceChange = false;
    } else {
      this.showPriceChange = true;
    }
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
    console.log(this.productVariationArrayForClothes)

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

    this.changeChangingRate = code.product_variations[0].changing_rate;
    this.changeRate = code.product_variations[0].changing_rate;

    if (this.isOnDemandShipment) {
      this.callingCount += 1
      if (this.callingCount >= this.sharedData.length) {
        this.addToTable();
      }
    }
  }

  submit(x) {

    let payLoard;
    if (x === 1) {

      // change price
      let sellingPrice = (document.getElementById('newSellingPrice') as HTMLInputElement).value;
      let changingRate = (document.getElementById('initialRate') as HTMLInputElement).value;

      if (sellingPrice === '' && changingRate === this.changeChangingRate.toString()) {
        Swal.fire(
          'No Changes to Submit!',
          '',
          'info'
        );
        return;
      }

      if (sellingPrice === '') {
        sellingPrice = this.changeSellingPrice;
      }

      payLoard = {
        newSellingPrice: sellingPrice,
        productCode: this.changeProCode,
        vendor_code: this.changeVendor,
        newChangingRate: changingRate
      };
      this.priceChangeService.changeSellingPrice(payLoard).subscribe(
        data => this.managechangeSellingPrice(data),
        error => this.manageUserError(error)
      );
    } else {

      Swal.fire({
        title: 'Before proceeding, please ensure the following:',
        html:
          '<div style="text-align: left;">' +
          '<p style="margin-bottom: 10px; margin-left: 20px; font-size: 15px;">1. The package has been wrapped carefully to prevent any damages during transit.</p>' +
          '<p style="margin-bottom: 10px; margin-left: 20px; font-size: 15px;">2. The bar-code has been securely pasted on each package separately for proper tracking.</p>' +
          '<p style="font-weight: bold; margin-left: 20px; font-size: 15px;">Have you completed these steps ?</p>' +
          '</div>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Not yet',
        customClass: {
          popup: 'swal-popup',
        },
      }).then((result) => {

        if (result.isConfirmed) {

          // add shipment
          if (this.isPriceChange == 1) {

            // save data to field edit
            for (let i = 0; i < this.changeFeids.length; i++) {
              payLoard = {
                referenceId: this.changeFeids[i].productCode,
                type: 'PRODUCT_PRICE',
                sub_type: 'product_price',
                comment: 'PRODUCT_PRICE',
                requestedBy: this.changeVendor,
                saveType: 'shipment',
                userId: sessionStorage.getItem('userId'),
                data: [
                  {
                    column_name: 'cost_price',
                    old_value: this.changeFeids[i].oldCostPrice,
                    new_value: this.changeFeids[i].newCostPrice,
                    call_name: 'cost_price',
                  },
                  {
                    column_name: 'changing_rate',
                    old_value: this.changeFeids[i].oldChangingRate,
                    new_value: this.changeFeids[i].newChangingRate,
                    call_name: 'changing_rate',
                  },
                  {
                    column_name: 'selling_price',
                    old_value: this.changeFeids[i].oldSellingPrice,
                    new_value: this.changeFeids[i].newSellingPrice,
                    call_name: 'selling_price',
                  }
                ]
              };
              this.submitShipmentchangeFeids.push(payLoard);
            }

            payLoard = {
              dataSet: this.submitShipmentchangeFeids
            };

            this.productService.editShipmentField(payLoard).subscribe(
              data => this.manageEditField(data),
              error => this.manageUserError(error)
            );

          } else {
            this.hitShipment();
          }
        } else {

        }
      });
    }
  }

  manageEditField(data) {
    if (data.status_code === 200) {
      this.hitShipment();
    }
  }

  updateChangingRate() {
    const inputElement = (document.getElementById('initialRate') as HTMLInputElement);

    if (this.changeChangingRate > parseFloat(inputElement.value)) {
      Swal.fire(
        'You are Not Allowed to Degrade the Changing Rate.',
        'Only Increasing is Allowed',
        'warning'
      );
      (document.getElementById('initialRate') as HTMLInputElement).value = this.changeChangingRate;
      return;
    }
  }

  popup() {
    this.modalRef = this.modal.open(this.changePricePopup, {centered: true});
    (document.getElementById('initialRate') as HTMLInputElement).value = this.changeChangingRate;
  }

  closePopup() {
    this.modalRef.close();
  }

  async addToTable() {
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
    } else if (this.quantityMap.size === 0) {
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
          let insertTabelData


          if (this.sharedData[i].productId.includes('_TC')) {
            console.log(this.productVariationArrayForClothes)
            const payload = {variation_code: this.sharedData[i].productId}
            let color: string;
            let size: string;
            let variationCode: string;
            await this.productService.getProductVariation(payload).toPromise().then(
              data => {
                console.log(data)
                color = data.data.color;
                size = data.data.size;
                variationCode = data.data.variation_code

                console.log(variationCode)
                insertTabelData = {
                  product_code: this.sharedData[i].productId,
                  product_name: tempProductName,

                  cost_price: this.sharedData[i].costPrice,
                  quantity: this.sharedData[i].size,
                  changing_amount: dataForm.txtChangingAmount,
                  changing_rate: this.sharedData[i].changingRate,
                  selling_price: this.sharedData[i].sellingPrice,

                  seller_income: sellerIncome.toString(),
                  amount: grossAmount.toString(),
                  color,
                  size,
                  variationCode
                };
              }
            )


          } else {
            const payload = {product_code: this.sharedData[i].productId}
            let variationCode: string;
            await this.productService.getSelecedProductByEdit(payload).toPromise().then(
              data => {
                variationCode = data.data.product.productVariation[0].variation_code
              });

            insertTabelData = {
              product_code: this.sharedData[i].productId,
              product_name: tempProductName,

              cost_price: this.sharedData[i].costPrice,
              quantity: this.sharedData[i].size,
              changing_amount: dataForm.txtChangingAmount,
              changing_rate: this.sharedData[i].changingRate,
              selling_price: this.sharedData[i].sellingPrice,

              seller_income: sellerIncome.toString(),
              amount: grossAmount.toString(),
              color: this.productVariationArrayForClothes[0].color,
              size: this.productVariationArrayForClothes[0].size,
              variationCode,
            };
          }


          this.tableData.push(insertTabelData);
          console.log(insertTabelData)

          this.quantityMap.set(i, '0');
        }

      } else {
        for (let i = 0; i < this.productVariationArrayForClothes.length; i++) {
          this.allQty += parseInt(this.quantityMap.get(i));
          const sellerIncome = parseInt(dataForm.txtCostPrice) * parseInt(this.quantityMap.get(i));
          const grossAmount = parseInt(dataForm.txtSellingPrice) * parseInt(this.quantityMap.get(i));
          const tempProductName = dataForm.txtProductName.concat('-').concat(getColorWord(this.productVariationArrayForClothes[i].color)).concat(this.productVariationArrayForClothes[i].size);

          this.isProductExist = false;
          console.log('AAA : ' + this.tableData)
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

              // add priceChnage Data
              if (this.priceChangeClick) {
                this.isPriceChange = 1;
                if (this.passChangePriceToAddTable) {
                  const or = {
                    newSellingPrice: this.passChangePriceToAddTable.newSellingPrice,
                    newCostPrice: this.passChangePriceToAddTable.newCostPrice,
                    oldSellingPrice: this.passChangePriceToAddTable.oldSellingPrice,
                    oldCostPrice: this.passChangePriceToAddTable.oldCostPrice,
                    productCode: this.passChangePriceToAddTable.productCode,
                    oldChangingRate: this.passChangePriceToAddTable.oldChangingRate,
                    newChangingRate: this.passChangePriceToAddTable.newChangingRate

                  };
                  this.changeFeids.push(or);
                }
              }
            }
          } else {
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
    this.priceChangeClick = false;
    this.showPriceChange = false;
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

    if (this.changeFeids.length > 0) {
      const filteredArray = this.changeFeids.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(this.tableData[index].product_code.toLowerCase())
        )
      );

      if (filteredArray.length > 0) {
        this.changeFeids = this.changeFeids.filter(item =>
          !filteredArray.some(filteredItem =>
            Object.values(filteredItem).every(filteredValue =>
              Object.values(item).includes(filteredValue)
            )
          )
        );
      }

      this.tableData.splice(index, 1);
      this.geAllQtyAndGrossAmount();
    } else {
      this.tableData.splice(index, 1);
      this.geAllQtyAndGrossAmount();
    }
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
      this.passChangePriceToAddTable = data.data;
      this.modalRef.close();
      Swal.fire(
        'Good Job...!',
        data.message,
        'success'
      );
      this.shipmentForm = new FormGroup({

        txtCostPrice: new FormControl(data.data.newCostPrice),
        txtSellingPrice: new FormControl(data.data.newSellingPrice),
        txtProductCode: new FormControl(data.data.productCode),
        txtProductName: new FormControl(data.data.productName)
      });
      this.priceChangeClick = true;
    }
  }

  manageUserError(error) {
    this.modalRef.close();
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.error.message,
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

  printQRCode() {
    this.isBtnSaveDisabled = false;
    this.btnSaveShipmentColor = 'darkblue';
    const printArr = [];

    const generateQRCode = (item, variationCodeP) => {
      const variationCode = item.variationCode !== variationCodeP ? item.variationCode : '';

      return this.orderService.generateQRCode(variationCode, '').toPromise().then(data => {
        const qrImage = 'data:image/png;base64,' + data.data;
        return {vCode: variationCode, quantity: item.quantity, qrImage};
      });
    };

    const printPromises = this.tableData.reduce(async (previousPromise, item, index) => {
      const printData = await previousPromise;
      const variationCodeP = index > 0 ? this.tableData[index - 1].variationCode : '';

      const qrPrintData = await generateQRCode(item, variationCodeP);
      printArr.push(qrPrintData);

      return printArr;
    }, Promise.resolve());

    printPromises.then(() => {
      this.printQR(printArr);
    });
  }

  private printQR(printArr) {
    const popupWin = window.open('', '_blank');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
      <title>Order Details</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
      td tbody{
      display: block;
      }
      .tdblock{
      width: 130px !important;
      }
      .tdtr{
        font-size: 0;
      }

      .tbl{
      display: inline-block;
      vertical-align: top;
      border: solid 1px #000;
      margin: 2px;
      text-align: center;
      width: 130px;
      }

      .tbl tbody{
      display: block;
      width: 100%;
      }

      @media (min-width:701px) and (max-width:840px) {
      .tbl{
      width: 105px !important;
      }

      .td{
      font-size: 10px !important;
      }

      }
      </style>

      </head>
      <body onload="window.print(); window.onafterprint=function(){window.close()}">
        ${this.printPCode(printArr)}
      </body>
    </html>`
    );
    popupWin.document.close();
  }

  private printPCode(printArr) {
    const businessName = sessionStorage.getItem('businessName');
    const vendorCode = sessionStorage.getItem('partnerId');
    return printArr.map(({vCode, quantity, qrImage}) => `
    <table style="text-align: center; padding-top:7px; width:100%; font-size: 20px; font-weight: bold;">
      <tr>
        <td style="text-align: center;  display:inline-block; vertical-align: top; border: 1px solid #ddd;">${vCode}</td>
      </tr>
    </table>
    ${this.generateTableRows(vCode, quantity, qrImage, businessName, vendorCode)}`
    ).join('');
  }

  private generateTableRows(variationCode, qty, qrImage, businessName, vendorCode) {
    return Array.from({length: qty}, (_, col) => {
      const count = col + 1;
      return count <= qty ? `
          <table class="tbl">
            <tr style="display: block">
              <td colspan="" style="margin-top: 20px; text-align: center; display: block; margin: 0 auto">
                <img src=" ${qrImage} " style="width: 100%; height: auto; max-width: 70px" alt="QR Code">
              </td>
            </tr>
            <tr style="display: block">
              <td style="padding-left: 5px; padding-right: 5px; text-align: left; font-size: 10px;  display: block; text-align: center; margin-bottom: 5px"> ${variationCode} </td>
              <td style="padding-left: 5px; padding-right: 5px;  font-size: 10px;  display: block; text-align: center; margin-bottom: 5px"> ${vendorCode} </td>
            </tr>
            <tr style="display: block">
              <td  style="padding-left: 5px; padding-right: 5px;  font-size: 10px; display: block; text-align: center; margin-bottom: 5px"> ${businessName} </td>
            </tr>
          </table>` : '';
    }).join('');
  }
}
