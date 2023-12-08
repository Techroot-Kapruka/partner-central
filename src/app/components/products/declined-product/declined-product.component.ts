import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../shared/service/product.service';

@Component({
  selector: 'app-declined-product',
  templateUrl: './declined-product.component.html',
  styleUrls: ['./declined-product.component.scss']
})
export class DeclinedProductComponent implements OnInit {

  public declinedMsgBox: FormGroup;
  public msgDescription = [];
  public description = '';
  public temporyCode = '';
  public productCode = '';
  public editOrDelete = '';
  public descYes = '';
  public descNo = '';
  public formDesc = '';
  public isEdit = false;

  constructor(private routeData: ActivatedRoute, private productService: ProductService, private router: Router) {
    this.declinedMsgBox = new FormGroup({
      decilinedMessage: new FormControl(''),
    });

    this.routeData.paramMap.subscribe(params => {
      this.temporyCode = params.get('id');
      this.msgDescription = this.temporyCode.split('-');

      // productList || productSearch
      this.formDesc = this.msgDescription[0];
      this.editOrDelete = this.msgDescription[1];
      this.productCode = this.msgDescription[2];

      if (this.editOrDelete === 'Edit') {
        this.description = 'This action will make your product temporary marked Out Of Stock from the Kapruka Website';
        this.isEdit = true;
        this.descYes = ' Yes ';
        this.descNo = ' No ';
      } else {
        this.description = 'Submit The Reason For Delete Product';
        this.isEdit = false;
        this.descYes = ' Delete ';
        this.descNo = ' Cancel ';
      }
    });
  }

  ngOnInit(): void {
  }

  approveProcess() {
    if (this.editOrDelete === 'Edit') {
      const payLoad = {
        product_code: this.productCode,
        updatedBy: sessionStorage.getItem('userId')
      };
      this.productService.updateProductStock(payLoad).subscribe(
        error => (error.status)
      );
      Swal.fire('Done!', '', 'success').then((result) => {
        this.cancelProcess();
      });

    } else {
      const deleteReason = (document.getElementById('decilinedMessage') as HTMLInputElement).value.trim();

      if (deleteReason === '' || deleteReason === '0') {
        document.getElementById('declinedMessageLBL').style.display = 'block';
      } else {
        const payLoad = {
          product_code: this.productCode,
          rejecteddBy: sessionStorage.getItem('userId'),
          rejectReason: deleteReason
        };

        this.productService.deleteProduct(payLoad).subscribe(
          data => this.cancelProcess(),
          error => (error.status)
        );

        Swal.fire('Saved!', '', 'success');
      }
    }
  }

  cancelProcess() {
    if (this.formDesc === 'productSearch') {
      this.router.navigate(['products/digital/product-search']);
    } else {
      this.router.navigate(['products/digital/digital-product-list']);
    }
  }

  validateReason() {
    document.getElementById('decilinedMessage').style.borderColor = 'gray';
    document.getElementById('declinedMessageLBL').style.display = 'none';
  }
}
