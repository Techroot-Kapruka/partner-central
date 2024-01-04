import {Component, OnInit, EventEmitter, Output, Input, ViewChild, OnChanges} from '@angular/core';
import { SelectComponent } from 'ng-select';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnChanges {

  @Input() dataArray: any[] = [];
  @Input() isDisabled: boolean = false;
  @Input() defaultValue: any;
  @Input() isCategoryList: boolean = false;
  @Output() selected = new EventEmitter<any>();
  @ViewChild(SelectComponent, { static: false }) selectComponent: SelectComponent;

  constructor() {
  }

  ngOnChanges(): void {
    if (this.defaultValue !== undefined) {
      this.setDefaultValue();
    }
  }

  onChangeSelect(event) {
    const selectedValue = event.value;
    this.selected.emit(selectedValue);
  }

  setDefaultValue(): void {
    if (this.selectComponent) {
      this.selectComponent.writeValue(this.defaultValue);
    }
  }
}
