import { Component, OnInit, OnDestroy } from '@angular/core';
import { RFQItem, Vendor } from '@app/_models';
import { RfqAPIService } from '@app/_dataservices/rfq-api.service';
import { Subscription } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule, ModalService } from '@app/_modal';
/**
 *
 *
 * @export
 * @class RfqItemsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-rfq-items',
  templateUrl: './rfq-items.component.html',
  styleUrls: ['./rfq-items.component.less']
})
export class RfqItemsComponent implements OnInit {
  public rfqItems: RFQItem[];
  public dirty = false;
  subscriber: Subscription;
  closeResult: string;
  item: RFQItem;
  constructor(
    public rfqapi: RfqAPIService,
    public modalService: ModalService
  ) {}

  ngOnInit() {
    this.subscriber = this.rfqapi.currentRFQItems.subscribe(data => {
      this.rfqItems = data;
    });
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }
  openItem(item) {
    this.rfqapi.currentfocusItem.next(item);
    this.modalService.open('rfqitemedit');
  }
  open(item) {
    this.rfqapi.currentfocusItem.next(item);
    this.modalService.open('rfqitemedit');
  }
  closeModal(item: RFQItem) {
    const lclarray = [];
    if (item) {
      for (const itemin of this.rfqItems) {
        if (itemin.ITEMNO === item.ITEMNO) {
          lclarray.push(item);
        } else {
          lclarray.push(itemin);
        }
      }
      this.rfqapi.currentRFQItems.next(lclarray);
      this.dirty = true;
    }
    this.modalService.close('rfqitemedit');
  }
  updateQuote() {}
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
