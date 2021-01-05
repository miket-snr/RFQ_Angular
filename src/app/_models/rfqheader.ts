export class RFQHeader {
  GUID: string;
  SUBMI: string;
  RFQNO: string;
  CUTOFF: string;
  VENDORNO: string;
  VENDOR: string;
}

export interface RfqObj {
  MANDT: string;
  GUID: string;
  OBJ: string;
  OBJ_TYPE: string;
  CONTEXT: string;
  SUB_CONTEXT: string;
  CREATED: string;
  DATA: string;
  DATA_TYPE: string;
  DATA_MD5: string;
  TAGS: string;
  KEYS: string;
}

export interface RfqDocs {
  MANDT: string;
  APIKEY: string;
  DOCNO: string;
  PARTNER: string;
  COUNTER: number;
  CONTENT: string;
  DATELOADED: string;
  LOADBY: string;
  IMPORTED: string;
  ORIGINALNAME: string;
  FILESIZE: number;
  MIMETYPE: string;
  CHARSHOLDER: string;
}

export interface tenderItem {
  ITEMNO: number;
  MATERIAL: string;
  MTEXT: string;
  QUANTITY: number;
  UOM: string;
  MLONGTEXT: string;
  DELIVERYDATE: string;
  VALIDITY: string;
  ASSUMPTION?: string;
  BIDPRICE?: number
  BIDDATE?:string;
  LEADTIME?: string;
}
export interface bidItem {
ITEMNO: string;
BIDPRICE: number;
BIDDATE: string;
ASSUMPTION: string;
LEADTIME: string;
VALIDITY: string;
}
