import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { RFQHeader, DMSHeader } from '@app/_models';
import { RfqAPIService } from '@app/_dataservices/rfq-api.service';
import { Subscription } from 'rxjs';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-rfq-header',
  templateUrl: './rfq-header.component.html',
  styleUrls: ['./rfq-header.component.less']
})
export class RfqHeaderComponent implements OnInit {
  public docsload = 'UP';
  public docsdirection = 'Show Docs for Download';
  public lclrfqdoc: RFQHeader;
  public myFile: string;
  public chosendoclist: DMSHeader[];

  constructor(
    public apirfqdoc: RfqAPIService,
    public filesaver: FileSaverService
  ) {
    this.lclrfqdoc = this.apirfqdoc.rfqDoc;
  }

  ngOnInit() {}
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {}
  docsToggle() {
    if (this.docsload === 'DOWN') {
      this.docsdirection = 'Show Docs for Download';
      this.docsload = 'UP';
    } else {
      this.docsdirection = 'Allow Upload of Documents';
      this.docsload = 'DOWN';
    }
  }
  previewopen() {
    //  dataService.getRFQPerVendor('506452');
  }
  loaddoc(files: File[]) {
    this.myFile = files[0].name;
    const reader = new FileReader();
    // const username = this..username;
    // this..chars = '';
    reader.onloadend = e => {
      const dataURL = reader.result;
      //   const contenttype = reader.result.split(',')[0];
      //   /*
      //  //dataService.createDMSDoc(im_content).then(
      //  //    function(data) {
      //  // const lclarr = data.data.ServicesList[0].JsonsetJstext.split(":") ;  */
      //   const d = new Date();
      const vendor = this.lclrfqdoc.VENDORNO;
      const docno = this.lclrfqdoc.RFQNO;
      this.apirfqdoc.uploadQuoteFile2SAP(files, dataURL, docno, vendor);
      //     .then(function() {
      //       $location.path('/tenders');
      //     });
      //   //  }) ;
    };
    reader.readAsDataURL(files[0]);
  }
  /********************************************** */
  b64toBlob(b64Data, contentType, sliceSize) {
    //   contentType = contentType || '';
    //   sliceSize = sliceSize || 512;
    //   if (b64Data == 'undefined') {
    //     return;
    //   }
    //   const byteCharacters = atob(b64Data);
    //   const byteArrays = [];
    //   for (
    //     let offset = 0;
    //     offset < byteCharacters.length;
    //     offset += sliceSize
    //   ) {
    //     const slice = byteCharacters.slice(offset, offset + sliceSize);
    //     const byteNumbers = new Array(slice.length);
    //     for (const i = 0; i < slice.length; i++) {
    //       byteNumbers[i] = slice.charCodeAt(i);
    //     }
    //     const byteArray = new Uint8Array(byteNumbers);
    //     byteArrays.push(byteArray);
    //   }
    //   const blob = new Blob(byteArrays, {
    //     type: contentType
    //   });
    //   return blob;
  }
  downloaddoc(row) {
    this.apirfqdoc.getvendordoc(row);
    this.apirfqdoc.currentblob.subscribe(datain => {
      if (datain) {
        const ieEDGE = navigator.userAgent.match(/Edge/g);
        const ie = navigator.userAgent.match(/.NET/g); // IE 11+
        const oldIE = navigator.userAgent.match(/MSIE/g);
        //  				 if (ie || oldIE || ieEDGE) {
        this.filesaver.save(datain, row.ORIGINALNAME);
        this.apirfqdoc.currentblob.next(null);
      }
    });
  }
}
