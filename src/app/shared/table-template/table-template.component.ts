import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from "../../../environments/environment.prod";

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.scss']
})
export class TableTemplateComponent implements OnInit {
  public imagePathURI = environment.imageURIENV;
  public imagedefaultPathURI = '';
  // public qaTables = false;
  // public EnablePriceEdit = false;
  // public EnableStockEdit = false;

  @Input() vStock: any[] = [];
  @Input() HeadArray: any[] = [];
  @Input() DataArray: any[] = [];
  @Input() active: boolean = false;
  @Input() suspend: boolean = false;
  @Input() onDemand: boolean = false;
  @Input() nonActiveAdmin: boolean = false;
  @Input() nonActivePartner: boolean = false;
  @Input() pendingStockPartner: boolean = false;
  @Input() pendingStockAdmin: boolean = false;
  @Input() editTab: boolean = false;
  @Input() stillLoading: boolean = true;
  @Input() startIndex: number;

  @Output() onClick = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onLoadPage = new EventEmitter<any>();
  @Output() onAddStock = new EventEmitter<any>();
  @Output() onReview = new EventEmitter<any>();
  @Output() onEditProduct = new EventEmitter<any>();
  @Output() onPopUpImg = new EventEmitter<any>();
  @Output() check = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    this.showElerments();
  }

  stopLoading(){
    this.stillLoading = false;
  }
  showElerments() {
    // if (sessionStorage.getItem('userRole') === 'ROLE_PARTNER') {
    //   this.qaTables = true;
    //   this.EnablePriceEdit = true;
    //   this.EnableStockEdit = true;
    // } else if (sessionStorage.getItem('userRole') === 'ROLE_QA') {
    //   this.qaTables = false;
    // } else if (sessionStorage.getItem('userRole') === 'ROLE_ADMIN') {
    //   this.qaTables = true;
    //   this.EnableStockEdit = true;
    // } else if (sessionStorage.getItem('userRole') === 'ROLE_CATEGORY_MANAGER') {
    //   this.qaTables = true;
    // } else if (sessionStorage.getItem('userRole') === 'ROLE_STORES_MANAGER') {
    //   this.qaTables = true;
    // }
    const Admin= sessionStorage.getItem('userRole') === 'ROLE_ADMIN'
    if (Admin){
      setTimeout(() => {
        if (this.DataArray.length === 0) {
          this.stopLoading();
        }
      }, 10000);
    }else{
        if (this.DataArray.length === 0) {
          this.stopLoading();
        }
    }
  }

  popUpImageActive(data){
    this.onPopUpImg.emit(data)
  }
  onVstockChange(i){
    this.check.emit(i)
  }
  loadPage(data){
    this.onLoadPage.emit(data)
  }
  edit(data,x){
    this.onClick.emit({ data, x })
  }

  addStock(data){
    this.onAddStock.emit(data)
  }
  editSus(data){
    this.onEdit.emit(data)
  }

  viewProduct(data){
    this.onEditProduct.emit(data)
  }
  viewImg(data,x){
    this.onClick.emit({ data, x })
  }
  view(data, x){
    this.onClick.emit({ data, x })
  }

  delete(data, x){
    this.onClick.emit({ data, x })
  }

  out(data, x){
    this.onClick.emit({ data, x })
  }

  review(data){
    this.onReview.emit(data)
  }

  onImageError(event: any): void {
    this.imagedefaultPathURI = this.imagePathURI.replace('/product', '');
    event.target.src = this.imagedefaultPathURI + '/1.jpg';
  }

}
