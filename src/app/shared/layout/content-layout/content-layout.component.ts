import {Component, Input, OnInit} from '@angular/core';
import {NavService} from '../../service/nav.service';
import {trigger, transition, useAnimation} from '@angular/animations';
import {bounce, zoomOut, zoomIn, fadeIn, bounceIn} from 'ng-animate';
import {HttpClientService} from '../../service/http-client.service';
import {ProductService} from '../../service/product.service';
import {DashboardService} from '../../service/dashboard.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  animations: [
    trigger('animateRoute', [transition('* => *', useAnimation(fadeIn, {
      // Set the duration to 5seconds and delay to 2 seconds
      //params: { timing: 3}
    }))])
  ]
})
export class ContentLayoutComponent implements OnInit {

  public right_side_bar: boolean;
  public layoutType: string = 'RTL';
  public layoutClass: boolean = false;
  isGuest = false;
  isPartner = false;
  isApproved = 0;
  fillInfo = 'stepper-item';
  pendingApproval = 'stepper-item';
  bankDetails = 'stepper-item';
  listProduct = 'stepper-item';
  userId = '';
  @Input()
  public TempCode = '';
  partnerCode = '';
  progressBar = true;

  constructor(public navServices: NavService, private userService: HttpClientService, private productService: ProductService, private dashboard: DashboardService) {

  }

  ngOnInit() {

  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  public rightSidebar($event) {
    this.right_side_bar = $event;
  }

  public clickRtl(val) {
    if (val === 'RTL') {
      document.body.className = 'rtl';
      this.layoutClass = true;
      this.layoutType = 'LTR';
    } else {
      document.body.className = '';
      this.layoutClass = false;
      this.layoutType = 'RTL';
    }
  }


}
