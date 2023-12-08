import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../shared/service/order.service';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../../environments/environment.prod';
import {ProductService} from '../../../shared/service/product.service';
import {OrderShareService} from '../../../shared/service/order-share.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
  public isCollapsed = true;
  variationTheme = '';
  variationColor = '';
  variationSize = null;
  odProduct = false;
  isPartner = false;
  imageUrl: string;
  modalRef: any;
  @ViewChild('imagePopup') imagePopup: any;

  constructor(private _Activatedroute: ActivatedRoute, private orderService: OrderService, private router: Router, private productService: ProductService, private order: OrderShareService, private modal: NgbModal) {
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
    this.orderControle.get('txtorderId').setValue(data.data.id);
    this.orderControle.get('txtStatus').setValue(data.data.status);
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
        if (this.cartsnapshotArr.some(product => product.productId === data.data.cartsnapshot[i].productID)){
          const existingIndex = this.cartsnapshotArr.findIndex(product => product.productId === data.data.cartsnapshot[i].productID)
          const existingQty = this.cartsnapshotArr[existingIndex].size
          this.cartsnapshotArr[existingIndex].size = existingQty + data.data.cartsnapshot[i].size
          console.log('k')
          continue
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
    }
  }

  async getImage(proCode: string) {
    let imgProductCode: string = proCode;
    if (imgProductCode.includes('_TC')) {
      imgProductCode = imgProductCode.split('_TC')[0];
    }
    console.log(imgProductCode);
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
    const data = {
      productCode: this.prodCode
    };
    let shipmentArr = [];
    let dataa = [];
    const promises = [];
    this.cartsnapshotArr.forEach((item, i) => {
      console.log(item)

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
            this.manageData(datas, i)

            resolve();
          },
          error => {
            reject(error);
          }
        );
      });
      promises.push(promise);
    })

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
        console.log(this.resp)
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
          console.log(orr)
          shipmentArr.push(orr);
        }
        this.order.setDataArray(shipmentArr);
        const url = 'shipment/add-shipment';
        this.router.navigate([url], {queryParams: data});
      })
      .catch(error => {
        // Handle the error here
      });
  }

  manageData(data, i) {
    console.log(data)
    this.cartsnapshotArr[i].sellingPrice = data.data.SellingPrice
    this.cartsnapshotArr[i].costPrice = data.data.costPrice
    this.cartsnapshotArr[i].changingRate = data.data.changingRate
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

  getVariationColor(variationCode: string) {
    if (variationCode.includes('EF_PC_')) {
      variationCode = variationCode.replace('EF_PC_', '');
    } else if (variationCode.toLowerCase().includes('ef_hs_')) {
      variationCode = variationCode.replace('ef_hs_', '');
    }
    const newVariationCode = variationCode.toUpperCase();
    console.log(newVariationCode);
    const payload = {
      variation_code: newVariationCode
    };
    this.productService.getProductVariation(payload).subscribe(
      data => {
        this.variationTheme = data.data.variation_theme;
        if (data.data.size !== null || data.data.size !== '') {
          this.variationSize = data.data.size;
        }
        this.variationSize = data.data.size;
        if (this.variationTheme === 'color') {
          this.variationColor = data.data.color;
        }
        this.isCollapsed = !this.isCollapsed;
      }
    );
  }


}
