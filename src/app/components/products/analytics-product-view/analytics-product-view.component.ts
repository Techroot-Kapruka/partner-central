import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AnalyticsProductService} from '../../../shared/service/analytics-product.service';
import {environment} from "../../../../environments/environment.prod";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductService} from "../../../shared/service/product.service";

@Component({
  selector: 'app-analytics-product-view',
  templateUrl: './analytics-product-view.component.html',
  styleUrls: ['./analytics-product-view.component.scss']
})
export class AnalyticsProductViewComponent implements OnInit {
  public imagePathURI = environment.imageURIENV
  public analyticsProductClickList = [];
  public list_pages2 = 10;
  public selected = [];
  currentPage = 1; // Current page
  totalPages = 0; // Total Page
  public startIndex;
  public paginatedItems = [];
  public filteredProducts: any = [];
  stillLoading = true;
  imageUrl: any;
  modalRef: any;
  public imageDefaultPathURI = '';

  public isAdmin = false;
  public partnerArray = [];

  @ViewChild('imagePopup') imagePopup: ElementRef;
  constructor(private router: Router, private analyticsService: AnalyticsProductService,
              private modal: NgbModal, private productService: ProductService) {
    this.getListProductView();
    this.getPartner();
    const sessionUser = sessionStorage.getItem('userRole');
    if(sessionUser === 'ROLE_ADMIN'){
      this.showHighestViewsForAdmin();
    }
  }

  ngOnInit(): void {
  }

  getPartner(): void {
    const sessionUser = sessionStorage.getItem('userRole');
    if (sessionUser === 'ROLE_ADMIN' || sessionUser === 'ROLE_STORES_MANAGER') {
      this.isAdmin = true;
      this.productService.getPartnerAll().subscribe(
        data => this.managePartners(data),
      );
    }
  }
  managePartners(data) {
    let pr = {};
    const array = data.data.length;
    const partnerValue = data.data;
    for (let i = 0; i < array; i++) {
      pr = {
        name: partnerValue[i].businessName,
        value: partnerValue[i].partner_u_id
      };
      this.partnerArray.push(pr);
    }
  }

  stopLoading() {
    this.stillLoading = false;
  }
  onPageChange(page: number, Descrip: string) {
    if (Descrip === 'ActivePro') {
      this.currentPage = page;
    }
    this.updateTableData(Descrip);
  }

  onSelect({selected}) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

  }
  getSelectedPartnerAnalytics() {
    const sessionUser = sessionStorage.getItem('userRole');
    let object = {};
    if (sessionUser === 'ROLE_PARTNER') {
      object = {
        vendor_code: sessionStorage.getItem('partnerId')
      };
    }else {
      const name = (document.getElementById('select_pro2') as HTMLInputElement).value;
      object = {
        vendor_code: name
      };
    }
    this.analyticsService.getListProductView(object).subscribe(
      data => this.manageGetListProductView(data)
    );
  }
  getListProductView() {
    const object = {
      vendor_code: sessionStorage.getItem('partnerId')
    };
    this.analyticsService.getListProductView(object).subscribe(
      data => this.manageGetListProductView(data)
    );
  }

  manageGetListProductView(data) {
    console.log(data)
    this.startIndex = 0;
    this.analyticsProductClickList = [];
    for (let i = 0; i < data.data.length; i++) {
      const or = {
        productId: data.data[i].productId,
        productName: data.data[i].productName,
        productViewTotal: data.data[i].productViewTotal,
        productAddToCartTotal : data.data[i].productAddToCartTotal,
        productOrderTotal : data.data[i].productOrderTotal,
        categoryPath : data.data[i].categoryPath,
        productImage: (data.data[i].productImage && data.data[i].productImage ? data.data[i].productImage.split('/product')[1] : '') || '',
        rateCart : data.data[i].rateCart,
        rateOrder : data.data[i].rateOrder
      };
      this.analyticsProductClickList.push(or);
    }
    this.totalPages = Math.ceil(this.analyticsProductClickList.length / this.list_pages2);
    this.onPageChange(1,'ActivePro')
  }
  showHighestViewsForAdmin(){
    this.analyticsService.showHighestViewsForAdmin().subscribe(
      data => this.manageGetListProductView(data)
    );
  }

  updateTableData(Descrip: string) {
    if (Descrip === 'ActivePro') {
      const startIndex = (this.currentPage - 1) * this.list_pages2;
      const endIndex = startIndex + this.list_pages2;
      this.startIndex = startIndex;
      this.paginatedItems = this.analyticsProductClickList.slice(startIndex, endIndex);

    }
  }

  loadPage(index: number) {
      window.open('https://www.kapruka.com/buyonline/' + this.analyticsProductClickList[this.startIndex + index].productName.replace(/\s+/g, '-').toLowerCase() + '/kid/' + 'ef_pc_' + this.analyticsProductClickList[this.startIndex + index].productId, '_blank');
  }

  popUpImageActive(index: number) {
      this.imageUrl = this.imagePathURI + this.analyticsProductClickList[this.startIndex + index].productImage;
      this.modalRef = this.modal.open(this.imagePopup, {centered: true});
  }

  closePopup() {
    this.modalRef.close();
    this.imageUrl = undefined;
  }
  onImageError(event: any): void {
    this.imageDefaultPathURI = this.imagePathURI.replace('/product', '');
    event.target.src = this.imageDefaultPathURI + '/1.jpg';
  }

}
