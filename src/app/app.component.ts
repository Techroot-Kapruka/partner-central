import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from './shared/auth/token-storage.service';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {CanDeactivateGuard} from "./can-deactivate.guard";
import {FileComponent} from "./components/file/file.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Kapruka Partner Central';

  private roles: string[];
  private authority: string;
  loading = true;

  constructor(private router: Router, private tokenStorage: TokenStorageService ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart){
        this.loading = true;
      }
      if (event instanceof NavigationEnd){
        this.loading = false;
      }
      if (event instanceof NavigationCancel){
        this.loading = false;
      }
      if (event instanceof NavigationError){
        this.loading = false;
      }
    } )
  }

  ngOnInit(){
    if (this.tokenStorage.getToken()){
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN'){
          this.authority = 'admin';
          return false;
        }else if (role === 'ROLE_PARTNER'){
          this.authority = 'partner';
          return false;
        }
        this.authority = 'user';
        return true;
      });
    }
  }
}
