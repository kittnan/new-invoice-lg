import { Component, OnInit } from '@angular/core';

interface ktcAddress {
  line1: string | null;
  line2: string | null;
  line3: string | null;
  line4: string | null;
  line5: string | null;
}
@Component({
  selector: 'app-ktc-address',
  templateUrl: './ktc-address.component.html',
  styleUrls: ['./ktc-address.component.scss'],
})
export class KtcAddressComponent implements OnInit {
  ktcAddress: ktcAddress = {
    line1: 'KYOCERA  (Thailand) Co.,Ltd.',
    line2: '86/1 Moo 4, Tambol Banklang,  Amphur Muang, Lamphun 51000 Thailand',
    line3: 'TAX ID : 0105534100493     (Head Office) ',
    line4: 'Tel. 053-581-530-2  ',
    line5: 'Fax. 053-581-529 , 053-581-252',
  };
  constructor() {}

  ngOnInit(): void {}
  handleSubmit() {}
}
