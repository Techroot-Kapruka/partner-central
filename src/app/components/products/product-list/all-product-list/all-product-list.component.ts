import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../../shared/service/product.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {environment} from "../../../../../environments/environment.prod";
import Swal from "sweetalert2";
import {CategoryService} from "../../../../shared/service/category.service";
import {OrderService} from "../../../../shared/service/order.service";

@Component({
  selector: 'app-all-product-list',
  templateUrl: './all-product-list.component.html',
  styleUrls: ['./all-product-list.component.scss']
})
export class AllProductListComponent implements OnInit {

  productList: any = [];
  variationProductsList: any = [];
  public productCategoryArray = [];
  public partnerArray = [];
  currentPage = 1;
  totalPages;
  itemRange;
  totalItems;
  title = '';
  proCode = '';
  status = '';
  businessName = '';
  itemGroup = '';
  userRole = '';

  productTitle;
  productCode;
  isCategoryList : boolean = true;
  isEmptyProducts: boolean = false;

  outButton: boolean = false;
  addStockButton: boolean = false;

  imageUrl: any;
  modalRef: any;
  selectItemGroup: any;
  selectVendor: any;
  loading:boolean =false;

  public addStockAmount: number;

  public imagePathURI = environment.imageURIENV;
  public imagedefaultPathURI = '';

  @ViewChild('imagePopup') imagePopup: ElementRef;
  @ViewChild('variationAddStockPopup') variationAddStockPopup: ElementRef;

  constructor(private orderService: OrderService, private productService: ProductService, private router: Router, private modal: NgbModal, private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.getProducts(0);
    this.getAllCategory();
    this.getPartner();
  }

  getProducts(pageNo) {
    this.userRole = sessionStorage.getItem('userRole');
    const userId = sessionStorage.getItem('userId');
    const selectElement = document.getElementById('statusSelect') as HTMLSelectElement;
    // const categorySelect = document.getElementById('categorySelect') as HTMLSelectElement;
    // this.itemGroup = categorySelect.value;
    this.status = selectElement.value;

    if (!this.status) {
      this.status = '0';
    }
    const paylord = {
      userUid: userId,
      role: this.userRole
    };
    this.loading = true;
    this.productService.getProductList(pageNo, this.title, this.status, this.proCode, this.businessName, this.itemGroup, paylord).subscribe(
      data => this.manageProductListData(data),
      error => this.errorProductListData(error)
    );

  }

  getAllCategory() {
    const sendData = {
      code: 'c'
    };

    this.categoryService.getAllCategory(sendData).subscribe(
      data => this.setAllCategory(data),
    );
  }
  changedProduct(selectdValue){
    this.itemGroup = selectdValue;
  }

  changedVendor(selectdValue){
    this.businessName = selectdValue;
  }
  setAllCategory(data) {
    this.productCategoryArray = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        const or = {
          value: data.data[i].name,
          label: data.data[i].name
        };
        this.productCategoryArray.push(or);
      }
      this.selectItemGroup = 'Item Group';
    }
  }

  errorProductListData(error){
    this.loading = false;
  }

  private manageProductListData(data) {
    this.productList = [];
    const keyValuePairs = data.message.slice(1, -1).split(',');
    const resultObject = {};
    keyValuePairs.forEach(pair => {
      const [key, value] = pair.split('=');
      resultObject[key.trim()] = value.trim();
    });
    this.totalPages = resultObject['totalPages'];
    this.itemRange = resultObject['itemRange'];
    this.totalItems = resultObject['totalItems'];

    for (let i = 0; i < data.data.length; i++) {
      const payloard = {
        product_code: data.data[i].productCode,
        path: data.data[i].path,
        in_stock: data.data[i].in_stock,
        productType: data.data[i].productType,
        category_code: data.data[i].category_code,
        create_date_time: data.data[i].create_date_time,
        update_date_time: data.data[i].update_date_time,
        title: data.data[i].title,
        vendor: data.data[i].vendor,
        item_group: data.data[i].item_group,
        is_active: data.data[i].is_active,
        partnerUid: data.data[i].partnerUid,
        badge: data.data[i].status === 'Manual Out'
          ? 'badge-warning'
          : data.data[i].status === 'Suspended'
            ? 'badge-danger'
            : data.data[i].status === 'Active'
              ? 'badge-primary'
              : data.data[i].status === 'Out of Stock'
                ? 'badge-secondary'
                : 'badge-custom-color',
        element: data.data[i].status,
        image1: data.data[i].image1.split('/product')[1],
        main_category_code: data.data[i].main_category_code,
        delete: data.data[i].buttons.DELETE,
        activate: data.data[i].buttons.ACTIVATE,
        add_stock: data.data[i].buttons.ADD_STOCK,
        in: data.data[i].buttons.IN,
        edit: data.data[i].buttons.EDIT,
        view: data.data[i].buttons.VIEW,
        out: data.data[i].buttons.OUT
      };
      this.productList.push(payloard);
    }
    // console.log(this.productList);
    this.loading = false;
    if (this.productList.length === 0) {
      this.isEmptyProducts = true;
    } else {
      this.isEmptyProducts = false;
    }
  }

  getPartner(): void {
    if (this.userRole !== 'ROLE_PARTNER') {
      this.orderService.getPartnerAll().subscribe(
        data => this.setPartner(data),
      );
    }
  }

  setPartner(data) {
    this.partnerArray = [];
    let cr = {};
    if (data.data != null) {
      const bussinessPartnerLength = data.data.length;
      for (let i = 0; i < bussinessPartnerLength; i++) {
        cr = {
          label: data.data[i].businessName,
          value: data.data[i].businessName
        };
        this.partnerArray.push(cr);
      }
      this.selectVendor = 'Vendor';
    }
  }
  popUpImage(data) {
    this.imageUrl = this.imagePathURI + data.image1;
    this.modalRef = this.modal.open(this.imagePopup, {centered: true});
  }

  loadPage(event) {
    window.open('https://www.kapruka.com/buyonline/' + event.title.replace(/\s+/g, '-').toLowerCase() + '/kid/' + 'ef_pc_' + event.product_code, '_blank');
  }

  closePopup() {
    this.modalRef.close();
    this.imageUrl = undefined;
  }

  onImageError(event: any): void {
    this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
    event.target.src = this.imagedefaultPathURI + '/1.jpg';
  }

  onPageChange(event, type: number) {
    if (type === 2) {
      // refreshing
      this.title = '';
      this.businessName = '';
      this.proCode = '';
      this.itemGroup = '';
      this.businessName = '';
      this.getAllCategory();
      this.getPartner();
      const selectElement = document.getElementById('statusSelect') as HTMLSelectElement;
      selectElement.value = '';
    }
    this.currentPage = event;
    this.getProducts(event - 1);
  }

  search() {
    this.currentPage = 1;
    this.getProducts(0);
  }

  clickButton(data, x) {
    const productCode = data.product_code;
    switch (x) {
      case 1:
        // view
        const url1 = 'products/digital/view-product/' + productCode;
        this.router.navigate([url1]);
        break;
      case 2:
        // edit
        const url2 = 'products/digital/digital-edit-product/' + productCode;
        this.router.navigate([url2]);
        break;
      case 3:
        // delete
        const proCode = 'productList-Delete-' + productCode;
        this.router.navigate(['declined-product/' + proCode]);
        break;
      case 4:
        // out
        this.productCode = data.product_code;
        this.productTitle = data.title;

        this.outButton = true;
        this.addStockButton = false;

        const proCode2 = 'productList-Edit-' + productCode;

        this.productService.checkIsVariationPresent(data.product_code).subscribe(
          data => {
            if (data.data[0].variation_theme === 'None') {
              console.log('No Vari')
              this.router.navigate(['declined-product/' + proCode2]);
            } else {
              this.variationModelPopup(data.data);
            }
          },
        );


        break;
      case 5:
        // Activate
        console.log(x);
        break;
      case 6:
        // IN
        Swal.fire({
          title: 'Are You Sure?',
          text: 'This action will make your product Active in Kapruka Website.',
          icon: 'info',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Yes',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            const payLoad = {
              product_code: productCode,
              updatedBy: sessionStorage.getItem('userId')
            };
            this.productService.updateProductStock(payLoad).subscribe(
              data => {
                Swal.fire({
                  title: 'Success',
                  text: '',
                  icon: 'success',
                });
                this.getProducts(this.currentPage - 1);
              }
            );
          }
        });
        break;
      case 7:
        // Add stock ON DEMAND
        this.productCode = data.product_code;
        this.productTitle = data.title;
        this.outButton = false;
        this.addStockButton = true;
        this.productService.checkIsVariationPresent(data.product_code).subscribe(
          data => {
            if (data.data[0].variation_theme === 'None') {
              this.UpdateVirtualStocks(data.data[0], 1);
            } else {
              this.variationModelPopup(data.data);
            }
          },
        );
        break;
      default:
        console.log('Invalid');
        break;
    }
  }

  variationModelPopup(data) {
    this.variationProductsList = data;
    this.modalRef = this.modal.open(this.variationAddStockPopup, {centered: true});
  }

  UpdateVirtualStocks(event, x) {
    Swal.fire({
      title: 'Add Stock',
      text: '',
      icon: 'info',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Add Stock',
      allowOutsideClick: false,
      input: 'number',
      inputPlaceholder: 'Add Stock',
      inputAttributes: {
        style: 'width: 50%; margin: 5px auto; display: block;'
      },
      inputValidator: (value) => {
        this.addStockAmount = parseInt(value);
        if (!value) {
          return 'Please enter a valid stock value';
        }
        if (parseInt(value) + event.in_stock < 0) {
          return 'Add Stock Must Be More Than In Stock';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const payloard = {
          productCode: event.pro_Code,
          vendor: sessionStorage.getItem('partnerId'),
          quantity: this.addStockAmount,
          variationTheme: event.variation_theme,
          variationId: event.id
        };
        this.productService.updateStock(payloard).subscribe(
          data => this.manageUpdateStock(data, x),
          error => this.manageUpdateError(error)
        );
      }
    });
  }
  setOutStock(event) {
    console.log(event)
    this.closePopup();
    const proCode2 = 'productList-Edit-' + event.variation_code;
    this.router.navigate(['declined-product/' + proCode2]);
  }

  manageUpdateStock(data, x) {
    Swal.fire({
      title: 'Good job!',
      text: data.message,
      icon: 'success',
      allowOutsideClick: false
    }).then(() => {
      if (x === 2) {
        this.productService.checkIsVariationPresent(data.data.productCode).subscribe(
          variationData => {
            this.closePopup();
            this.variationModelPopup(variationData.data);
          },
        );
      }
      this.onPageChange(this.currentPage, 1);
    });
  }

  manageUpdateError(data) {
    Swal.fire(
      'error!',
      data.error.message,
      'error'
    ).then(() => {
      this.onPageChange(this.currentPage, 1);
    });
  }
}
