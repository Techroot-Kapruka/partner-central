import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  goTOLoginPage() {
    this.router.navigate(['/auth/login']);
  }

}
