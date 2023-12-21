import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../shared/service/order.service';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../../environments/environment.prod';
import {ProductService} from '../../../shared/service/product.service';
import {OrderShareService} from '../../../shared/service/order-share.service';
import {NgbCollapseModule, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {error} from 'protractor';
import {OrderMethods} from '../order-methods';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss'],
})
export class ViewOrdersComponent implements OnInit {
  public id = '';
  public part_code = '';
  public orderControle: FormGroup;
  public cartsnapshotArr = [];
  public imagePathURI = environment.imageURIENV;
  public images = '';
  public prodCode = '';
  public size = 0;
  public resp = {
    costPrice: 0,
    sellingPrice: 0
  };
  isCollapsed: boolean[] = [];
  variationTheme = '';
  variationColor = '';
  variationSize = null;
  odProduct = false;
  isReadytoShip = false;
  isInProcess = false;
  isPartner = false;
  imageUrl: string;
  modalRef: any;
  @ViewChild('imagePopup') imagePopup: any;

  public deliveryDate = '';
  public purchaseApprovalID = '';
  public orderRefNo = '';
  public orderDescription = '';
  public city = '';
  public productCode = '';
  public proCode = '';
  public productName = '';
  public image = '';
  public vendorName = '';
  public btnSaveShipmentColor: string = 'darkblue';
  variationArr = [];

  constructor(private _Activatedroute: ActivatedRoute, private orderService: OrderService, private router: Router,
              private productService: ProductService, private order: OrderShareService, private modal: NgbModal, private orderMethods: OrderMethods) {
    this._Activatedroute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.part_code = params.get('part');
      // this.getshipmentById(params.get('id'));
      this.getSelectedOrder();
      this.createFormConteolerForShipment();
    });
  }

  ngOnInit(): void {
    this.isPartner = sessionStorage.getItem('userRole') === 'ROLE_PARTNER';
    this.cartsnapshotArr.forEach(() => {
      this.isCollapsed.push(true)

    });
  }

  getSelectedOrder() {
    this.orderService.getSelectedOrder(this.id, this.part_code).subscribe(
      data => this.manageSingleOrder(data),
    );
  }

  createFormConteolerForShipment() {
    this.orderControle = new FormGroup({
      txtorderId: new FormControl(''),
      txtEmali: new FormControl(''),
      txtStatus: new FormControl(''),
      txtPnref: new FormControl(''),
      txtCountry: new FormControl(''),
      txtOrderDate: new FormControl(''),
      txtDeliveryDate: new FormControl(''),
      txtShipTim: new FormControl(''),
    });
  }

  async manageSingleOrder(data) {
    this.cartsnapshotArr = [];

    this.vendorName = data.data.vendorName;
    this.deliveryDate = data.data.delivery_date;
    this.purchaseApprovalID = data.data.purchase_approval_id.split('-')[1];
    if (this.purchaseApprovalID === '' || this.purchaseApprovalID === null || this.purchaseApprovalID === undefined) {
      this.purchaseApprovalID = '';
    }
    this.orderRefNo = data.data.orderRefNo;
    this.orderDescription = data.data.description.toUpperCase();
    const inputString = this.orderDescription;
    const cityRegex = /\(City\s*-\s*([^\s<)]+)/i;
    const match = inputString.match(cityRegex);
    this.city = match ? match[1] : 'NA';

    let displayStatus = '';
    displayStatus = data.data.status;
    if (data.data.status === 'IN PROCESS') {
      displayStatus = this.orderMethods.findRealStatus(data.data.shipmentStatus, data.data.status, data.data.purchase_approval_id);
    }
    if (displayStatus === 'READY TO SHIP') {
      this.isReadytoShip = true;
    }
    if (displayStatus === 'IN PROCESS') {
      this.isInProcess = true;
      this.btnSaveShipmentColor = '#6f6f6f';
    }

    this.orderControle.get('txtorderId').setValue(data.data.id);
    this.orderControle.get('txtStatus').setValue(displayStatus);
    this.orderControle.get('txtPnref').setValue(data.data.pnref);
    this.orderControle.get('txtCountry').setValue(data.data.country);
    this.orderControle.get('txtOrderDate').setValue(data.data.order_date);
    this.orderControle.get('txtDeliveryDate').setValue(data.data.delivery_date);
    this.orderControle.get('txtShipTim').setValue(data.data.ship_time);
    if (data.data.cartsnapshot != null) {
      for (let i = 0; i < data.data.cartsnapshot.length; i++) {

        let productCode = data.data.cartsnapshot[i].productID.toLowerCase();
        if (productCode.toLowerCase().includes('ef_pc_')) {
          productCode = productCode.toLowerCase().replace('ef_pc_', '');
        } else if (productCode.toLowerCase().includes('ef_hs_')) {
          productCode = productCode.toLowerCase().replace('EF_HS_', '');
        }
        this.prodCode = productCode.toUpperCase();

        if (this.prodCode.includes('POD')) {
          this.odProduct = true;
        }

        await this.getImage(productCode.toUpperCase());
        const image = this.imagePathURI + this.images;
        this.size = data.data.cartsnapshot[i].size;
        if (this.cartsnapshotArr.some(product => product.productId === data.data.cartsnapshot[i].productID)) {
          const existingIndex = this.cartsnapshotArr.findIndex(product => product.productId === data.data.cartsnapshot[i].productID);
          const existingQty = this.cartsnapshotArr[existingIndex].size;
          this.cartsnapshotArr[existingIndex].size = existingQty + data.data.cartsnapshot[i].size;
          continue;
        }
        const or = {
          image: image,
          name: data.data.cartsnapshot[i].name,
          productId: data.data.cartsnapshot[i].productID,
          size: data.data.cartsnapshot[i].size,
          orderRef: data.data.pnref
        };
        this.cartsnapshotArr.push(or);
      }
      this.cartsnapshotArr.forEach(() => {
        this.variationArr.push({variationTheme: 'none', variationSize: '', variationColor: ''})
      });
    }
  }

  async getImage(proCode: string) {
    let imgProductCode: string = proCode;
    if (imgProductCode.includes('_TC')) {
      imgProductCode = imgProductCode.split('_TC')[0];
    }
    const payload = {
      product_code: imgProductCode
    };
    try {
      const data = await this.productService.getImageForEdit(payload).toPromise();
      this.manageImages(data);
    } catch (error) {
    }
  }

  manageImages(data) {
    if (data.data !== null) {
      this.images = data.data[0].split('/product')[1];
    } else {
      return;
    }
  }

  backToLIst() {
    let url = 'orders/list-orders';
    this.router.navigate([url]);
  }

  readyToShip() {

    Swal.fire({
      title: 'Before proceeding, please ensure the following:',
      html:
        '<div>' +
        '<p style="text-align: left; margin-bottom: 10px; margin-left: 20px; font-size: 15px;">1. The package has been wrapped carefully to prevent any damages during transit.</p>' +
        '<p style="text-align: left; margin-bottom: 10px; margin-left: 20px; font-size: 15px;">2. The bar-code has been securely pasted on each package separately for proper tracking.</p>' +
        '<p style="text-align: center"><img src="../../../assets/images/od_qr.png" style="width:50%; height: 30%;"></p>' +
        '<p style="text-align: left; font-weight: bold; margin-left: 20px; font-size: 15px;">Have you completed these steps ?</p>' +
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
        const data = {
          productCode: this.prodCode
        };
        const shipmentArr = [];
        const dataa = [];
        const promises = [];
        this.cartsnapshotArr.forEach((item, i) => {

          let productCode = item.productId.toLowerCase();
          if (productCode.toLowerCase().includes('ef_pc_')) {
            productCode = productCode.replace('ef_pc_', '');
          } else if (productCode.toLowerCase().includes('ef_hs_')) {
            productCode = productCode.replace('ef_hs_', '');
          }

          const payload = {
            product_code: productCode.toUpperCase()
          };
          // Create a promise for each product
          const promise = new Promise<void>((resolve, reject) => {
            this.productService.getProductPrices(payload).subscribe(
              datas => {
                this.manageData(datas, i);

                resolve();
              },
              error => {
                reject(error);
              }
            );
          });
          promises.push(promise);
        });

        // Wait for all promises to resolve before proceeding
        Promise.all(promises)
          .then(() => {

            // const orr = {
            //   image: 'image',
            //   name: 'item.name',
            //   productId: 'CLOT0V149P00010',
            //   size: 1,
            //   sellingPrice: 11,
            //   costPrice: 11
            // };
            //
            // shipmentArr.push(orr);
            //
            // const orr2 = {
            //   image: 'image2',
            //   name: 'item.name2',
            //   productId: 'AUTO0V18POD00002',
            //   size: 2,
            //   sellingPrice: 22,
            //   costPrice: 22
            // };
            //
            // shipmentArr.push(orr2);
            for (const item of this.cartsnapshotArr) {
              let productCode = item.productId.toLowerCase();
              if (productCode.toLowerCase().includes('ef_pc_')) {
                productCode = productCode.replace('ef_pc_', '');
              } else if (productCode.toLowerCase().includes('ef_hs_')) {
                productCode = productCode.replace('ef_hs_', '');
              }
              productCode = productCode.toUpperCase();
              const orr = {
                image: 'image',
                name: item.name,
                productId: productCode,
                size: item.size,
                sellingPrice: item.sellingPrice,
                costPrice: item.costPrice,
                changingRate: item.changingRate,
                orderRef: item.orderRef
              };
              shipmentArr.push(orr);
            }
            this.order.setDataArray(shipmentArr);
            const url = 'shipment/add-shipment';
            this.router.navigate([url], {queryParams: data});
          })
          .catch(error => {
            // Handle the error here
          });
      } else {

      }
    });
  }

  manageData(data, i) {
    this.cartsnapshotArr[i].sellingPrice = data.data.SellingPrice;
    this.cartsnapshotArr[i].costPrice = data.data.costPrice;
    this.cartsnapshotArr[i].changingRate = data.data.changingRate;
  }

  popupImage(url: string) {
    this.imageUrl = url;
    this.openPopup();
  }

  openPopup() {
    this.modalRef = this.modal.open(this.imagePopup, {centered: true});
  }

  closePopup() {
    this.modalRef.close();
    this.imageUrl = undefined;
  }

  isVariation(productCode: string) {
    return productCode.includes('_TC');
  }

  toggleAllRows(): void {
    this.isCollapsed.forEach((value, index) => this.isCollapsed[index] = false);
  }

  getVariationColor(variationCode: string, id) {

    if (variationCode.includes('EF_PC_')) {
      variationCode = variationCode.replace('EF_PC_', '');
    } else if (variationCode.toLowerCase().includes('ef_hs_')) {
      variationCode = variationCode.replace('ef_hs_', '');
    }
    const newVariationCode = variationCode.toUpperCase();
    const payload = {
      variation_code: newVariationCode
    };
    this.productService.getProductVariation(payload).subscribe(
      data => {
        let variationTheme: any;
        let variationSize;
        let variationColor;

        if (data.data === null){
          variationTheme = 'None'
          variationSize = null
          variationColor = null

        } else {
          variationTheme = data.data.variation_theme;
          if (data.data.size !== null || data.data.size !== '') {
            variationSize = data.data.size;
          }
          this.variationSize = data.data.size;

          if (variationTheme === 'color') {
            variationColor = data.data.color;
          }
        }


        this.variationArr[id].variationTheme = variationTheme;
        this.variationArr[id].variationSize = variationSize;
        this.variationArr[id].variationColor = variationColor;

        this.toggleCollapse(id)
      }
    );
  }

  toggleCollapse(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  PrintQR(productCode) {
    if (this.cartsnapshotArr != null) {
      for (let i = 0; i < this.cartsnapshotArr.length; i++) {
        if (productCode === this.cartsnapshotArr[i].productId) {
          this.productName = this.cartsnapshotArr[i].name;
          // tslint:disable-next-line:no-shadowed-variable
          const productCode = this.cartsnapshotArr[i].productId;
          this.proCode = productCode.toUpperCase();
        }
      }
    }
    this.orderService.generateQRCode(this.proCode, this.orderRefNo).subscribe(
      data => {
        this.manageSaveQr(data);
      },
    );
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
    };
    img.src = 'data:image/png;base64,' + data.data;
    this.image = img.src;
    this.PrintQRCode();
  }

  private PrintQRCode() {
    const businessName = sessionStorage.getItem('businessName');
    const popupWin = window.open('', '_blank');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head><title>Order Details</title></head>
        <body onload="window.print();window.onafterprint=function(){window.close()}">
          <table style="padding-right: 100px; padding-left:100px;">
            <tr>
              <td style="text-align: center;">
                <table style="border-collapse: collapse; width: 100%;">
                  <tr>
                    <td colspan="2" style="padding: 10px; padding-left: 20px; text-align: right; font-size: 20px">( ${businessName} ) Delivery Date : ${this.deliveryDate}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 10px; padding-left: 20px; text-align: center; font-size: 40px">${this.purchaseApprovalID}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 10px; padding-left: 20px; text-align: left; font-size: 30px">${this.orderRefNo}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; padding-left: 20px; text-align: left;  font-size: 30px">${this.city}</td>
                  </tr>
                  <tr>
                    <td style="padding-left: 10px; padding-top: 10px; text-align: left; font-size: 20px">${this.proCode}</td>
                    <td style="padding-left: 10px; padding-top: 10px; text-align: left; font-size: 20px">${this.productName}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="margin-top: 20px; text-align: center;"><img src="${this.image}" style="width: 30%; height: 30%;" alt="QR Code"></td>
                  </tr>
                </table>
                </td>
              </tr>
          </table>
        </body>
      </html>`
    );
    popupWin.document.close();
  }
}
