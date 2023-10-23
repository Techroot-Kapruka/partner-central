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
  public temporyCode: string = '';
  public updateUserId: string = '';
  public msgHeaderName: string = '';
  public sendEmail: string = '';
  public msgDescription = [];
  public descType = '';
  public vendorCode: string = '';
  public productCode: string = '';
  private isAvailbleComment = true;

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
        let payLoard = {
          temp_code: this.vendorCode
        };
        this.httpClientServiceDeclined.getSelectedPartnerById(payLoard).subscribe(
          data => this.userDataPassing(data, 'Vendor'),
        );
      } else {

        this.productCode = this.msgDescription[1];
        let payLoard = {
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

      const payLoard = {
        product_code: this.productCode,
        rejectReason: this.declinedMsgBox.value.decilinedMessage,
        rejecteddBy: this.updateUserId,
      };

      if (this.declinedMsgBox.value.decilinedMessage != '') {
        this.httpProductServiceDeclined.rejectProduct(payLoard).subscribe(
          data => this.manageDeclined(data),
        );
      } else {
        this.isAvailbleComment = false;
        document.getElementById('declinedMessageLBL').style.display = 'block';
      }
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
      this.router.navigate(['/digital/digital-product-list']);
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
