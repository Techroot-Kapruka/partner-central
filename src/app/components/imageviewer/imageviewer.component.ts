import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-imageviewer',
  templateUrl: './imageviewer.component.html',
  styleUrls: ['./imageviewer.component.scss']
})
export class ImageviewerComponent implements OnInit {
  @Input() imageUrl: string;

  constructor() { }

  ngOnInit(): void {
  }

}
