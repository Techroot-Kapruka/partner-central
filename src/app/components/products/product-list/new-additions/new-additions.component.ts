import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../../shared/service/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PendingStockAllocationShareService} from "../../../../shared/service/pending-stock-allocation-share.service";
import {NgbModal, NgbTabChangeEvent, NgbTabset} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../../shared/auth/auth.service";
import Swal from 'sweetalert2';
import {environment} from "../../../../../environments/environment.prod";

@Component({
  selector: 'app-new-additions',
  templateUrl: './new-additions.component.html',
  styleUrls: ['./new-additions.component.scss']
})
export class NewAdditionsComponent implements OnInit {

  public list_pages = [];
  public pending_stock_allocation = [];
  public list_outof_stock = [];
  public list_suspend = [];
  public filterdPendingAllocation: any = [];
  public filteredPendingProducts: any = [];
  public filteredPendingQC: any = [];
  public filteredOnDemandProduct: any = [];
  public nonActiveProductsArray = [];
  public approvalPartnerProductList = [];
  public selected = [];
  public consignmentProducts = [];
  public product = [];
  public paginatedPendingItems = [];
  public paginatedPendingQC = [];
  public paginatedPendingStockAllow = [];
  public filtereDpendingStockByOnDemand = [];

  public headNonActive = [];
  public headNonActivePartner = [];
  public headPendingStockAdmin = [];
  public headPendingStockPartner = [];

  public isAdmin = false;
  public isPartner = false;
  nonActiveAdmin: boolean = false;
  nonActivePartner: boolean = false;
  onDemand: boolean = false;
  pendingStockPartner: boolean = false;
  pendingStockAdmin: boolean = false;

  public oldProductStatus = false;

  public EnablePriceEdit = false;
  public EnableStockEdit = false;

  public startIndex;

  public product_code = '';
  public qrImage = '';
  public unique_code = '';
  public sub_type = '';
  public imagedefaultPathURI = '';
  vstock: number[] = [];


  public imagePathURI = environment.imageURIENV;

  public list_pages2 = 20;
  public virtualstock = 0;
  imageUrl: any;
  modalRef: any;
  oldPrice: any;
  itemCode: any;
  OnDemandsearchInput: any;
  priceChangeVendor: any;
  stillLoading = true;

  page = 0;

  currentPagePA = 1; // Current page
  currentPagePQC = 1; // Current page

  currentPagePendingAllo = 1; // Current page

  totalPages = 0; // Total number of pages
  totalPagesPA = 0; // Total number of pages
  totalPagesPQC = 0; // Total number of pages

  totalPagesPendingAllow = 0; // Total number of pages

  public emptyTableStock = false;
  public emptyTablePendingProduct = false;

  @ViewChild('imagePopup') imagePopup: ElementRef;
  @ViewChild('pricePopup') pricePopup: ElementRef;
  @ViewChild('ondemandTab', {static: true}) onDemandTab: NgbTabset;

  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router, private modal: NgbModal, private authService: AuthService, private pendingStockShare: PendingStockAllocationShareService) {
    this.getAllProduct();
    this.getNonActiveProdcut();
    this.nonActiveProductsByCompanyName();
    this.hideElement();
  }

  ngOnInit(): void {
  }

  hideElement(): void {
    const role = sessionStorage.getItem('userRole');

    if (role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_CATEGORY_MANAGER' || role === 'ROLE_STORES_MANAGER') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    if (role === 'ROLE_PARTNER') {
      this.isPartner = true;
    } else {
      this.isPartner = false;
    }

    if (role === 'ROLE_QA') {
      this.oldProductStatus = false;
    } else {
      this.oldProductStatus = true;
    }
  }

  nonActiveProductsByCompanyName() {
    const busName = sessionStorage.getItem('businessName');
    const categoryID = sessionStorage.getItem('userId');

    this.productService.getnonActiveProduct(busName, categoryID).subscribe(
      data => this.manegeMonActiveProductsByCompanyName(data),
      error => this.errorOrderManage(error)
    );
  }

  onPageChange(page: number, Descrip: string) {
    if (Descrip === 'PendingPro') {
      this.currentPagePA = page;
    } else if (Descrip === 'PendingQC') {
      this.currentPagePQC = page;
    } else if (Descrip === 'PendingStockAllocation') {
      this.currentPagePendingAllo = page;
    }
    this.updateTableData(Descrip);
  }

  updateTableData(Descrip: string) {
    if (Descrip === 'PendingPro') {
      const startIndex = (this.currentPagePA - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;

      if (this.filteredPendingProducts.length > 0) {
        this.paginatedPendingItems = this.filteredPendingProducts.slice(startIndex, endIndex);
      } else {
        this.paginatedPendingItems = this.nonActiveProductsArray.slice(startIndex, endIndex);
      }
    } else if (Descrip === 'PendingQC') {
      const startIndex = (this.currentPagePQC - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;

      if (this.filteredPendingQC.length > 0) {
        this.paginatedPendingQC = this.filteredPendingQC.slice(startIndex, endIndex);
      } else {
        this.paginatedPendingQC = this.approvalPartnerProductList.slice(startIndex, endIndex);
      }
    } else if (Descrip === 'PendingStockAllocation') {
      const startIndex = (this.currentPagePendingAllo - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex
      if (this.filterdPendingAllocation.length > 0) {
        this.paginatedPendingStockAllow = this.filterdPendingAllocation.slice(startIndex, endIndex);
      } else {
        this.paginatedPendingStockAllow = this.pending_stock_allocation.slice(startIndex, endIndex);
      }
    }
  }

  getNonActiveProdcut() {
    const busName = sessionStorage.getItem('businessName');
    const userRole = sessionStorage.getItem('userRole');
    const categoryID = sessionStorage.getItem('userId');

    this.productService.getnonActiveProduct(busName, categoryID).subscribe(
      data => this.manageNonActiveProduct(data),
      error => this.errorOrderManage(error)
    );

  }

  getAllProduct() {
    const busName = sessionStorage.getItem('businessName');
    const userRole = sessionStorage.getItem('userRole');
    const categoryID = sessionStorage.getItem('userId');
    const partnerID = sessionStorage.getItem('partnerId');

    if (partnerID){
      this.getConsignmentProducts();
    }
    this.productService.getPendingStockAllocationList(busName, categoryID).subscribe(
      data => this.getPendingStockAllocationList(data),
    );

  }

  getConsignmentProducts() {
    const payloard = {
      vendor: sessionStorage.getItem('partnerId')
    };
    this.productService.getConsignmentProducts(payloard).subscribe(
      data => this.manageConsignmentProducts(data),
    );
  }

  manageConsignmentProducts(data) {
    this.consignmentProducts = [];
    this.filteredOnDemandProduct = [];
    this.OnDemandsearchInput = '';
    if (data.data != null) {
      if (data.status_code === 200) {
        for (let i = 0; i < data.data.length; i++) {
          this.vstock[i] = null;
          const or = {
            productCode: data.data[i].onDemand_products.product_code,
            title: data.data[i].onDemand_products.title,
            inStock: data.data[i].onDemand_products.in_Stock,
            create_date: data.data[i].onDemand_products.create_date,
            path: data.data[i].category_path,
            image: data.data[i].product_img.split('/product')[1],
            Action: ''
          };
          this.consignmentProducts.push(or);
        }
      }
    }
  }

  getPendingQC() {
    const count = this.approvalPartnerProductList.length;
    this.nonActivePartner=true
    return `Pending New Addition (${count})`;
  }

  PendingStockAllocation() {
    const count = this.pending_stock_allocation.length;
    if(this.isAdmin){
      this.pendingStockAdmin = true;
      this.pendingStockPartner=false;
    }else{
      this.pendingStockAdmin = false;
      this.pendingStockPartner=true;
    }
    return `Pending Stock Allocation (${count})`;
  }

  getPendingApprovalList() {
    const count = this.nonActiveProductsArray.length;
    this.nonActiveAdmin = true;
    return `Pending New Addition (${count})`;
  }

  onImageError(event: any): void {
    this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
    event.target.src = this.imagedefaultPathURI + '/1.jpg';
  }

  manageNonActiveProduct(data) {
    this.nonActiveProductsArray = [];
    this.startIndex = 0;
    if (data.data == null) {
      this.stopLoading();
    } else {
      if (data.status_code === 200) {
        for (let i = 0; i < data.data.length; i++) {
          const or = {
            image: (data.data[i].productImage && data.data[i].productImage.image1 ? data.data[i].productImage.image1.split('/product')[1] : '') || '',
            title: data.data[i].title,
            productCode: data.data[i].product_code,
            price: data.data[i].selling_price,
            in_stock: data.data[i].in_stock,
            createDate: data.data[i].create_date,
            vendor: data.data[i].vendor,
            categoryPath: data.data[i].categoryPath,
            action: ''
          };
          this.nonActiveProductsArray.push(or);
        }
        this.headNonActive = [
          {'Head': 'Image', 'FieldName' : 'image' },
          {'Head': 'Title',  'FieldName' : 'title' },
          {'Head': 'Selling Price', 'FieldName':'price' },
          {'Head': 'Stock In Hand', 'FieldName':'in_stock' },
          {'Head': 'Create Date', 'FieldName':'createDate' },
          {'Head': 'Action',  'FieldName':'' },
        ];


        this.totalPagesPA = Math.ceil(this.nonActiveProductsArray.length / this.list_pages2);
        this.onPageChange(1, 'PendingPro');
      }
    }
    if (this.nonActiveProductsArray.length === 0) {
      this.stopLoading();
    }
  }

  errorOrderManage(err) {
    this.stopLoading();
    this.product = [];
    this.list_pages = [];

    if (err.status == 401) {
      Swal.fire({
        title: 'Session Time Out',
        text: 'Please Log Again to continue',
        icon: 'info',
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['auth/login']);
        }
      });
    }
  }

  manegeMonActiveProductsByCompanyName(data) {
    this.startIndex = 0;
    this.approvalPartnerProductList = [];
    if (data.data == null) {
    } else {
      if (data.status_code === 200) {
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].productImage !== null) {

            const or = {
              productCode: data.data[i].product_code,
              title: data.data[i].title,
              createDate: data.data[i].create_date,
              brand: data.data[i].brand,
              categoryCode: data.data[i].category_code,
              vendor: data.data[i].vendor,
              categoryPath: data.data[i].categoryPath,

              image: data.data[i].productImage.image1.slice(data.data[i].productImage.image1.indexOf('/product') + 8),
              approved: 'Non Active',
              Action: '',
              // ,
            };
            this.approvalPartnerProductList.push(or);
          } else {
            const or = {
              productCode: data.data[i].product_code,
              title: data.data[i].title,
              createDate: data.data[i].create_date,
              brand: data.data[i].brand,
              categoryCode: data.data[i].category_code,
              categoryPath: data.data[i].categoryPath,
              vendor: data.data[i].vendor,
              image: '',
              approved: 'Non Active',
              Action: '',
            };
            this.approvalPartnerProductList.push(or);
          }
        }
        this.headNonActivePartner = [
          {'Head': 'Image', 'FieldName' : 'image' },
          {'Head': 'Title',  'FieldName' : 'title' },
          {'Head': 'Create Date', 'FieldName':'createDate' },
          {'Head': 'Brand',  'FieldName':'' },
        ];

        this.totalPagesPQC = Math.ceil(this.approvalPartnerProductList.length / this.list_pages2);
        this.onPageChange(1, 'PendingQC');
      }
    }
  }

  getPendingStockAllocationList(data) {
    this.pending_stock_allocation = [];

    for (let i = 0; i < data.data.length; i++) {

      const or = {
        image: (data.data[i].productImage && data.data[i].productImage.image1 ? data.data[i].productImage.image1.split('/product')[1] : '') || '',
        title: data.data[i].title,
        productCode: data.data[i].product_code,
        price: data.data[i].selling_price,
        in_stock: data.data[i].in_stock,
        vendor: data.data[i].vendor,
        createDate: data.data[i].create_date,
        categoryPath: data.data[i].categoryPath,
        action: '',

      };
      this.pending_stock_allocation.push(or);
    }

    this.headPendingStockAdmin = [
      {'Head': 'Image', 'FieldName' : 'image' },
      {'Head': 'Title',  'FieldName' : 'title' },
      {'Head': 'Selling Price', 'FieldName':'price' },
      {'Head': 'Stock In Hand', 'FieldName':'in_stock' },
      {'Head': 'Create Date', 'FieldName':'createDate' },
    ];
    this.headPendingStockPartner = [
      {'Head': 'Image', 'FieldName' : 'image' },
      {'Head': 'Title',  'FieldName' : 'title' },
      {'Head': 'Selling Price', 'FieldName':'price' },
      {'Head': 'Stock In Hand', 'FieldName':'in_stock' },
      {'Head': 'Create Date', 'FieldName':'createDate' },
      {'Head': 'Action',  'FieldName':'' },
    ];
    this.totalPagesPendingAllow = Math.ceil(this.pending_stock_allocation.length / this.list_pages2);
    this.onPageChange(1, 'PendingStockAllocation')

  }

  stopLoading() {
    this.stillLoading = false;
  }

  // clicks
  popup(price: number, itemCode: String) {
    this.priceChangeVendor = sessionStorage.getItem('partnerId');
    this.oldPrice = price;
    this.itemCode = itemCode;
    this.modalRef = this.modal.open(this.pricePopup, {centered: true});
  }

  ApproveProductNon(event) {
    const url = `#/products/digital/digital-approve-product/${event.productCode}`;
    window.open(url, '_blank');
    /*const url = '#/products/digital/digital-approve-product/' + event.productCode;
    this.router.navigate([url]);*/
  }

  onTabSelect(event: NgbTabChangeEvent) {
    const tabId = event.nextId;
    console.log(tabId)
    switch (tabId) {
      case 'ngb-tab-0':
        // stock allocation
        this.emptyTableStock = false;
        break;
      case 'ngb-tab-1':
        // pending products
        this.emptyTablePendingProduct = false;
        break;
      default:
        this.emptyTableStock = false;
        this.emptyTablePendingProduct = false;
    }
  }
  popUpImage(event) {
      this.imageUrl = this.imagePathURI + event.image;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    // if (this.filteredPendingProducts.length !== 0) {
    //   this.imageUrl = this.imagePathURI + this.filteredPendingProducts[this.startIndex + index].image;
    //   this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    // } else {
    //   this.imageUrl = this.imagePathURI + this.nonActiveProductsArray[this.startIndex + index].image;
    //   this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    // }
  }

  popUpImagePendingAllocation(index: number) {
    if (this.filterdPendingAllocation.length > 0) {
      this.imageUrl = this.imagePathURI + this.filterdPendingAllocation[this.startIndex + index].image;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    } else {
      this.imageUrl = this.imagePathURI + this.pending_stock_allocation[this.startIndex + index].image;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    }
  }

  EditStockPopup(index: number, AP: number, OS: number) {
    Swal.fire({
      title: 'Are You Sure?',
      inputPlaceholder: 'Enter new stock quantity',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value || value === '0') {
          return 'You need to enter a stock quantity!';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Handle saving the edited stQty here
        const newQuantity = result.value;
        let productCode = '';

        if (AP === 1) {
          productCode = this.list_pages[index].productCode;
        } else if (OS === 1) {
          productCode = this.list_outof_stock[index].productCode;
        }
      }
    });
  }

  pendingStockAllocationAction(productDetail: any) {
    this.filtereDpendingStockByOnDemand = this.consignmentProducts.filter((item) => (item as any).productCode === productDetail.productCode);
    if (this.filtereDpendingStockByOnDemand.length === 0){
      this.filtereDpendingStockByOnDemand[0] = productDetail
      this.pendingStockShare.setDataArray(this.filtereDpendingStockByOnDemand);
      const url = 'shipment/add-shipment';
      this.router.navigate([url]);
    }else{
      this.onDemandTab.select('ondemandTab');
    }
  }

  closePopup() {
    this.modalRef.close();
    this.imageUrl = undefined;
  }

  EditPricePopup(index: number, AP: number) {
    Swal.fire({
      title: 'Edit Price',
      input: 'number',
      inputPlaceholder: 'Enter new price',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value || value === '0') {
          return 'You need to enter a price!';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Handle saving the edited price here
        const newPrice = result.value;
        let productCode = '';

        if (AP === 1) {
          productCode = this.list_pages[index].productCode;
        }
      }
    });
  }

  popUpImagePending(index: number) {
    if (this.filteredPendingQC.length > 0) {
      this.imageUrl = this.imagePathURI + this.filteredPendingQC[index].image;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    } else {
      this.imageUrl = this.imagePathURI + this.approvalPartnerProductList[index].image;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    }
  }


  // search Filters
  PendingQCFilter(searchTerm: string): void {
    this.filteredPendingQC = this.approvalPartnerProductList.filter(product =>
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryPath.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (this.filteredPendingQC.length == 0) {
      this.emptyTablePendingProduct = true;
    } else {
      this.emptyTablePendingProduct = false;
    }

    this.totalPagesPQC = Math.ceil(this.filteredPendingQC.length / this.list_pages2);
    this.onPageChange(1, 'PendingQC');
  }

  PendingStockAllocationFilter(searchTerm: String): void {
    this.filterdPendingAllocation = this.pending_stock_allocation.filter(product =>
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryPath.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (this.filterdPendingAllocation.length == 0) {
      this.emptyTableStock = true;
    } else {
      this.emptyTableStock = false;
    }

    this.totalPagesPendingAllow = Math.ceil(this.filterdPendingAllocation.length / this.list_pages2);
    this.onPageChange(1, 'PendingStockAllocation')
  }

  filterPendingStockAllocationByBusinessName(searchTerm: string): void {
    this.filterdPendingAllocation = this.pending_stock_allocation.filter(product =>
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesPendingAllow = Math.ceil(this.filterdPendingAllocation.length / this.list_pages2);
    this.onPageChange(1, 'PendingStockAllocation');
  }

  PendingProductFilter(searchTerm: string): void {

    this.filteredPendingProducts = this.nonActiveProductsArray.filter(product =>
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryPath.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (this.filteredPendingProducts.length == 0) {
      this.emptyTablePendingProduct = true;
    } else {
      this.emptyTablePendingProduct = false;
    }
    this.totalPagesPA = Math.ceil(this.filteredPendingProducts.length / this.list_pages2);
    this.onPageChange(1, 'PendingPro');
  }

  PendingProductFilterByBusinessName(searchTerm: string): void {
    this.filteredPendingProducts = this.nonActiveProductsArray.filter(product =>
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesPA = Math.ceil(this.filteredPendingProducts.length / this.list_pages2);
    this.onPageChange(1, 'PendingPro');
  }


}
