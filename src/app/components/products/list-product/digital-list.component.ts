import {Component, ElementRef, AfterViewInit, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {ProductService} from '../../../shared/service/product.service';
import Swal from 'sweetalert2';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {error} from 'protractor';
import {environment} from '../../../../environments/environment.prod';
import {NgbModal, NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../shared/auth/auth.service';
import {PendingStockAllocationShareService} from '../../../shared/service/pending-stock-allocation-share.service';

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
    public filteredPendingProducts: any = [];
    public filteredoutOfStock: any = [];
    public filteredSuspendProduct: any = [];
    public filteredOnDemandProduct: any = [];
    public nonActiveProductsArray = [];
    public nonActiveEditedImageProductsArray = [];
    public nonActiveEditedProductsArray = [];
    public getPartnersQrList = [];
    public specialGiftsByPrefixArray = [];
    public partnerMainArr = [];
    public selected = [];
    public aqnonCheckProduct = [];
    public qaApprovedAllProducts = [];
    public consignmentProducts = [];
    public product = [];
    public partnerArray = [];
    public paginatedItems = [];
    public paginatedOutofStock = [];
    public paginatedSuspend = [];
    public paginatedOnDemand = [];
    public headActive = [];
    public headOut = [];
    public headOnDemand = [];

    public isAdmin = false;
    public isPartner = false;
    public categoryUID = '';
    public isQa = false;
    public oldProductStatus = false;
    public qaTables = false;
    public EnablePriceEdit = false;
    public EnableStockEdit = false;
    public emptyTableActive = false;
    public emptyTableOutStock = false;
    public emptyTableSus = false;
    public emptyTableOnDemand = false;
    public startIndex;
    public filterClickActive: number = 0;
    public filterClickOutOfStock: number = 0;
    public filterClickSuspend: number = 0;
    public filterClickOnDemand: number = 0;

    public product_code = '';
    public qrImage = '';
    public unique_code = '';
    public sub_type = '';
    public imagedefaultPathURI = '';
    vstock: number[] = [];
    stockUpdate = false;

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
    totPage = 0;
    currentPage = 1; // Current page
    currentPageOS = 1; // Current page
    currentPageSus = 1; // Current page
    currentPageOnDemand = 1; // Current page
    totalPages = 0; // Total number of pages
    totalPagesPA = 0; // Total number of pages
    totalPagesOS = 0; // Total number of pages
    totalPagesSus = 0; // Total number of pages
    totalPagesOnDemand = 0; // Total number of pages
    totalPagesEditProApproval = 0; // Total number of pages
    totalPagesEditImgApproval = 0; // Total number of pages

    active: boolean = false;
    suspend: boolean = false;
    onDemand: boolean = false;
    nonActivePartner: boolean = false;

    protected readonly print = print;

    @ViewChild('imagePopup') imagePopup: ElementRef;
    @ViewChild('pricePopup') pricePopup: ElementRef;
    @ViewChild('ondemandTab', {static: true}) onDemandTab: NgbTabset;
    @ViewChild('searchInputRef', {static: false}) searchInputRef: ElementRef;

    constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router, private modal: NgbModal, private authService: AuthService, private pendingStockShare: PendingStockAllocationShareService) {
        // this.getFieldEditData();
        this.getAllProduct();
        this.hideElement();
        // this.getNonActiveProdcut();
        this.getPartner();
        // this.nonActiveProductsByCompanyName();
        // this.getPartnersQrImage();
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
        this.active = true;

        return `Active (${count})`;
    }

    onTabSelect(event: NgbTabChangeEvent) {
        const tabId = event.nextId;
        switch (tabId) {
            case 'ngb-tab-0':
                this.emptyTableSus = false;
                this.emptyTableOnDemand = false;
                this.emptyTableOutStock = false;
                break;
            case 'ngb-tab-1':
                this.emptyTableSus = false;
                this.emptyTableOnDemand = false;
                this.emptyTableActive = false;
                break;
            case 'ngb-tab-2':
                this.emptyTableActive = false;
                this.emptyTableOnDemand = false;
                this.emptyTableOutStock = false;
                break;
            case 'ngb-tab-3':
                this.emptyTableSus = false;
                this.emptyTableActive = false;
                this.emptyTableOutStock = false;
                break;
            default:
                this.emptyTableSus = false;
                this.emptyTableActive = false;
                this.emptyTableOutStock = false;
                this.emptyTableOnDemand = false;
        }
    }

    PendingStockAllocation() {
        const count = this.pending_stock_allocation.length;
        return `Pending Stock Allocation (${count})`;
    }


    getOutofStock() {
        const count = this.list_outof_stock.length;
        return `Out Of Stock (${count})`;
    }

    getSuspendedPro() {
        const count = this.list_suspend.length;
        this.suspend = true
        return `Suspended (${count})`;
    }

    getOnDemandPro() {
        const count = this.consignmentProducts.length;
        this.onDemand = true;
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
            this.headActive = [
                {'Head': 'Image', 'FieldName': 'image'},
                {'Head': 'Title', 'FieldName': 'title'},
                {'Head': 'Selling Price', 'FieldName': 'price'},
                {'Head': 'Stock In Hand', 'FieldName': 'in_stock'},
                {'Head': 'Create Date', 'FieldName': 'createDate'},
                {'Head': 'Action', 'FieldName': ''},
            ];

            this.totalPages = Math.ceil(this.list_pages.length / this.list_pages2);
            this.onPageChange(1, 'ActivePro');
        }
    }

    clickSusEditProduct(event: any) {
        console.log('suspend Edit clicked!!!!!!!!')
    }

    async clickProduct(event: any) {
        const productCode = event.data.productCode;
        switch (event.x) {
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
                const {value: text} = await Swal.fire({
                    title: 'Enter a comment',
                    input: 'text',
                    inputPlaceholder: 'Enter your comment here',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'You need to write something!';
                        }
                    }

                });
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
                break;
            case 4:
                // out
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
                            product_code: productCode,
                            updatedBy: sessionStorage.getItem('userId')
                        };
                    } else {
                        payLoad = {
                            product_code: productCode,
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
                break;
            default:
                console.log("Invalid");
                break;
        }
    }

    ProductFilter(searchTerm: string): void {
        this.filteredProducts = this.list_pages.filter(product =>
            product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.categoryPath.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.totalPages = Math.ceil(this.filteredProducts.length / this.list_pages2);
        this.onPageChange(1, 'ActivePro');

        this.filterClickActive = 1;

        if (this.filteredProducts.length == 0) {
            this.emptyTableActive = true;
        } else {
            this.emptyTableActive = false;
        }
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

    popUpImage(event) {
        this.imageUrl = this.imagePathURI + event.image;
        this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    }

    popup(price: number, itemCode: String) {
        this.priceChangeVendor = sessionStorage.getItem('partnerId');
        this.oldPrice = price;
        this.itemCode = itemCode;
        this.modalRef = this.modal.open(this.pricePopup, {centered: true});
    }


    // popUpImage(index: number) {
    //   if (this.filteredPendingProducts.length !== 0) {
    //     this.imageUrl = this.imagePathURI + this.filteredPendingProducts[this.startIndex + index].image;
    //     this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    //   } else {
    //     this.imageUrl = this.imagePathURI + this.nonActiveProductsArray[this.startIndex + index].image;
    //     this.modalRef = this.modal.open(this.imagePopup, {centered: true});
    //   }
    // }

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
                this.onPageChange(1, 'PendingPro');
            }
        }
        if (this.nonActiveProductsArray.length === 0) {
            this.stopLoading();
        }
    }


    OutofStockFilter(searchTerm: string): void {
        this.filteredoutOfStock = this.list_outof_stock.filter(product =>
            product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.categoryPath.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.totalPagesOS = Math.ceil(this.filteredoutOfStock.length / this.list_pages2);
        this.onPageChange(1, 'OutofStock');

        // this.filterClickOutOfStock = 1;
        if (this.filteredoutOfStock.length == 0) {
            this.emptyTableOutStock = true;
        } else {
            this.emptyTableOutStock = false;
        }
    }

    filterOutofStockByBusinessName(searchTerm: string): void {
        this.filteredoutOfStock = this.list_outof_stock.filter(product =>
            product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.totalPagesOS = Math.ceil(this.filteredoutOfStock.length / this.list_pages2);
        this.onPageChange(1, 'OutofStock');
    }


    SuspendProductFilter(searchTerm: string): void {
        this.filteredSuspendProduct = this.list_suspend.filter(product =>
            product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.categoryPath.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.totalPagesSus = Math.ceil(this.filteredSuspendProduct.length / this.list_pages2);
        this.onPageChange(1, 'Suspend');

        if (this.filteredSuspendProduct.length == 0) {
            this.emptyTableSus = true
        } else {
            this.emptyTableSus = false
        }
    }

    SuspendProductFilterByBusinessName(searchTerm: string): void {
        this.filteredSuspendProduct = this.list_suspend.filter(product =>
            product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.totalPagesSus = Math.ceil(this.filteredSuspendProduct.length / this.list_pages2);
        this.onPageChange(1, 'Suspend');
    }

    OnDemandProductFilter(searchTerm: string): void {
        this.filteredOnDemandProduct = this.consignmentProducts.filter(product =>
            product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.categoryPath.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.totalPagesOnDemand = Math.ceil(this.filteredOnDemandProduct.length / this.list_pages2);
        this.onPageChange(1, 'PendingOnDemand');

        if (this.filteredOnDemandProduct.length == 0) {
            this.emptyTableOnDemand = true
        } else {
            this.emptyTableOnDemand = false
        }
    }

    // onDemand
    getConsignmentProducts() {
        const payloard = {
            vendor: sessionStorage.getItem('partnerId')
        };
        this.productService.getOnDemandProduct(payloard).subscribe(
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
                        productCode: data.data[i].onDemand_products.variationCode,
                        title: data.data[i].onDemand_products.title,
                        in_stock: data.data[i].onDemand_products.quantity,
                        createDate: data.data[i].onDemand_products.createDate,
                        variationTheme: data.data[i].onDemand_products.variationTheme,
                        variationId: data.data[i].onDemand_products.variationId,
                        categoryColor: data.data[i].onDemand_products.color,
                        categorySizes: data.data[i].onDemand_products.sizes,
                        categoryPath: data.data[i].category_path,
                        image: data.data[i].product_img.split('/product')[1],
                        Action: ''
                    };
                    this.consignmentProducts.push(or);
                }
                this.headOnDemand = [
                    // 'Image', 'Title', 'Create Date', 'In Stock', 'Add Stock',
                    {'Head': 'Image', 'FieldName': 'image'},
                    {'Head': 'Title', 'FieldName': 'title'},
                    {'Head': 'In Stock', 'FieldName': 'in_stock'},
                    {'Head': 'Add Stock', 'FieldName': 'createDate'},
                    {'Head': 'Create Date', 'FieldName': 'price'},
                    {'Head': 'Action', 'FieldName': ''},
                ];
                this.totalPagesOnDemand = Math.ceil(this.consignmentProducts.length / this.list_pages2);
                this.onPageChange(1, 'PendingOnDemand');
            }
        }
    }

    // pendingStockAllocationAction(productDetail: any){
    //   this.filtereDpendingStockByOnDemand = this.consignmentProducts.filter((item) => (item as any).productCode === productDetail.productCode);
    //   if (this.filtereDpendingStockByOnDemand.length === 0){
    //     this.filtereDpendingStockByOnDemand[0] = productDetail;
    //     this.pendingStockShare.setDataArray(this.filtereDpendingStockByOnDemand);
    //     const url = 'shipment/add-shipment';
    //     this.router.navigate([url]);
    //       }else{
    //     this.onDemandTab.select('ondemandTab');
    //       }
    // }

    // asitha
    UpdateVirtualStocks(row: any) {
        console.log('input Value!!!')
        console.log(this.vstock[this.startIndex + row])
        if (this.vstock[this.startIndex + row] === null || this.vstock[this.startIndex + row] === undefined || isNaN(this.vstock[this.startIndex + row]) || this.stockUpdate) {
            Swal.fire(
                'error!',
                'Invalid stock value. Please enter a valid number.',
                'error'
            );
            this.vstock[this.startIndex + row] = null;
            return;
        }

        const payloard = {
            productCode: this.filteredOnDemandProduct.length > 0 ? this.filteredOnDemandProduct[this.startIndex + row].productCode : this.consignmentProducts[this.startIndex + row].productCode,
            vendor: sessionStorage.getItem('partnerId'),
            quantity: this.vstock[this.startIndex + row],
            variationTheme: this.filteredOnDemandProduct.length > 0 ? this.filteredOnDemandProduct[this.startIndex + row].variationTheme : this.consignmentProducts[this.startIndex + row].variationTheme,
            variationId: this.filteredOnDemandProduct.length > 0 ? this.filteredOnDemandProduct[this.startIndex + row].variationId : this.consignmentProducts[this.startIndex + row].variationId
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

    loadPage(event) {
        window.open('https://www.kapruka.com/buyonline/' + event.title.replace(/\s+/g, '-').toLowerCase() + '/kid/' + 'ef_pc_' + event.productCode, '_blank');
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
        this.onPageChange(1, 'EditProApproval');
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
        this.onPageChange(1, 'EditImgApproval');
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
            this.headOut = [
                {'Head': 'Image', 'FieldName': 'image'},
                {'Head': 'Title', 'FieldName': 'title'},
                {'Head': 'Selling Price', 'FieldName': 'price'},
                {'Head': 'Stock In Hand', 'FieldName': 'in_stock'},
                {'Head': 'Create Date', 'FieldName': 'createDate'},
            ];

            this.totalPagesOS = Math.ceil(this.list_outof_stock.length / this.list_pages2);
            this.onPageChange(1, 'OutofStock');
        }
    }


    getSuspendedProducts() {
        const busName = sessionStorage.getItem('businessName');
        const userRole = sessionStorage.getItem('userRole');
        const categoryID = sessionStorage.getItem('userId');

        this.productService.getSuspendedProofVendor(busName, categoryID).subscribe(
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
            this.onPageChange(1, 'Suspend');
        }
    }

    onPageChange(page: number, Descrip: string) {
        if (Descrip === 'ActivePro') {
            this.currentPage = page;
        } else if (Descrip === 'OutofStock') {
            this.currentPageOS = page;
        } else if (Descrip === 'Suspend') {
            this.currentPageSus = page;
        } else if (Descrip === 'PendingOnDemand') {
            this.currentPageOnDemand = page;
        }
        // Fetch or filter your table data based on the new page
        this.updateTableData(Descrip);
    }

    updateTableData(Descrip: string) {
        if (Descrip === 'ActivePro') {
            const startIndex = (this.currentPage - 1) * this.list_pages2;
            const endIndex = startIndex + this.list_pages2;
            this.startIndex = startIndex;
            if (this.filteredProducts.length > 0) {
                this.paginatedItems = this.filteredProducts.slice(startIndex, endIndex);
            } else {
                this.paginatedItems = this.list_pages.slice(startIndex, endIndex);
            }
        } else if (Descrip === 'OutofStock') {
            const startIndex = (this.currentPageOS - 1) * this.list_pages2;
            const endIndex = startIndex + this.list_pages2;
            this.startIndex = startIndex;
            if (this.filteredoutOfStock.length > 0) {
                this.paginatedOutofStock = this.filteredoutOfStock.slice(startIndex, endIndex);
            } else {
                this.paginatedOutofStock = this.list_outof_stock.slice(startIndex, endIndex);
            }
        } else if (Descrip === 'Suspend') {
            const startIndex = (this.currentPageSus - 1) * this.list_pages2;
            const endIndex = startIndex + this.list_pages2;
            this.startIndex = startIndex;

            if (this.filteredSuspendProduct.length > 0) {
                this.paginatedSuspend = this.filteredSuspendProduct.slice(startIndex, endIndex);
            } else {
                this.paginatedSuspend = this.list_suspend.slice(startIndex, endIndex);
            }
        } else if (Descrip === 'PendingOnDemand') {
            const startIndex = (this.currentPageOnDemand - 1) * this.list_pages2;
            const endIndex = startIndex + this.list_pages2;
            this.startIndex = startIndex;

            if (this.filteredOnDemandProduct.length > 0) {
                this.paginatedOnDemand = this.filteredOnDemandProduct.slice(startIndex, endIndex);
            } else {
                this.paginatedOnDemand = this.consignmentProducts.slice(startIndex, endIndex);
            }
        }
    }

    filterAllProducts(searchTerm: string): void {

        this.filteredProducts = this.list_pages.filter(product =>
            product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.totalPages = Math.ceil(this.filteredProducts.length / this.list_pages2);
        this.onPageChange(1, 'ActivePro');
    }

    onVstockChange(row) {
        if (this.filteredOnDemandProduct.length > 0) {
            if (this.vstock[this.startIndex + row] + this.filteredOnDemandProduct[this.startIndex + row].in_stock < 0) {
                Swal.fire({
                    title: 'Add Stock Must Be More Than In Stock',
                    text: 'Please enter a valid stock value.',
                    icon: 'warning',
                });
                this.vstock[this.startIndex + row] = null;
                this.stockUpdate = true;
            } else {
                this.stockUpdate = false;
            }
        } else {
            if (this.consignmentProducts[this.startIndex + row].in_stock + this.vstock[this.startIndex + row] < 0) {
                Swal.fire({
                    title: 'Add Stock Must Be More Than In Stock',
                    text: 'Please enter a valid stock value.',
                    icon: 'warning',
                });
                this.vstock[this.startIndex + row] = null;
                this.stockUpdate = true;
            } else {
                this.stockUpdate = false;
            }
        }
    }
}
