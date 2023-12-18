import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {NavService} from '../../service/nav.service';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile: boolean;
  public imageName = '';
  public userRole = sessionStorage.getItem('userRole');
  public tempCode = sessionStorage.getItem('temp_code');
  public userBool = false;
  public userName = sessionStorage.getItem('businessName');
  userRoleType = 'N/A';
  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(public navServices: NavService, private authService: AuthService, private router: Router) {
    if (this.userRole === 'ROLE_ADMIN') {
      this.userRoleType = 'ADMIN';
      this.imageName = 'man.png';
    } else if (this.userRole === 'ROLE_PARTNER') {
      this.userRoleType = 'PARTNER';
      this.getPartnerImage();
    } else if (this.userRole === 'ROLE_QA') {
      this.userRoleType = 'QUALITY ASSURANCE';
      this.imageName = 'qa_user.jpeg';
    } else if (this.userRole === 'ROLE_GUEST') {
      this.userRoleType = 'GUEST';
      this.imageName = 'man.png';
    } else if (this.userRole === 'ROLE_CATEGORY_MANAGER') {
      this.userRoleType = 'CATEGORY MANAGER';
      this.imageName = 'man.png';
    } else if (this.userRole === 'ROLE_STORES_MANAGER') {
      this.userRoleType = 'STORES_MANAGER';
      this.imageName = 'man.png';
    } else {
      this.userRoleType = 'USER';
      this.imageName = 'man.png';
    }
  }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  right_side_bar() {
    this.right_sidebar = !this.right_sidebar;
    this.rightSidebarEvent.emit(this.right_sidebar);
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }


  ngOnInit() {
  }


  getPartnerImage() {
    let payloard = {
      temp_code: sessionStorage.getItem('temp_code')
    };
    this.authService.getImageByPartner(payloard).subscribe(
      data => this.manageGetImageByPartner(data),
    );
  }

  manageGetImageByPartner(data) {
    if (data.data == null) {
      this.imageName = 'man.png';
    } else {
      this.imageName = data.data.image_name;
    }

  }

  navigateFunction() {
    let url = 'users/settings/profile/' + this.tempCode;
    this.router.navigate([url]);
  }

  navigateToNotification() {
    let url = 'users/user-notifications';
    this.router.navigate([url]);
  }

  navigateEditCategoryView() {
    let url = 'users/edit-partner-category/' + this.tempCode;//T00004
    this.router.navigate([url]);
  }
  reloadPages() {
    window.location.reload();
  }
}
