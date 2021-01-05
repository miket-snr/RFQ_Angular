import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RfqAPIService } from '@app/_dataservices/rfq-api.service';

@Component({
  selector: 'app-rfq',
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.less']
})
export class RfqComponent implements OnInit {

  constructor(private rfqapis: RfqAPIService, private router:Router, private activeroute: ActivatedRoute) { }

  ngOnInit() {
    const RFQNO = this.activeroute.snapshot.queryParams['rfqno'];
    const GUID = this.activeroute.snapshot.queryParams['guid'];
    this.rfqapis.getRfq(GUID,RFQNO).subscribe( (indata) => {
   this.router.navigate(['esourcing/rfqheader']);
    // });
  });
}

}
