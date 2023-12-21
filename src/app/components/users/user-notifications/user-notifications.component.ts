import {Component, OnInit} from '@angular/core';
import {NotificationServiceService} from '../../../shared/service/notification-service.service';
import {error} from 'protractor';
import {FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {
  public messageObjArray = [];
  public filteredMessageObjArray = [];
  public notificationFilter: FormGroup;
  public searchBox: FormControl;


  constructor(private notificationService: NotificationServiceService) {
    this.getMessageData();
    this.createFormgroup();
  }

  ngOnInit(): void {
  }

  createFormgroup() {
    this.searchBox = new FormControl('yyyy-mm-dd');
    this.notificationFilter = new FormGroup({
      searchBox2: this.searchBox,
    });

  }

  getMessageData() {
    let partnerId = sessionStorage.getItem('partnerId');
    const payloard = {
      partner_u_id: partnerId,
    };
    console.log(payloard);
    this.notificationService.getAllNotification(payloard).subscribe(
      data => this.manageNotification(data),
    );
  }

  private manageNotification(data) {
    this.messageObjArray = data.data;
    this.filteredMessageObjArray = this.messageObjArray;
  }

  clearValues() {
    this.searchBox.setValue('');
  }

  searchMessage() {

    const date = this.notificationFilter.get('searchBox2').value;
    if (date === '' || date === 'yyyy-mm-dd') {
      this.filteredMessageObjArray = this.messageObjArray;
    } else {
      this.filteredMessageObjArray = this.filteredMessageObjArray.filter(item => item.create_date_time.substring(0, 10) === date);
    }

  }

  displayMsgBody(i: number) {
    const message = this.filteredMessageObjArray[i].message;
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = message;

    Swal.fire({
      title: 'Message',
      html: messageDiv, // Use the created div with innerHTML
    });
  }

  limitWords(paragraph: string) {
    if (paragraph.length <= 50) {
      return paragraph;
    } else {
      return paragraph.slice(0, 70) + ' ...';
    }
  }
}

