import { Component, OnInit } from '@angular/core';

interface consignee {
  code: string | null;
  line1: string | null;
  line2: string | null;
  line3: string | null;
  line4: string | null;
  line5: string | null;
  line6: string | null;
}
@Component({
  selector: 'app-consignee',
  templateUrl: './consignee.component.html',
  styleUrls: ['./consignee.component.scss'],
})
export class ConsigneeComponent implements OnInit {
  consignee: consignee = {
    code: 'TZ0001',
    line1: 'ARTRON ( THAILAND ) CO., LTD.',
    line2: '1 Empire Tower , Unit No. 1906,   1907/1,  19th Floor,',
    line3:
      'South Sathorn Road,  Yannawa,  Sathorn,   Bangkok,  10120  Thailand',
    line4: 'TAX ID :  0-1055-44071-00-3  ( HEAD OFFICE )',
    line5: 'TEL.  02-6595670-4  EXT. 145',
    line6: 'ATTN  :  MS.  BANDHITA  YINGCHANG',
  };
  codes: any[] = ['TZ0001'];
  constructor() {}

  ngOnInit(): void {}
  handleSubmit() {}
}
