import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { RfqAPIService } from '../../_dataservices/rfq-api.service';
import { RFQHeader, RFQItem } from '@app/_models';

@Component({
  selector: 'app-imgtopdf',
  templateUrl: './imgtopdf.component.html',
  styleUrls: ['./imgtopdf.component.less']
})
export class ImgtopdfComponent implements OnInit {
  public chosenrfq: RFQHeader;
  public rfqItems: RFQItem[];
  constructor(public apirfqdoc: RfqAPIService) {
    this.chosenrfq = this.apirfqdoc.rfqDoc;
    this.rfqItems = this.apirfqdoc.rfqItems;
  }
  public captureScreen() {
    const data = document.getElementById('pageout');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 400;
      const pageHeight = document.getElementById('pageout').scrollHeight;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'pt', [
        document.getElementById('pageout').scrollWidth,
        document.getElementById('pageout').scrollHeight
      ]); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('BFM-RFQ-' + this.chosenrfq.RFQNO + '.pdf'); // Generated PDF
    });
  }
  ngOnInit() {}
}
