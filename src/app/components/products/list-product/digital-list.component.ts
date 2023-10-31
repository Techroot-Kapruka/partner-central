import {Component, ElementRef, AfterViewInit, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {ProductService} from '../../../shared/service/product.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {error} from 'protractor';
import {environment} from '../../../../environments/environment.prod';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../shared/auth/auth.service';

@Component({
  selector: 'app-digital-list',
  templateUrl: './digital-list.component.html',
  styleUrls: ['./digital-list.component.scss']
})
export class DigitalListComponent implements OnInit {

  public list_pages = [];
  public pending_stock_allocation = [];
  public list_outof_stock = [];
  public list_suspend = [];
  public filteredProducts: any = [];
  public filterdPendingAllocation: any = [];
  public filteredPendingProducts: any = [];
  public filteredPendingQC: any = [];
  public filteredoutOfStock: any = [];
  public filteredSuspendProduct: any = [];
  public filterdEditImgApproval: any = [];
  public nonActiveProductsArray = [];
  public nonActiveEditedImageProductsArray = [];
  public nonActiveEditedProductsArray = [];
  public approvalPartnerProductList = [];
  public getPartnersQrList = [];
  public specialGiftsByPrefixArray = [];
  public partnerMainArr = [];
  public proPrifix = [];
  public selected = [];
  public aqnonCheckProduct = [];
  public qaApprovedAllProducts = [];
  public consignmentProducts = [];
  public product = [];
  public partnerArray = [];
  public paginatedItems = [];
  public paginatedPendingItems = [];
  public paginatedPendingQC = [];
  public paginatedOutofStock = [];
  public paginatedSuspend = [];
  public paginatedEditProApproval = [];
  public paginatedEditImgApproval = [];
  public paginatedPendingStockAllow = [];
  public filterededitProductApproval = [];

  public isAdmin = false;
  public isPartner = false;
  public categoryUID = '';
  public isQa = false;
  public oldProductStatus = false;
  public qaTables = false;
  public EnablePriceEdit = false;
  public EnableStockEdit = false;
  public startIndex;

  public product_code = '';
  public qrImage = '';
  public unique_code = '';
  public sub_type = '';
  public imagedefaultPathURI = '';
  vstock: number[] = [];
  dataLoaded: boolean = false;

  public imagePathURI = environment.imageURIENV;

  public list_pages2 = 20;
  public virtualstock = 0;
  imageUrl: any;
  modalRef: any;
  oldPrice: any;
  itemCode: any;
  priceChangeVendor: any;
  stillLoading = true;

  page = 0;
  totPage = 0;
  currentPage = 1; // Current page
  currentPagePA = 1; // Current page
  currentPagePQC = 1; // Current page
  currentPageOS = 1; // Current page
  currentPageSus = 1; // Current page
  currentPagePendingAllo = 1; // Current page
  currentPageEditProApproval = 1; // Current page
  currentPageEditImgApproval = 1; // Current page
  totalPages = 0; // Total number of pages
  totalPagesPA = 0; // Total number of pages
  totalPagesPQC = 0; // Total number of pages
  totalPagesOS = 0; // Total number of pages
  totalPagesSus = 0; // Total number of pages
  totalPagesPendingAllow = 0; // Total number of pages
  totalPagesEditProApproval = 0; // Total number of pages
  totalPagesEditImgApproval = 0; // Total number of pages


  filteredSuggestions: string[] = [];
  userInput = '';


  protected readonly print = print;

  @ViewChild('imagePopup') imagePopup: ElementRef;
  @ViewChild('pricePopup') pricePopup: ElementRef;

  constructor(private productService: ProductService, private router: Router, private modal: NgbModal, private authService: AuthService) {
    this.getFieldEditData();
    this.getAllProduct();
    this.hideElement();
    this.getNonActiveProdcut();
    this.getPartner();
    this.nonActiveProductsByCompanyName();
    this.getPartnersQrImage();
    this.getSpecialGiftsByPrefix();
    this.getPartnerByPrefix();
    this.getaqnonCheckProduct();
    this.showElerments();
    this.getConsignmentProducts();
    this.getOutOfStock();
    this.getSuspendedProducts();

    // NO
    // this.UpdateVirtualStocks();

    const sessionUser2 = sessionStorage.getItem('userRole');
    if (sessionUser2 === 'ROLE_PARTNER') {
      const page = 0;
      this.getSpecialGiftsByPrefixInPage(page);
    }
    if (sessionUser2 == 'ROLE_CATEGORY_MANAGER') {
      this.categoryUID = sessionStorage.getItem('userId');
    }

    if (sessionStorage.getItem('userRole') === 'ROLE_QA' || sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER' || sessionStorage.getItem('userRole') === 'ROLE_STORES_MANAGER') {
      this.getQaApprovedAllProducts();
      this.isQa = true;

    } else {
      this.isQa = false;
    }
  }

  @ViewChild('skuTabContent', {static: false}) skuTabContentRef!: ElementRef;

  ngOnInit() {
    setTimeout(() => {
      this.stopLoading();
    }, 12000);
  }

  stopLoading() {
    this.stillLoading = false;
  }

  showElerments() {
    if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
      this.qaTables = true;
      this.EnablePriceEdit = true;
      this.EnableStockEdit = true;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_QA') {
      this.qaTables = false;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN') {
      this.qaTables = true;
      this.EnableStockEdit = true;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER') {
      this.qaTables = true;
    } else if (sessionStorage.getItem('userRole') === 'ROLE_STORES_MANAGER') {
      this.qaTables = true;
    }
  }

  hideElement(): void {
    const role = sessionStorage.getItem('userRole');

    if (role === 'ROLE_ADMIN' || role === 'ROLE_CATEGORY_MANAGER' || role === 'ROLE_STORES_MANAGER') {
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

  /***  Get the count  ***/
  getActiveTabTitle() {
    const count = this.list_pages.length;
    return `Active (${count})`;
  }

  PendingStockAllocation(){
    const count = this.pending_stock_allocation.length;
    return `Pending Stock Allocation (${count})`;
  }

  getPendingApprovalList() {
    const count = this.nonActiveProductsArray.length;
    return `Pending Approval Product List (${count})`;
  }

  getPendingQC() {
    const count = this.approvalPartnerProductList.length;
    return `Pending Approval (${count})`;
  }

  getOutofStock() {
    const count = this.list_outof_stock.length;
    return `Out Of Stock (${count})`;
  }

  getSuspendedPro() {
    const count = this.list_suspend.length;
    return `Suspended (${count})`;
  }

  getOnDemandPro() {
    const count = this.consignmentProducts.length;
    return `On Demand Product (${count})`;
  }

  /***  Get the count  -  END  ***/

  getAllProduct() {
    const busName = sessionStorage.getItem('businessName');
    const userRole = sessionStorage.getItem('userRole');
    const categoryID = sessionStorage.getItem('userId');

    this.productService.getAllActiveProductList(busName, categoryID).subscribe(
      data => this.getSelectedProductManage(data),
    );

    this.productService.getPendingStockAllocationList(busName, categoryID).subscribe(
      data => this.getPendingStockAllocationList(data),
    );
    // if (userRole === 'ROLE_ADMIN') {
    //   // this.productService.getAllProducts().subscribe(
    //   //   data => this.LoadAllProduct(data),
    //   // );
    //
    // } else if (userRole === 'ROLE_CATEGORY_MANAGER') {
    //   // const payLoard = {
    //   //   user_u_id: sessionStorage.getItem('userId')
    //   // };
    //   // this.productService.getAllProductsByCatManager(payLoard).subscribe(
    //   //   data => this.LoadAllProduct(data),
    //   // );
    //   this.productService.getProductByBussiness(busName, categoryID).subscribe(
    //     data => this.getSelectedProductManage(data),
    //   );
    // } else if (userRole === 'ROLE_PARTNER' || userRole === 'ROLE_USER') {
    //   this.productService.getProductByBussiness(busName, categoryID).subscribe(
    //     data => this.getSelectedProductManage(data),
    //   );
    // }
  }

  LoadAllProduct(data) {
    this.startIndex = 0;
    this.list_pages = [];

    if (data.data == null) {
    } else {
      const lengthRes = data.data.length;
      for (let i = 0; i < lengthRes; i++) {
        const or = {
          image: (data.data[i].productImage && data.data[i].productImage.image1 ? data.data[i].productImage.image1.split('/product')[1] : '') || '',
          title: data.data[i].title,
          productCode: data.data[i].product_code,
          price: (data.data[i].productVariation && data.data[i].productVariation[0] ? data.data[i].productVariation[0].selling_price : 0),
          in_stock: data.data[i].in_stock,
          createDate: data.data[i].create_date,
          vendor: data.data[i].vendor,
          categoryPath: data.data[i].categoryPath,
          action: ''
        };
        this.list_pages.push(or);
      }
      this.totalPages = Math.ceil(this.list_pages.length / this.list_pages2);
    }
  }

  getSelectedPartnerAllocationProduct() {
    const name = (document.getElementById('select_pro') as HTMLInputElement).value;
    this.productService.getAllActiveProductList(name, this.categoryUID).subscribe(
      data => this.getSelectedPartnerAllocationProductManage(data),
      error => this.errorOrderManage(error)
    );
  }

  getSelectedPartnerSuspendedProduct(){
    const name = (document.getElementById('select_pro') as HTMLInputElement).value;
    this.productService.getSuspendedProofVendor(name, this.categoryUID).subscribe(
      data => this.LoadSuspendedProofVendor(data),
      error => this.errorOrderManage(error)
    );
  }

  getSelectedPartnerOutProduct(){
    const name = (document.getElementById('select_pro') as HTMLInputElement).value;
    this.productService.getOutofStockofVendor(name, this.categoryUID).subscribe(
      data => this.LoadOutofStockofVendor(data),
      error => this.errorOrderManage(error)
    );
  }

  getPendingStockAllocationList(data){
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
    this.totalPagesPendingAllow = Math.ceil(this.pending_stock_allocation.length / this.list_pages2);
    this.onPageChange(1,'PendingStockAllocation')

  }
  getSelectedPartnerAllocationProductManage(data){
    this.startIndex = 0;
    this.pending_stock_allocation = [];

    if (data.data == null) {
    } else {
      const lengthRes = data.data.length;
      for (let i = 0; i < lengthRes; i++) {

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
      this.totalPagesPendingAllow = Math.ceil(this.pending_stock_allocation.length / this.list_pages2);
      this.onPageChange(1,'PendingStockAllocation')
    }
  }

  getSelectedProductManage(data) {
    this.startIndex = 0;
    this.list_pages = [];

    if (data.data == null) {
    } else {
      const lengthRes = data.data.length;
      for (let i = 0; i < lengthRes; i++) {

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
        this.list_pages.push(or);
      }
      this.totalPages = Math.ceil(this.list_pages.length / this.list_pages2);
      this.onPageChange(1,'ActivePro')
    }
  }

  ActiveProductFilter(searchTerm: string): void {
    this.filteredProducts = this.list_pages.filter(product =>
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredProducts.length / this.list_pages2);
    this.onPageChange(1,'ActivePro')
  }

  PendingStockAllocationFilter(searchTerm: String): void{
    this.filterdPendingAllocation = this.pending_stock_allocation.filter(product =>
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.totalPagesPendingAllow = Math.ceil(this.filterdPendingAllocation.length / this.list_pages2);
    this.onPageChange(1,'PendingStockAllocation')
  }

  /*  AP = Active Products
  * */
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

  outButton(index: number, AP: number, OS: number) {
    Swal.fire({
      title: 'Are you sure?',
      html: 'This action will make your product temporary marked Out Of Stock from the Kapruka Website.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      let payLoad;
      if (this.filteredProducts.length > 0) {
        payLoad = {
          product_code: this.filteredProducts[this.startIndex + index].productCode,
          updatedBy: sessionStorage.getItem('userId')
        };
      } else {
        payLoad = {
          product_code: this.list_pages[this.startIndex + index].productCode,
          updatedBy: sessionStorage.getItem('userId')
        };
      }
      if (result.isConfirmed) {
        this.productService.updateProductStock(payLoad).subscribe(
          error => (error.status)
        );
        Swal.fire('Done!', '', 'success').then((result) => {
          this.getAllProduct();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', '', 'error');
      }
    });
  }

  editGetProduct2(index) {

    if (this.filteredProducts.length > 0) {
      const productCode = this.list_pages[this.startIndex + index].productCode;
      const url = 'products/digital/digital-edit-product/' + productCode;
      this.router.navigate([url]);
    } else {
      const productCode = this.list_pages[this.startIndex + index].productCode;
      const url = 'products/digital/digital-edit-product/' + productCode;
      this.router.navigate([url]);
    }
  }

  editGetProduct3(index) {

    if (this.filteredProducts.length > 0) {
      const productCode = this.filteredProducts[this.startIndex + index].productCode;
      const url = 'products/digital/view-product/' + productCode;
      this.router.navigate([url]);
    } else {
      const productCode = this.list_pages[this.startIndex + index].productCode;
      const url = 'products/digital/view-product/' + productCode;
      this.router.navigate([url]);
    }
  }

  async deleteActiveProduct(productCode) {

    const {value: text} = await Swal.fire({
      title: 'Enter a comment',
      input: 'text',
      inputPlaceholder: 'Enter your comment here',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      }

    })
    if (text) {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showCancelButton: true,
        confirmButtonText: 'Save',
      }).then((result) => {
        if (result.isConfirmed) {
          const payLoad = {
            product_code: productCode,
            rejecteddBy: sessionStorage.getItem('userId'),
            rejectReason: text
          };

          this.productService.deleteProduct(payLoad).subscribe(
            data => this.getAllProduct(),
            error => (error.status)
          );

          Swal.fire('Saved!', '', 'success');
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    }
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

  popUpImageActive(index: number) {

    if (this.filteredProducts.length > 0) {
      this.imageUrl = this.imagePathURI + this.filteredProducts[this.startIndex + index].image;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    } else {
      this.imageUrl = this.imagePathURI + this.list_pages[this.startIndex + index].image;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    }

  }

  popup(price: number, itemCode: String) {
    this.priceChangeVendor = sessionStorage.getItem('partnerId');
    this.oldPrice = price;
    this.itemCode = itemCode;
    this.modalRef = this.modal.open(this.pricePopup, {centered: true});
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

  popUpImage(index: number) {
    if (this.filteredPendingProducts.length !== 0) {
      this.imageUrl = this.imagePathURI + this.filteredPendingProducts[this.startIndex + index].image;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    } else {
      this.imageUrl = this.imagePathURI + this.nonActiveProductsArray[this.startIndex + index].image;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    }
  }

  closePopup() {
    this.modalRef.close();
    this.imageUrl = undefined;
  }

  getPartner(): void {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_STORES_MANAGER') {
      this.productService.getPartnerAll().subscribe(
        data => this.manageBussinessPartner(data),
      );
    } else if (sessionUser === 'ROLE_CATEGORY_MANAGER') {
      const payloard = {
        user_u_id: sessionStorage.getItem('userId'),
      };
      this.productService.getPartnerAllCategoryWise(payloard).subscribe(
        data => this.manageBussinessPartner(data),
      );
    }
  }

  manageBussinessPartner(data) {

    let pr = {};
    const bussinessArrLangth = data.data.length;
    const partnerValue = data.data;
    for (let i = 0; i < bussinessArrLangth; i++) {
      pr = {
        name: partnerValue[i].businessName,
        partner_u_id: partnerValue[i].partner_u_id,
        businessName: partnerValue[i].businessName
      };
      this.partnerMainArr.push(data.data[i]);
      this.partnerArray.push(pr);
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

  getNonActiveProdcut() {
    const busName = sessionStorage.getItem('businessName');
    const userRole = sessionStorage.getItem('userRole');
    const categoryID = sessionStorage.getItem('userId');

    this.productService.getnonActiveProduct(busName, categoryID).subscribe(
      data => this.manageNonActiveProduct(data),
      error => this.errorOrderManage(error)
    );

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

        this.totalPagesPA = Math.ceil(this.nonActiveProductsArray.length / this.list_pages2);
        this.onPageChange(1,'PendingPro');
      }
    }
    if (this.nonActiveProductsArray.length === 0) {
      this.stopLoading();
    }
  }

  PendingProductFilter(searchTerm: string): void {

    this.filteredPendingProducts = this.nonActiveProductsArray.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesPA = Math.ceil(this.filteredPendingProducts.length / this.list_pages2);
    this.onPageChange(1,'PendingPro');
  }

  editProductApprovalFilter(searchTerm: string): void {
    this.filterededitProductApproval = this.nonActiveEditedProductsArray.filter(product =>
      product.requestBy.toLowerCase().includes(searchTerm.toLowerCase()) || product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesEditProApproval = Math.ceil(this.filterededitProductApproval.length / this.list_pages2);
    this.onPageChange(1,'EditProApproval');
  }

  PendingProductFilterByBusinessName(searchTerm: string): void {
    this.filteredPendingProducts = this.nonActiveProductsArray.filter(product =>
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesPA = Math.ceil(this.filteredPendingProducts.length / this.list_pages2);
    this.onPageChange(1,'PendingPro');
  }

  PendingQCFilter(searchTerm: string): void {
    this.filteredPendingQC = this.approvalPartnerProductList.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.totalPagesPQC = Math.ceil(this.filteredPendingQC.length / this.list_pages2);
    this.onPageChange(1,'PendingQC');
  }

  OutofStockFilter(searchTerm: string): void {
    this.filteredoutOfStock = this.list_outof_stock.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.totalPagesOS = Math.ceil(this.filteredoutOfStock.length / this.list_pages2);
    this.onPageChange(1,'OutofStock');
  }

  filterOutofStockByBusinessName(searchTerm: string): void {
    this.filteredoutOfStock = this.list_outof_stock.filter(product =>
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.totalPagesOS = Math.ceil(this.filteredoutOfStock.length / this.list_pages2);
    this.onPageChange(1,'OutofStock');
  }


  SuspendProductFilter(searchTerm: string): void {
    this.filteredSuspendProduct = this.list_suspend.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.totalPagesSus = Math.ceil(this.filteredSuspendProduct.length / this.list_pages2);
    this.onPageChange(1,'Suspend');
  }

  SuspendProductFilterByBusinessName(searchTerm: string): void {
    this.filteredSuspendProduct = this.list_suspend.filter(product =>
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.totalPagesSus = Math.ceil(this.filteredSuspendProduct.length / this.list_pages2);
    this.onPageChange(1,'Suspend');
  }

  ApproveProductNon(value) {

    if (this.filteredPendingProducts.length !== 0) {
      const url = 'products/digital/digital-approve-product/' + this.filteredPendingProducts[this.startIndex + value].productCode;
      this.router.navigate([url]);
    } else {
      const url = 'products/digital/digital-approve-product/' + this.nonActiveProductsArray[this.startIndex + value].productCode;
      this.router.navigate([url]);
    }
  }


  checkForTheQa(value) {

    const url = 'products/digital/qa-approve-product/' + this.aqnonCheckProduct[value].productCode;
    this.router.navigate([url]);
  }

  manageApproveProduct(data) {
    Swal.fire(
      'Good job!',
      data.message,
      'success'
    );
    this.getNonActiveProdcut();
  }

  editGetProduct(index) {

    if (this.filteredPendingQC.length > 0) {
      const productCode = this.filteredPendingQC[this.startIndex + index].productCode;
      const url = 'products/digital/digital-edit-product/' + productCode;
      this.router.navigate([url]);
    } else {
      const productCode = this.approvalPartnerProductList[this.startIndex + index].productCode;
      const url = 'products/digital/digital-edit-product/' + productCode;
      this.router.navigate([url]);
    }

  }

  editGetProductOS(index) {
    /*const productCode = this.list_outof_stock[index].productCode;
    const url = 'products/digital/digital-edit-product/' + productCode;
    this.router.navigate([url]);*/
  }

  editGetProductSP(index) {
    /*const productCode = this.list_suspend[index].productCode;
    const url = 'products/digital/digital-edit-product/' + productCode;
    this.router.navigate([url]);*/
  }

  nonActiveProductsByCompanyName() {
    const payloard = {
      businessName: sessionStorage.getItem('businessName')
    };
    this.productService.nonActiveProductsByCompanyName(payloard).subscribe(
      data => this.manegeMonActiveProductsByCompanyName(data),
    );
  }

  // onDemand
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

  UpdateVirtualStocks(row: any) {
    if (this.vstock[row] === null || this.vstock[row] === undefined || isNaN(this.vstock[row]) || this.vstock[row] < 0) {
      Swal.fire(
        'error!',
        'Invalid stock value. Please enter a valid number.',
        'error'
      );
      return;
    }

    const payloard = {
      product_code: this.consignmentProducts[row].productCode,
      vendor: sessionStorage.getItem('partnerId'),
      in_stock: this.vstock[row]
    };
    this.productService.updateStock(payloard).subscribe(
      data => this.manageUpdateStock(data),
    );
  }

  manageUpdateStock(data) {
    Swal.fire(
      'Good job!',
      data.message,
      'success'
    ).then(() => {
      this.getConsignmentProducts();
    });
    // this.getNonActiveProdcut();
  }

  getPartnersQrImage() {
    const payloard = {
      vendorCode: sessionStorage.getItem('partnerId')

    };
    this.productService.getPartnersQrImage(payloard).subscribe(
      data => this.managePartnerQrImages(data),
    );
  }

  managePartnerQrImages(data) {
    this.getPartnersQrList = [];
    if (data.data == null) {
    } else {
      if (data.status_code === 200) {
        for (let i = 0; i < data.data.length; i++) {
          const or = {
            productCode: data.data[i].productCode,
            productName: data.data[i].productName,
            productSku: data.data[i].productSku,
            qrImage: this.imagePathURI + data.data[i].qr,
            Action: ''
          };
          this.getPartnersQrList.push(or);
        }
      }
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

        this.totalPagesPQC = Math.ceil(this.approvalPartnerProductList.length / this.list_pages2);
        this.onPageChange(1,'PendingQC');
      }
    }
  }

  printImage(rowIndex) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const image = new Image();
      image.onload = () => {
        printWindow.document.write(`<img src="${this.getPartnersQrList[rowIndex].qrImage}" style="max-width: 100%;">`);
        printWindow.document.close();
        printWindow.print();
        printWindow.addEventListener('afterprint', () => {
          printWindow.close();
          window.location.reload(); // Refresh the page after printing is done
        });
      };
      image.src = this.getPartnersQrList[rowIndex].qrImage;
    } else {
    }
  }

  viewProduct(index) {
    let namezz = '';
    const userRole = sessionStorage.getItem('userRole');
    if (userRole === 'ROLE_ADMIN') {
      namezz = (document.getElementById('select_pro3') as HTMLInputElement).value;
      for (let i = 0; i < this.partnerArray.length; i++) {
        if (this.partnerArray[i].partner_u_id === namezz) {
          namezz = this.partnerArray[i].businessName;
        }
      }

    } else {
      namezz = sessionStorage.getItem('businessName');
    }

    const url = 'products/digital/digital-view-product/' + index + '/' + namezz;
    this.router.navigate([url]);
  }

  getSpecialGiftsByPrefix() {
    const pro_pr = sessionStorage.getItem('productPrefix');
    if (this.isPartner) {
      const payloard = {
        businessName: sessionStorage.getItem('businessName'),
        productPrefix: JSON.parse(pro_pr)
      };
      this.productService.getSpecialGiftsByPrefixSet2(payloard).subscribe(
        data => this.manageGetSpecialGiftsByPrefixSet(data),
      );
    } else {

    }

  }

  manageGetSpecialGiftsByPrefixSet(data) {
    this.specialGiftsByPrefixArray = [];


    for (let i = 0; i < data.data.length; i++) {
      let color = '';
      let subTypes = '';
      if (data.data[i].available === 'out') {
        color = '#F39C12';
      } else if (data.data[i].available === 'yes') {
        color = '#0E6655';
      } else if (data.data[i].available === 'no') {
        color = '#E74C3C';
      }
      if (data.data[i].subSubType === '') {
        subTypes = data.data[i].subType;
      } else {
        subTypes = data.data[i].subSubType;
      }


      const ar = {
        productCode: data.data[i].productID,
        name: data.data[i].name,
        category: subTypes,
        brand: data.data[i].brand,
        color,
        available: data.data[i].available
      };
    }
  }


  getSelectedPartnerProductByPaginate() {
    this.page = 0;
    this.getSpecialGiftsByPrefixInPage(this.page);
    this.specialGiftsByPrefixArray = [];
    const name = (document.getElementById('select_pro3') as HTMLInputElement).value;
    for (let i = 0; i < this.partnerMainArr.length; i++) {
      if (name === this.partnerMainArr[i].partner_u_id) {
        for (let z = 0; z < this.partnerMainArr[i].productPrefix.length; z++) {
          this.proPrifix.push(this.partnerMainArr[i].productPrefix[z]);
          sessionStorage.setItem('productPrefix', '');
          sessionStorage.setItem('productPrefix', JSON.stringify(this.proPrifix));
        }
      }
    }
  }


  getPartnerByPrefix() {

  }


  getSpecialGiftsByPrefixInPage(pageNo) {
    let businessName = '';
    const names = '';
    const sessionUser2 = sessionStorage.getItem('userRole');
    if (sessionUser2 === 'ROLE_ADMIN') {
      businessName = (document.getElementById('select_pro3') as HTMLInputElement).value;
    } else if (sessionUser2 === 'ROLE_PARTNER') {
      businessName = sessionStorage.getItem('partnerId');
    }
    this.productService.getSpecialGiftsByPrefix(pageNo, businessName, names).subscribe(
      data => this.manageSpecialGiftsByPrefixInPage(data),
    );
  }

  manageSpecialGiftsByPrefixInPage(data) {
    if (data.data != null) {
      this.totPage = data.data.totalElements * 10 / data.data.size;
      this.specialGiftsByPrefixArray = [];
      for (let i = 0; i < data.data.content.length; i++) {
        let color = '';
        let subTypes = '';
        if (data.data.content[i].available === 'out') {
          color = '#F39C12';
        } else if (data.data.content[i].available === 'yes') {
          color = '#0E6655';
        } else if (data.data.content[i].available === 'no') {
          color = '#E74C3C';
        }
        if (data.data.content[i].subSubType === '') {
          subTypes = data.data.content[i].subType;
        } else {
          subTypes = data.data.content[i].subSubType;
        }

        const ar = {
          productCode: data.data.content[i].productID,
          name: data.data.content[i].name,
          category: subTypes,
          brand: data.data.content[i].brand,
          color,
          available: data.data.content[i].available
        };
        this.specialGiftsByPrefixArray.push(ar);
      }
    }

  }


  getSelectedRowss(page) {
    const sessionUser2 = sessionStorage.getItem('userRole');
    if (sessionUser2 === 'ROLE_ADMIN') {
      const businessName = (document.getElementById('select_pro3') as HTMLInputElement).value;
      if (businessName == 'none') {
      } else {
        this.getSpecialGiftsByPrefixInPage(page - 1);
      }
    } else if (sessionUser2 === 'ROLE_PARTNER') {
      this.getSpecialGiftsByPrefixInPage(page - 1);
    }
  }

  getaqnonCheckProduct() {
    const role = sessionStorage.getItem('userRole');
    if (role === 'ROLE_CATEGORY_MANAGER') {
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId')
      };
      this.productService.getCategoryWiseProducts(payLoard).subscribe(
        data => this.manageGetQaProducts(data),
      );
    }
  }

  // getaqnonCheckProduct() {
  //   this.productService.getQaProducts().subscribe(
  //     data => this.manageGetQaProducts(data),
  //   );
  // }

  manageGetQaProducts(data) {
    this.aqnonCheckProduct = [];
    for (let i = 0; i < data.data.length; i++) {
      let arr = {};
      arr = {
        productCode: data.data[i].product_code,
        title: data.data[i].title,
        type: data.data[i].category_code,
        createDate: data.data[i].create_date,
        brand: data.data[i].brand,
      };
      this.aqnonCheckProduct.push(arr);
    }
  }


  getQaApprovedAllProducts() {
    const payLoard = {
      qa_user_id: sessionStorage.getItem('userId')
    };
    this.productService.getQaApprovedAllProductsById(payLoard).subscribe(
      data => this.manageGetQaApprovedAllProductsById(data),
    );
  }

  manageGetQaApprovedAllProductsById(data) {
    this.qaApprovedAllProducts = [];
    if (data.data != null) {
      for (let i = 0; i < data.data.length; i++) {
        let arr = {};
        arr = {
          productCode: data.data[i].product_code,
          title: data.data[i].title,
          type: data.data[i].category_code,
          createDate: data.data[i].create_date,
          brand: data.data[i].brand,
        };
        this.qaApprovedAllProducts.push(arr);
      }
    }
  }

  navigateQaView(index) {
    const productCode = this.qaApprovedAllProducts[index].productCode;
    const url = 'products/digital/qa-approve-view-product/' + productCode;
    this.router.navigate([url]);
  }

  private getFieldEditData() {
    const role = sessionStorage.getItem('userRole');
    if (role === 'ROLE_CATEGORY_MANAGER') {
      const payLoard = {
        user_u_id: sessionStorage.getItem('userId')
      };
    } else {
      this.productService.getEditFieldsDataAll().subscribe(
        data => this.manageFieldEditData(data),
        // tslint:disable-next-line:no-shadowed-variable
      );
      this.productService.getnonActiveImageProduct().subscribe(
        data => this.manageFieldImageEditData(data),
        // tslint:disable-next-line:no-shadowed-variable
      );
    }
  }

  loadPage(index: number) {
    if (this.filteredProducts.length > 0) {
      window.open('https://www.kapruka.com/buyonline/' + this.filteredProducts[this.startIndex + index].title.replace(/\s+/g, '-').toLowerCase() + '/kid/' + 'ef_pc_' + this.filteredProducts[this.startIndex + index].productCode, '_blank');
    } else {
      window.open('https://www.kapruka.com/buyonline/' + this.list_pages[this.startIndex + index].title.replace(/\s+/g, '-').toLowerCase() + '/kid/' + 'ef_pc_' + this.list_pages[this.startIndex + index].productCode, '_blank');
   }

  }

  private manageFieldEditData(data) {
    this.product_code = '';
    this.sub_type = '';
    this.unique_code = '';
    for (let i = 0; i < data.data.length; i++) {

      const payloard = {
        productCode: data.data[i].referenceId,
        requestBy: data.data[i].requestedVendorName,
        requestedDate: data.data[i].requestedDate,
        subType: data.data[i].sub_type,
        type: data.data[i].type,
        title: data.data[i].productName,
        action: '',
        unique_code: data.data[i].unique_code,
        categoryPath: data.data[i].categoryPath,
        image: data.data[i].image.split('/product')[1],
      };
      this.nonActiveEditedProductsArray.push(payloard);
    }
    this.totalPagesEditProApproval = Math.ceil(this.nonActiveEditedProductsArray.length / this.list_pages2);
    this.onPageChange(1,'EditProApproval');
  }

  ApproveEditProduct(i) {

    if (this.filterededitProductApproval.length > 0) {
      const product_code = this.filterededitProductApproval[this.startIndex + i].productCode;
      const unique_code = this.filterededitProductApproval[this.startIndex + i].unique_code;
      const sub_type = this.filterededitProductApproval[this.startIndex + i].subType;
      const ProDetails = product_code + '-' + unique_code + '-' + sub_type;
      this.router.navigate(['products/digital/edited-approve-product/' + ProDetails]);
    } else {
      const product_code = this.nonActiveEditedProductsArray[this.startIndex+i].productCode;
      const unique_code = this.nonActiveEditedProductsArray[this.startIndex+i].unique_code;
      const sub_type = this.nonActiveEditedProductsArray[this.startIndex+i].subType;
      const ProDetails = product_code + '-' + unique_code + '-' + sub_type;
      this.router.navigate(['products/digital/edited-approve-product/' + ProDetails]);
    }


  }

  ApproveEditImageProduct(rowIndex) {
    if(this.filterdEditImgApproval.length > 0){
      const url = 'products/digital/edited-image-approve-product/' + this.filterdEditImgApproval[this.startIndex + rowIndex].productCode;
      this.router.navigate([url], {
        queryParams: {
          product_code: this.product_code,
          unique_code: this.nonActiveEditedImageProductsArray[this.startIndex+rowIndex].editId,
          requested_by: this.nonActiveEditedImageProductsArray[this.startIndex+rowIndex].requestBy
        }
      });
    }else{
      const url = 'products/digital/edited-image-approve-product/' + this.nonActiveEditedImageProductsArray[this.startIndex+rowIndex].productCode;
      this.router.navigate([url], {
        queryParams: {
          product_code: this.product_code,
          unique_code: this.nonActiveEditedImageProductsArray[this.startIndex+rowIndex].editId,
          requested_by: this.nonActiveEditedImageProductsArray[this.startIndex+rowIndex].requestBy
        }
      });
    }

  }

  private manageFieldImageEditData(data) {
    for (let i = 0; i < data.data.length; i++) {

      const payloard = {
        productCode: data.data[i].productCode,
        requestBy: data.data[i].vendorName,
        editId: data.data[i].editId,
        requestedDate: data.data[i].requestedDate,
        title: data.data[i].title,
        catePath: data.data[i].catePath,
        action: ''

      };

      this.product_code = data.data[i].productCode;
      this.unique_code = data.data[i].editId;

      this.nonActiveEditedImageProductsArray.push(payloard);
    }
    this.totalPagesEditImgApproval = Math.ceil(this.nonActiveEditedImageProductsArray.length / this.list_pages2);
    this.onPageChange(1,'EditImgApproval');
  }

  onImageError(event: any): void {
    this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
    event.target.src = this.imagedefaultPathURI + '/1.jpg';
  }

  getOutOfStock() {
    const busName = sessionStorage.getItem('businessName');
    const userRole = sessionStorage.getItem('userRole');
    const categoryID = sessionStorage.getItem('userId');
    this.productService.getOutofStockofVendor(busName, categoryID).subscribe(
      data => this.LoadOutofStockofVendor(data),
    );
  }

  private LoadOutofStockofVendor(data) {
    this.list_outof_stock = [];

    if (data.data == null) {
    } else {
      const lengthRes = data.data.length;
      for (let i = 0; i < lengthRes; i++) {
        const or = {
          image: (data.data[i].productImage && data.data[i].productImage.image1 ? data.data[i].productImage.image1.split('/product')[1] : '') || '',
          title: data.data[i].title,
          productCode: data.data[i].product_code,
          price: (data.data[i].productVariation && data.data[i].productVariation[0] ? data.data[i].productVariation[0].selling_price : 0),
          in_stock: data.data[i].in_stock,
          createDate: data.data[i].create_date,
          categoryPath: data.data[i].categoryPath,
          vendor: data.data[i].vendor,
          action: ''
        };
        this.list_outof_stock.push(or);
      }
      this.totalPagesOS = Math.ceil(this.list_outof_stock.length / this.list_pages2);
      this.onPageChange(1,'OutofStock');
    }
  }

  onClickImage(url) {
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.focus();
    } else {
      Swal.fire(
        'error',
        'The new window/tab was blocked by the pop-up blocker',
        'error'
      );
    }
  }

  getSuspendedProducts() {
    const busName = sessionStorage.getItem('businessName');
    const userRole = sessionStorage.getItem('userRole');
    const categoryID = sessionStorage.getItem('userId');

    this.productService.getSuspendedProofVendor(busName , categoryID).subscribe(
      data => this.LoadSuspendedProofVendor(data),
    );
  }

  private LoadSuspendedProofVendor(data) {
    this.list_suspend = [];

    if (data.data == null) {
    } else {
      const lengthRes = data.data.length;
      for (let i = 0; i < lengthRes; i++) {
        const or = {
          image: (data.data[i].productImage && data.data[i].productImage.image1 ? data.data[i].productImage.image1.split('/product')[1] : '') || '',
          title: data.data[i].title,
          productCode: data.data[i].product_code,
          price: (data.data[i].productVariation && data.data[i].productVariation[0] ? data.data[i].productVariation[0].selling_price : 0),
          in_stock: data.data[i].in_stock,
          createDate: data.data[i].create_date,
          categoryPath: data.data[i].categoryPath,
          vendor: data.data[i].vendor,
          action: ''
        };
        this.list_suspend.push(or);
      }
      this.totalPagesSus = Math.ceil(this.list_suspend.length / this.list_pages2);
    }
  }

  onPageChange(page: number, Descrip: string) {
    if (Descrip === 'ActivePro') {
      this.currentPage = page;
    } else if (Descrip === 'PendingPro') {
      this.currentPagePA = page;
    } else if (Descrip === 'PendingQC') {
      this.currentPagePQC = page;
    } else if (Descrip === 'OutofStock') {
      this.currentPageOS = page;
    } else if (Descrip === 'Suspend') {
      this.currentPageSus = page;
    }else if (Descrip === 'PendingStockAllocation'){
      this.currentPagePendingAllo = page;
    }else if (Descrip === 'EditProApproval' ){
      this.currentPageEditProApproval = page;
    }else if(Descrip === 'EditImgApproval'){
      this.currentPageEditImgApproval = page;
    }
    // Fetch or filter your table data based on the new page
    this.updateTableData(Descrip);
  }

  updateTableData(Descrip: string) {
    if (Descrip === 'ActivePro') {
      const startIndex = (this.currentPage - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;
      if ( this.filteredProducts.length > 0 ){
        this.paginatedItems = this.filteredProducts.slice(startIndex, endIndex);
      }else{
        this.paginatedItems = this.list_pages.slice(startIndex, endIndex);
      }
    } else if (Descrip === 'PendingPro') {
      const startIndex = (this.currentPagePA - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;

      if (this.filteredPendingProducts.length > 0){
        this.paginatedPendingItems = this.filteredPendingProducts.slice(startIndex, endIndex);
      }else{
        this.paginatedPendingItems = this.nonActiveProductsArray.slice(startIndex, endIndex);
      }
    } else if (Descrip === 'PendingQC') {
      const startIndex = (this.currentPagePQC - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;

      if (this.filteredPendingQC.length > 0){
        this.paginatedPendingQC = this.filteredPendingQC.slice(startIndex, endIndex);
      }else{
        this.paginatedPendingQC = this.approvalPartnerProductList.slice(startIndex, endIndex);
      }
    } else if (Descrip === 'OutofStock') {
      const startIndex = (this.currentPageOS - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;
      if(this.filteredoutOfStock.length > 0 ){
        this.paginatedOutofStock = this.filteredoutOfStock.slice(startIndex, endIndex);
      }else{
        this.paginatedOutofStock = this.list_outof_stock.slice(startIndex, endIndex);
      }
    } else if (Descrip === 'Suspend') {
      const startIndex = (this.currentPageSus - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex=startIndex

      if(this.filteredSuspendProduct.length > 0){
        this.paginatedSuspend = this.filteredSuspendProduct.slice(startIndex, endIndex);
      }else{
        this.paginatedSuspend = this.list_suspend.slice(startIndex, endIndex);
      }

    }else if (Descrip === 'PendingStockAllocation'){
      const startIndex = (this.currentPagePendingAllo - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;

      if (this.filterdPendingAllocation.length > 0){
        this.paginatedPendingStockAllow = this.filterdPendingAllocation.slice(startIndex, endIndex);
      }else{
        this.paginatedPendingStockAllow = this.pending_stock_allocation.slice(startIndex, endIndex);
      }
    }else if (Descrip === 'EditProApproval'){
      const startIndex = (this.currentPageEditProApproval - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;

      if(this.filterededitProductApproval.length > 0){
        this.paginatedEditProApproval = this.filterededitProductApproval.slice(startIndex, endIndex);
      }else{
        this.paginatedEditProApproval = this.nonActiveEditedProductsArray.slice(startIndex, endIndex);
      }
    }else if (Descrip === 'EditImgApproval'){
      const startIndex = (this.currentPageEditImgApproval - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;

      if(this.filterdEditImgApproval.length > 0){
        this.paginatedEditImgApproval = this.filterdEditImgApproval.slice(startIndex, endIndex);
      }else{
        this.paginatedEditImgApproval = this.nonActiveEditedImageProductsArray.slice(startIndex, endIndex);
      }

    }
  }

  filterAllProducts(searchTerm: string): void {

    this.filteredProducts = this.list_pages.filter(product =>
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredProducts.length / this.list_pages2);
    this.onPageChange(1,'ActivePro')
  }

  filterPendingStockAllocationByBusinessName(searchTerm: string): void {
    this.filterdPendingAllocation = this.pending_stock_allocation.filter(product =>
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesPendingAllow = Math.ceil(this.filterdPendingAllocation.length / this.list_pages2);
    this.onPageChange(1,'PendingStockAllocation');
  }

  editImgApprovalFilter(searchTerm: string): void {
    this.filterdEditImgApproval = this.nonActiveEditedImageProductsArray.filter(product =>
      product.requestBy.toLowerCase().includes(searchTerm.toLowerCase()) || product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.totalPagesEditImgApproval = Math.ceil(this.filterdEditImgApproval.length / this.list_pages2);
    this.onPageChange(1,'EditImgApproval');
  }

  getSelectedPartnerProduct(businessName :any) {
    this.userInput = businessName;
    this.filteredSuggestions = [];
    // const name = (document.getElementById('select_pro') as HTMLInputElement).value;
    this.productService.getAllActiveProductList(businessName, this.categoryUID).subscribe(
      data => this.getSelectedProductManage(data),
      error => this.errorOrderManage(error)
    );
  }

}
