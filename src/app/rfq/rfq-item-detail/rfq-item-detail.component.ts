import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { RfqAPIService } from '@app/_dataservices/rfq-api.service';
import { RFQItem, RFQHeader } from '@app/_models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rfq-item-detail',
  templateUrl: './rfq-item-detail.component.html',
  styleUrls: ['./rfq-item-detail.component.less']
})
export class RfqItemDetailComponent implements OnInit {
  public lclRFQItem: RFQItem;
  public lclRFQItemCopy: RFQItem;
  public lclRFQItemBackup: RFQItem;
  public list = 'X';
  public lclDate: Date;
  subscriber: Subscription;
  @Output() closer = new EventEmitter();
  /*  Handle Documents load or download */
  submitted = false;
  uoms = ['ea', 'other'];

  onSubmit() {
    this.apirfq.currentfocusItem.next(this.lclRFQItemCopy);
    this.apirfq.updateSAPItem(this.lclRFQItemCopy);
    this.closeModal(this.lclRFQItemCopy);
  }
  constructor(private apirfq: RfqAPIService) {}

  ngOnInit() {
    this.subscriber = this.apirfq.currentfocusItem.subscribe(data => {
      this.lclRFQItem = data;
      this.lclRFQItemCopy = { ...data };
      if (
        this.lclRFQItemCopy.DELIVERYDATE &&
        this.lclRFQItemCopy.DELIVERYDATE.length === 8
      ) {
        const lclstring =
          this.lclRFQItemCopy.DELIVERYDATE.substring(0, 4) +
          '-' +
          this.lclRFQItemCopy.DELIVERYDATE.substring(4, 6) +
          '-' +
          this.lclRFQItemCopy.DELIVERYDATE.substring(6, 8);
        this.lclRFQItemCopy.DELIVERYDATE = lclstring;
      }
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {}
  ok(item) {}
  resetModal() {
    this.lclRFQItemCopy = { ...this.lclRFQItem };
    if (
      this.lclRFQItemCopy.DELIVERYDATE &&
      this.lclRFQItemCopy.DELIVERYDATE.length === 8
    ) {
      const lclstring =
        this.lclRFQItemCopy.DELIVERYDATE.substring(0, 4) +
        '-' +
        this.lclRFQItemCopy.DELIVERYDATE.substring(4, 6) +
        '-' +
        this.lclRFQItemCopy.DELIVERYDATE.substring(6, 8);
      this.lclRFQItemCopy.DELIVERYDATE = lclstring;
    }
  }
  closeModal(itemback) {
    this.closer.emit(itemback);
  }
}
/*  end of Handle Documents load or download */
