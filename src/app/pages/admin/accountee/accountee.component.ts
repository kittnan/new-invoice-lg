import { Component, OnInit } from '@angular/core';
interface accountee {
  code: string | null;
  line1: string | null;
  line2: string | null;
  line3: string | null;
  line4: string | null;
  line5: string | null;
  line6: string | null;
  shippedFrom: string | null;
  to: string | null;
  per: string | null;
  paymentItem: string | null;
  freight: string | null;
  contractTerm: string | null;
}
@Component({
  selector: 'app-accountee',
  templateUrl: './accountee.component.html',
  styleUrls: ['./accountee.component.scss'],
})
export class AccounteeComponent implements OnInit {
  accountee: accountee = {
    code: 'TZ0001',
    line1: 'ARTRON ( THAILAND ) CO., LTD.',
    line2: '1 Empire Tower , Unit No. 1906,   1907/1,  19th Floor,',
    line3:
      'South Sathorn Road,  Yannawa,  Sathorn,   Bangkok,  10120  Thailand',
    line4: 'TAX ID :  0-1055-44071-00-3  ( HEAD OFFICE )',
    line5: 'TEL.  02-6595670-4  EXT. 145',
    line6: 'ATTN  :  MS.  BANDHITA  YINGCHANG',
    shippedFrom: '',
    to: '',
    per: '',
    paymentItem: '',
    freight: '',
    contractTerm: '',
  };
  codes: any[] = ['TZ0001', 'DT0003', 'TZ0002'];
  constructor() {}

  ngOnInit(): void {}
  handleSubmit() {}
}
