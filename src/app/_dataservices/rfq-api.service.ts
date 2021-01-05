import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "@environments/environment";
import { of, BehaviorSubject, Subject, Observable, Subscription } from "rxjs";
import { RFQHeader, RFQItem, Vendor, DMSHeader, RfqObj, RfqDocs } from "@app/_models";
import { AuthService } from "../auth/auth.service";
import { User } from "@app/_models";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class RfqAPIService {

  tenderHead: RfqObj ;
  tenderLine: RfqObj;
  tenderDocs: RfqDocs;
  bidDocs: RfqDocs;
  public orchlist = { show: "baselist" };
  public currentRFQList: BehaviorSubject<RFQHeader[]>;
  public rfqList: Observable<RFQHeader[]>;

  public currentRFQDoc: BehaviorSubject<RFQHeader>;
  public rfqDocobs: Subscription;
  public rfqDoc: RFQHeader;

  public currentRFQItems: BehaviorSubject<RFQItem[]>;
  public RFQItemsSub: Subscription;
  public rfqItems: RFQItem[];

  public currentfocusItem: BehaviorSubject<RFQItem>;
  public focusItem: Subscription;
  public currentfocusItemval: RFQItem;

  public currentUser: User;

  public chosendoclist: BehaviorSubject<any>;
  public chosensubmilist: BehaviorSubject<any>;
  public currentblob: BehaviorSubject<Blob>;
  /**
   *Creates an instance of RfqAPIService.
   * @param {HttpClient} http
   * @param {AuthService} auths
   * @memberof RfqAPIService
   */
  constructor(private http: HttpClient, private auths: AuthService) {
    this.chosensubmilist = new BehaviorSubject(null);
    this.chosendoclist = new BehaviorSubject(null);
    this.currentblob = new BehaviorSubject(null);
    this.currentRFQList = new BehaviorSubject<RFQHeader[]>(null);
    this.rfqList = this.currentRFQList.asObservable();
    this.currentUser = auths.currentUserValue;
    this.currentRFQDoc = new BehaviorSubject<RFQHeader>(null);
    this.rfqDocobs = this.currentRFQDoc.subscribe((data) => {
      this.rfqDoc = data;
    });

    this.currentRFQItems = new BehaviorSubject<RFQItem[]>(null);
    this.RFQItemsSub = this.currentRFQItems.subscribe((data) => {
      this.rfqItems = data;
    });
    this.currentfocusItem = new BehaviorSubject<RFQItem>(null);
    this.focusItem = this.currentfocusItem.subscribe((data) => {
      this.currentfocusItemval = data;
    });
  }
  /***************************************************** */
  getRfqList(vendor: string) {
    const lrfqList: RFQHeader[] = [];
    let rfqtokenstring = "";
    const rfqtoken = JSON.parse(localStorage.getItem("rfqtoken"));
    if (rfqtoken) {
      rfqtokenstring = ",RFQTOKEN:" + rfqtoken;
    } else {
      rfqtokenstring = " ";
    }
    const context =
      "{" +
      "EMAIL:" +
      this.auths.currentUserValue.username +
      rfqtokenstring +
      ",VENDOR:" +
      vendor +
      ",HEADER:X }";
    const params = new HttpParams()
      .set("Partner", "ALL")
      .set("Class", "RFQL")
      .set("CallContext", context);
    this.http
      .get<any>(environment.BASE_API + "/api/sap/rfq/getlist/email", {
        params,
      })
      .subscribe((data) => {
        if (data.ServicesList instanceof Array) {
          for (const rfqdoc of data.ServicesList) {
            const tobj = JSON.parse(rfqdoc.JsonsetJstext);
            const rfqline: RFQHeader = new RFQHeader();
            rfqline.GUID = tobj.GUID;
            rfqline.SUBMI = tobj.SUBMI;
            rfqline.RFQNO = tobj.RFQNO;
            rfqline.CUTOFF = tobj.CUTOFF;
            rfqline.VENDORNO = tobj.VENDORNO;
            rfqline.VENDOR = tobj.VENDOR;
            lrfqList.push(rfqline);
          }
          this.currentRFQList.next(lrfqList);
        }
      });
  }
  /***************************************************** */
  getRfq(guid: string, rfqno: string): Observable<any> {
    const lrfqItems: RFQItem[] = [];
    const lclsubmilist = [];
    const lclchosenlist = [];
    const context =
      "{" +
      "GUID:" +
      guid +
      ",RFQNO:" +
      rfqno +
      ",EMAIL:" +
      this.currentUser.username +
      " }";
    const dataout = {
      context: { CLASS: "FAQ", TOKEN: "BK175mqMN0", METHOD: "RFQ_GETDETAIL" },
      data: { REF: "Empty", CONTEXT: context },
    };
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("TOKEN", "BK175mqMN0");
    return this.http
      .post<any>(
        "https://io.bidvestfm.co.za/BIDVESTFM_API_ZRFC/request?sys=dev",
        dataout,
        {
          headers,
        }
      )
      .pipe(
        map((inarray) => {
          const res = inarray.RESULT;
          res.forEach((element) => {
            switch (element.JSONSET_NAME) {
              case "OBJHEAD": {
                this.tenderHead = JSON.parse(element.JSONSET_JSTEXT);
                break;
              }
              case "OBJITEMS": {
                this.tenderLine = JSON.parse(element.JSONSET_JSTEXT);
                break;
              }
              case "OBJDOCS": {
                lclchosenlist.push(JSON.parse(element.JSONSET_JSTEXT));
                break;
              }
              case "OBJITEMDOCS": {
                lclsubmilist.push(JSON.parse(element.JSONSET_JSTEXT));
                break;
              }
            }
          });

        this.chosendoclist.next(lclsubmilist);
        this.chosensubmilist.next(lclchosenlist);
        })
      );
    // .subscribe(data => {
    //   if (data.ServicesList instanceof Array) {
    //     for (const rfqdoc of data.ServicesList) {
    //       const tobj = JSON.parse(rfqdoc.JsonsetJstext);
    //       const rfqItem: RFQItem = new RFQItem();
    //       rfqItem.SUBMI = tobj.SUBMI;
    //       rfqItem.RFQNO = tobj.RFQNO;
    //       rfqItem.ITEMNO = tobj.ITEMNO;
    //       rfqItem.CUTOFF = tobj.CUTOFF;
    //       rfqItem.DELIVERYDATE = tobj.DELIVERYDATE;
    //       rfqItem.MTEXT = tobj.MTEXT;
    //       rfqItem.QUANTITY = tobj.QUANTITY;
    //       rfqItem.MATERIAL = tobj.MATERIAL;
    //       rfqItem.UNIT = tobj.UNIT;
    //       rfqItem.PRICE = tobj.PROMISEPRICE;
    //       lrfqItems.push(rfqItem);
    //     }
    //     this.currentRFQItems.next(lrfqItems);
    //     this.getRfqAttachments(rfqno);
    //   }
    // });
  }
  /*************************/
  getRfqItems(rfqno: string) {
    const lrfqItems: RFQItem[] = [];
    const context = "{" + "GUID:" + rfqno + "RFQNO:" + rfqno + ",DETAILS:X }";
    const params = new HttpParams()
      .set("Partner", "ALL")
      .set("Class", "RFQL")
      .set("CallContext", context);
    this.http
      .get<any>(environment.BASE_API + "/api/sap/rfq/GETDETAIL/" + rfqno, {
        params,
      })
      .subscribe((data) => {
        if (data.ServicesList instanceof Array) {
          for (const rfqdoc of data.ServicesList) {
            const tobj = JSON.parse(rfqdoc.JsonsetJstext);
            const rfqItem: RFQItem = new RFQItem();
            rfqItem.SUBMI = tobj.SUBMI;
            rfqItem.RFQNO = tobj.RFQNO;
            rfqItem.ITEMNO = tobj.ITEMNO;
            rfqItem.CUTOFF = tobj.CUTOFF;
            rfqItem.DELIVERYDATE = tobj.DELIVERYDATE;
            rfqItem.MTEXT = tobj.MTEXT;
            rfqItem.QUANTITY = tobj.QUANTITY;
            rfqItem.MATERIAL = tobj.MATERIAL;
            rfqItem.UNIT = tobj.UNIT;
            rfqItem.PRICE = tobj.PROMISEPRICE;
            lrfqItems.push(rfqItem);
          }
          this.currentRFQItems.next(lrfqItems);
          this.getRfqAttachments(rfqno);
        }
      });
  }
  /***************************************************** */
  getRfqAttachments(rfqno: string) {
    const lclsubmilist = [];
    const lclchosenlist = [];
    const context = "{APIKEY:RFQ, DOCNO:" + rfqno + ",COUNTER:0 }";
    const params = new HttpParams()
      .set("Partner", "ALL")
      .set("Class", "RFDL")
      .set("CallContext", context);
    this.http
      .get<any>(environment.BASE_API + "/api/GETFLEX", { params })
      .subscribe((data) => {
        if (data.ServicesList instanceof Array) {
          for (const rfqdoc of data.ServicesList) {
            const tobj = JSON.parse(rfqdoc.JsonsetJstext);
            const docItem: DMSHeader = new DMSHeader();
            docItem.id = tobj.COUNTER;
            docItem.DOCNO = tobj.DOCNO;
            docItem.COUNTER = tobj.COUNTER;
            docItem.ORIGINALNAME = tobj.ORIGINALNAME;
            docItem.FILESIZE = tobj.FILESIZE;
            docItem.MIMETYPE = tobj.MIMETYPE;
            docItem.APIKEY = tobj.APIKEY;
            if (docItem.APIKEY === "RFQQUOTE") {
              lclsubmilist.push(docItem);
            } else {
              lclchosenlist.push(docItem);
            }
          }
          this.chosendoclist.next(lclchosenlist);
          this.chosensubmilist.next(lclsubmilist);
        }
      });
  }
  /********************************************** */
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;
    if (b64Data === "undefined") {
      return;
    }
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {
      type: contentType,
    });
    return blob;
  }
  /***************************************************** */
  getvendordoc(docref: DMSHeader) {
    let datain = "";
    const context = docref.APIKEY + "-" + docref.DOCNO + "-" + docref.COUNTER;
    const params = new HttpParams()
      .set("Partner", "ALL")
      .set("Class", "RFQD")
      .set("CallContext", context);
    this.http
      .get<any>(environment.BASE_API + "/api/GETFLEX", { params })
      .subscribe((data) => {
        if (data.ServicesList instanceof Array) {
          for (const dmsdoc of data.ServicesList) {
            const tobj = JSON.parse(dmsdoc.JsonsetJstext);
            datain = datain + tobj.ROLES;
          }
          const b64Data = datain;
          if (b64Data !== undefined) {
            this.currentblob.next(
              this.b64toBlob(b64Data, docref.MIMETYPE, 512)
            );
          }
        }
      });
  }
  /***************************************************** */
  UpdateRfqItem(itemno: string) {
    const lrfqItems: RFQItem[] = [];
    const context = itemno;
    const params = new HttpParams()
      .set("Partner", "ALL")
      .set("Class", "RFQL")
      .set("CallContext", context);
    this.http
      .get<any>(environment.BASE_API + "/api/GETFLEX", { params })
      .subscribe((data) => {
        if (data.ServicesList instanceof Array) {
          for (const rfqdoc of data.ServicesList) {
            const tobj = JSON.parse(rfqdoc.JsonsetJstext);
            const rfqItem: RFQItem = new RFQItem();
            rfqItem.SUBMI = tobj.SUBMI;
            rfqItem.RFQNO = tobj.RFQNO;
            rfqItem.ITEMNO = tobj.ITEMNO;
            rfqItem.CUTOFF = tobj.CUTOFF;
            rfqItem.MTEXT = tobj.MTEXT;
            rfqItem.QUANTITY = tobj.PROMISEQTY;
            rfqItem.PRICE = tobj.PROMISEPRICE;
            lrfqItems.push(rfqItem);
          }
          this.currentRFQItems.next(lrfqItems);
        }
      });
  }
  /******************************************* */
  uploadQuoteFile2SAP(file, resultobj, filerefer, vendor) {
    const data = resultobj.split(",").pop();

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
      }),
    };
    const uploadvar = {
      callType: "post",
      chContext: {
        CLASS: "ATTACH",
        METHOD: "",
      },
      chData: {
        fileName: file[0].name,
        fileSize: file[0].size,
        fileType: file[0].type,
        fileContent: data,
        uname: this.currentUser.username,
        targetObjId: filerefer,
        targetObjType: "RFQDOC",
        extras: vendor,
        apikey: "RFQQUOTE",
      },
    };
    this.http
      .post<any>(environment.BASE_POST, uploadvar, httpOptions)
      .subscribe(
        (data) => {
          console.log(data);
        },
        (e) => {
          console.log(e);
        }
      );
  }
  /*********************************** */
  updateSAPItem(line: RFQItem) {
    let lcldatestr = "";
    lcldatestr = line.DELIVERYDATE.split("-").join("");

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Basic dXNlcm5hbWU6cGFzc3dvcmQ=",
      }),
    };
    const uploadvar = {
      callType: "post",
      chContext: {
        CLASS: "UPDATEQUOTE",
        METHOD: "RFQP",
      },
      chData: {
        EBELN: line.RFQNO,
        EBELP: line.ITEMNO,
        NETPR: line.PRICE,
        EINDT: lcldatestr,
        KTMNG: line.QUANTITY,
        CREATEDBY: this.currentUser.username,
      },
    };
    this.http
      .post<any>(environment.BASE_POST, uploadvar, httpOptions)
      .subscribe(
        (data) => {
          console.log(data);
        },
        (e) => {
          console.log(e);
        }
      );
  }
}
