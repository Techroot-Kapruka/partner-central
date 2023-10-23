import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from '../../../shared/service/product.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
  public ids = '';
  public name = '';
  public indexArr = [];
  public imageUrl = '';
  public cakeCagtegories = 'none';
  public cakeCakeGroup = 'none';
  public cakeType = 'none';
  public cakeWeight = 'none';

  constructor(private router: Router, private _Activatedroute: ActivatedRoute, private modalService: NgbModal, private productService: ProductService) {

    this._Activatedroute.paramMap.subscribe(params => {
      this.ids = params.get('id');
      this.name = params.get('name');
      this.getProductById();
    });
  }

  ngOnInit(): void {
  }

  getProductById() {
    let pro_pr = sessionStorage.getItem('productPrefix');
    let payloard = {
      businessName: this.name,
      productPrefix: JSON.parse(pro_pr)
    };
    this.productService.getSpecialGiftsByPrefixSet2(payloard).subscribe(
      data => this.manageGetSpecialGiftsByPrefixSet(data),
    );
  }

  manageGetSpecialGiftsByPrefixSet(data) {
    this.indexArr = [];
    for (let i = 0; i < data.data.length; i++) {
      if (data.data[i].productID === this.ids) {
        this.indexArr.push(data.data[i]);
      }
    }

    var text = this.indexArr[0].productID;
    var dataz = '';
    for (var i = 0; i < 4; i++) {
      dataz += text.charAt(i);

    }

    (document.getElementById('txt_proCode') as HTMLInputElement).value = this.indexArr[0].productID;
    (document.getElementById('txt_availability') as HTMLInputElement).value = this.indexArr[0].available;
    (document.getElementById('txt_description') as HTMLInputElement).value = this.indexArr[0].description;
    // (document.getElementById('txt_deliveryFree') as HTMLInputElement).value = this.indexArr[0].deliveryType;
    (document.getElementById('txt_specialNotice') as HTMLInputElement).value = this.indexArr[0].specialNotes;
    (document.getElementById('txt_proName') as HTMLInputElement).value = this.indexArr[0].name;
    (document.getElementById('txt_brand') as HTMLInputElement).value = this.indexArr[0].brand;
    (document.getElementById('breadcrum') as HTMLInputElement).innerHTML = this.indexArr[0].type + ' > ' + this.indexArr[0].subType + ' > ' + this.indexArr[0].subSubType;
    this.imageUrl = '';
    if ('cake' === dataz) {
      this.imageUrl = 'https://www.kapruka.com/shops/specialGifts/additionalImages/large/' + this.indexArr[0].imageName;
    } else {
      this.imageUrl = 'https://www.kapruka.com/shops/specialGifts/productImages/' + this.indexArr[0].imageName;
    }

    if (this.indexArr[0].type === 'NA' && this.indexArr[0].subType === 'NA' && this.indexArr[0].subSubType === 'NA') {
      document.getElementById('bedcrumss').style.display = 'none';
    } else {
      document.getElementById('bedcrumss').style.display = 'block';
    }

    let element = '';
    if (this.indexArr[0].cake_cagtegories != 'NA') {
      this.cakeCagtegories = 'block';
      (document.getElementById('txt_cake_cagtegories') as HTMLInputElement).value = this.indexArr[0].cake_cagtegories;
    }

    if (this.indexArr[0].cake_cake_group != 'NA') {
      this.cakeCakeGroup = 'block';
      (document.getElementById('txt_cake_cake_group') as HTMLInputElement).value = this.indexArr[0].cake_cake_group;
    }

    if (this.indexArr[0].cake_type != 'NA') {
      this.cakeType = 'block';
      (document.getElementById('txt_cake_type') as HTMLInputElement).value = this.indexArr[0].cake_type;
    }

    if (this.indexArr[0].cake_weight != 'NA') {
      this.cakeWeight = 'block';
      (document.getElementById('txt_cake_weight') as HTMLInputElement).value = this.indexArr[0].cake_weight;
    }
  }

  backToLIst() {
    //
    let url = 'products/digital/digital-product-list';
    this.router.navigate([url]);
  }
}
