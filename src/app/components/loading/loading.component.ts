import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {delay} from "rxjs/internal/operators";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  loading = true;
  constructor() {

  }

  ngOnInit(): void {
  }

}
