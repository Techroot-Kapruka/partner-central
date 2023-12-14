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
  public badge = [];
  public elementStatus = [];
  // public qaTables = false;
  // public EnablePriceEdit = false;
  // public EnableStockEdit = false;

  @Input() vStock: any[] = [];
  @Input() HeadArray: any[] = [];
  @Input() DataArray: any[] = [];
  @Input() active: boolean = false;
  @Input() suspend: boolean = false;
  @Input() onDemand: boolean = false;
  @Input() outOfStock: boolean = false;
  @Input() nonActiveAdmin: boolean = false;
  @Input() nonActivePartner: boolean = false;
  @Input() pendingStockPartner: boolean = false;
  @Input() pendingStockAdmin: boolean = false;
  @Input() editTab: boolean = false;
  @Input() stillLoading: boolean = true;
  @Input() startIndex: number;
  @Input() emptyTable: boolean = false;

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
        }else if (this.pendingStockPartner){
          this.stopLoading();
        }
    }

    if (this.editTab) {
      for (let i = 0; i < this.DataArray.length; i++) {
        let editType: any;
        editType = this.DataArray[i].type;
        if (editType.startsWith('E')) {
          this.badge[i] = 'badge-success';
          this.elementStatus[i] = 'Edit Request';
        } else if (editType.startsWith('R')) {
          this.badge[i] = 'badge-danger';
          this.elementStatus[i] = 'Remove Request';
        }
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
    this.onAddStock.emit(data);
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
