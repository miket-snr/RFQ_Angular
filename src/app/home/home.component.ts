import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { AuthService } from '../auth/auth.service';
import { RfqAPIService } from '@app/_dataservices/rfq-api.service';
import { Subscription } from 'rxjs';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  public user: User;
  public subscriber: Subscription;
  public chosenlist = [];
  public orchlist = { show: 'baselist' };
  constructor(private authservice: AuthService, public rfqapis: RfqAPIService) {
    this.rfqapis.getRfqList(this.rfqapis.currentUser.username);
    this.orchlist = this.rfqapis.orchlist;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.user = this.authservice.currentUserValue;
  }
  chooselist(item) {
    this.rfqapis.getRfqItems(item.RFQNO);
    this.rfqapis.currentRFQDoc.next(item);
    this.rfqapis.orchlist.show = 'header';
  }
}
