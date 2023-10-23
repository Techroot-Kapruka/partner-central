import {Component, Input, OnInit, Output, EventEmitter, NgModule, ElementRef, Renderer2, ViewChild} from '@angular/core';
// import {AuthLoginInfo} from '../../../shared/auth/login-info';
import {AuthService} from '../../../shared/auth/auth.service';
import {TokenStorageService} from '../../../shared/auth/token-storage.service';
import {Login} from '../../../shared/dtos/Login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = ['admin'];
  public userName = '';
  public password = '';
  public eyeIcon = 'fa fa-fw fa-eye-slash field-icon';
  public type = 'password';
  imageSrc = 'assets/images/logo.png';
  @ViewChild('sectionToScroll') sectionToScroll: ElementRef;

  @Input()
  public login: Login = new Login(this.userName, this.password);

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private renderer: Renderer2) {
    sessionStorage.removeItem('jwtToken');
  }

  ngOnInit() {
  }

  onSubmit(): void {
    sessionStorage.clear();
    this.authService.send_login(this.login)
      .subscribe(
        data => this.tokenStorage.ifExistsToken(data),
        error => this.manageLoginError(error)
      );
  }

  reloadPage() {
    window.location.reload();
  }

  owlcarousel = [
    {
      title: 'Welcome to Kapruka Partner Central',
      desc: 'Sri Lanka\'s Largest Online Shopping Destination',
    },
    {
      title: 'Welcome to Kapruka Partner Central',
      desc: 'Sri Lanka\'s Largest Online Shopping Destination',
    },
    {
      title: 'Welcome to Kapruka Partner Central',
      desc: 'Sri Lanka\'s Largest Online Shopping Destination',
    }
  ];
  owlcarouselOptions = {
    loop: true,
    items: 1,
    dots: true
  };

  manageLoginError(error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.error.error,
    });
  }

  onSubmit2() {
    this.onSubmit();
  }

  toggle() {
    if (this.type == 'password') {
      this.type = 'text';
      this.eyeIcon = 'fa fa-fw fa-eye field-icon';
    } else {
      this.type = 'password';
      this.eyeIcon = 'fa fa-fw fa-eye-slash field-icon';
    }
  }

  scrollToSection() {
    const element = this.sectionToScroll.nativeElement;
    const scrollOffset = element.offsetTop + element.offsetHeight - window.innerHeight;

    // Use window.scrollTo with behavior: 'smooth'
    window.scrollTo({ top: scrollOffset, behavior: 'smooth' });
  }
}
