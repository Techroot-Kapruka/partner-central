import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AnalyticsProductService} from '../../../shared/service/analytics-product.service';
import {environment} from "../../../../environments/environment.prod";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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

  @ViewChild('imagePopup') imagePopup: ElementRef;
  constructor(private router: Router, private activatedroute: ActivatedRoute, private analyticsService: AnalyticsProductService, private modal: NgbModal) {
    this.getListProductView();
  }

  ngOnInit(): void {
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
  getListProductView() {
    const object = {
      vendor_code: sessionStorage.getItem('partnerId')
    };
    this.analyticsService.getListProductView(object).subscribe(
      data => this.manageGetListProductView(data)
    );
  }

  manageGetListProductView(data) {
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
        productImage : data.data[i].productImage,
        rateCart : data.data[i].rateCart,
        rateOrder : data.data[i].rateOrder
      };
      this.analyticsProductClickList.push(or);
    }
    this.totalPages = Math.ceil(this.analyticsProductClickList.length / this.list_pages2);
    this.onPageChange(1,'ActivePro')
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
      this.imageUrl = this.imagePathURI + this.analyticsProductClickList[this.startIndex + index].image;
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
