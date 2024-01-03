import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {HttpClientService} from '../../shared/service/http-client.service';
import {ProductService} from '../../shared/service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-declined-message',
  templateUrl: './declined-message.component.html',
  styleUrls: ['./declined-message.component.scss']
})
export class DeclinedMessageComponent implements OnInit {
  public declinedMsgBox: FormGroup;
  public temporyCode = '';
  public updateUserId = '';
  public msgHeaderName = '';
  public sendEmail = '';
  public msgDescription = [];
  public descType = '';
  public vendorCode = '';
  public productCode = '';
  private isAvailbleComment = true;

  checkedValues: string[] = [];

  constructor(private routeData: ActivatedRoute, private httpProductServiceDeclined: ProductService, private httpClientServiceDeclined: HttpClientService, private router: Router) {
    this.declinedMsgBox = new FormGroup({
      decilinedMessage: new FormControl(''),
    });
    this.routeData.paramMap.subscribe(params => {
      this.temporyCode = params.get('id');

      this.msgDescription = this.temporyCode.split('-');
      this.descType = this.msgDescription[0];

      if (this.descType.startsWith('Vendor')) {
        this.vendorCode = this.msgDescription[1];
        const payLoard = {
          temp_code: this.vendorCode
        };
        this.httpClientServiceDeclined.getSelectedPartnerById(payLoard).subscribe(
          data => this.userDataPassing(data, 'Vendor'),
        );
      } else {

        this.productCode = this.msgDescription[1];
        const payLoard = {
          product_code: this.productCode
        };
        this.httpProductServiceDeclined.getSelecedProductByEdit(payLoard).subscribe(
          data => this.userDataPassing(data, 'Product'),
        );
      }
    });
  }

  ngOnInit(): void {
  }

  declinedPartnerorProduct() {
    // Delete Vendor
    if (this.descType.startsWith('Vendor')) {
      const payLoard = {
        temp_code: this.vendorCode,
        comment: this.declinedMsgBox.value.decilinedMessage,
        updatedBy: this.updateUserId,
        email: this.sendEmail,
      };

      if (this.declinedMsgBox.value.decilinedMessage != '') {
        this.httpClientServiceDeclined.addDeclinedMessage(payLoard).subscribe(
          data => this.manageDeclined(data),
        );
      } else {
        this.isAvailbleComment = false;
        document.getElementById('declinedMessageLBL').style.display = 'block';
      }

      // Delete Product
    } else {
      const checkboxData = {
        check1: 'Product Title',
        check2: 'Product Image',
        check3: 'Product Description',
        check4: 'Mismatched - Main Category',
        check5: 'Mismatched - Sub Category',
        check6: 'Mismatched - Sub Sub Category',
        check7: 'Inappropriate Content',
        check8: 'Copyright Violations',
        check9: 'Safety Compliance',
        check10: 'Unapproved Brands',
        check11: 'Restricted or Prohibited Items',
        check12: 'Non-compliance with Policies',
        check13: 'Unreasonable Pricing',
        check14: 'Shipping Issues',
        check15: 'Repeated Violations',
      };

      this.checkedValues = Object.keys(checkboxData).filter((checkboxId) => {
        const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
        return checkbox.checked;
      }).map((checkedId) => checkboxData[checkedId]);

      if (this.checkedValues.length === 0 && this.declinedMsgBox.value.decilinedMessage === ''){
        this.isAvailbleComment = false;
        Swal.fire(
          'Oops',
          'Please select Reason',
          'warning'
        );
        return;
      }

      for (let x = 0; x < this.checkedValues.length; x++){
        this.declinedMsgBox.value.decilinedMessage += this.checkedValues;
      }
      const payLoard = {
        product_code: this.productCode,
        rejectReason: this.declinedMsgBox.value.decilinedMessage,
        rejecteddBy: this.updateUserId,
      };

      this.httpProductServiceDeclined.rejectProduct(payLoard).subscribe(
        data => this.manageDeclined(data),
      );
    }
  }

  private userDataPassing(data, desc) {

    if (desc.startsWith('Product')) {
      this.updateUserId = sessionStorage.getItem('userId');
      this.msgHeaderName = data.data.product.title;
      this.sendEmail = '';
    } else {
      this.updateUserId = data.data.partnerUser.id;
      this.msgHeaderName = data.data.contactPersonName;
      this.sendEmail = data.data.partnerUser.email;
    }
  }

  backToLIst() {
    if (this.descType.startsWith('Vendor')) {
      this.router.navigate(['/users/list-user']);
    } else {
      this.router.navigate(['/products/digital/digital-product-list']);
    }
  }

  private manageDeclined(data: any) {

    Swal.fire(
      'Rejected Successfully!',
      data.message,
      'success'
    );
    this.backToLIst();
  }

  validateHolder() {
    document.getElementById('decilinedMessage').style.borderColor = 'gray';
    document.getElementById('declinedMessageLBL').style.display = 'none';
  }
}
