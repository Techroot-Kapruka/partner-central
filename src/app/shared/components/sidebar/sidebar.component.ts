import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {NavService, Menu} from '../../service/nav.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

  public menuItems: Menu[];
  public url: any;
  public fileurl: any;
  public userName = sessionStorage.getItem('contactPersonName');
  public userRole = sessionStorage.getItem('userRole');
  public userRoleType = 'N/A';
  public imageName = '';

  constructor(private router: Router, public navServices: NavService, private authService: AuthService) {

    if (this.userRole === 'ROLE_ADMIN') {
      this.userRoleType = 'ADMIN';
      this.imageName = 'man.png';
    } else if (this.userRole === 'ROLE_PARTNER') {
      this.userRoleType = 'PARTNER';
      this.getPartnerImage();
    } else if (this.userRole === 'ROLE_QA') {
      this.userRoleType = 'QUALITY ASSURANCE';
      this.imageName = 'qa_user.jpeg';
    }else if (this.userRole === 'ROLE_GUEST') {
      this.userRoleType = 'GUEST';
      this.imageName = 'man.png';
    }else  if (this.userRole === 'ROLE_CATEGORY_MANAGER'){
      this.userRoleType = 'CATEGORY MANAGER';
      this.imageName = 'man.png';
    } else if (this.userRole === 'ROLE_STORES_MANAGER') {
      this.userRoleType = 'STORES_MANAGER';
      this.imageName = 'man.png';
    }else if (this.userRole === 'ROLE_SUPER_ADMIN'){
      this.userRoleType = 'SUPER ADMIN';
      this.imageName = 'man.png';
    }else {
      this.userRoleType = 'USER';
      this.imageName = 'man.png';
    }

    this.navServices.items.subscribe(menuItems => {

      this.menuItems = menuItems;
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          menuItems.filter(items => {
            if (items.path === event.url) {
              this.setNavActive(items);
            }
            if (!items.children) {
              return false;
            }
            items.children.filter(subItems => {
              if (subItems.path === event.url) {
                this.setNavActive(subItems);
              }
              if (!subItems.children) {
                return false;
              }
              subItems.children.filter(subSubItems => {
                if (subSubItems.path === event.url) {
                  this.setNavActive(subSubItems);
                }
              });
            });
          });
        }
      });
    });
  }

  logOut() {
    sessionStorage.clear();
  }

  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem != item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) {
          return false;
        }
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  }

  // Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    };
  }

  getPartnerImage() {
    const payloard = {
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
}
