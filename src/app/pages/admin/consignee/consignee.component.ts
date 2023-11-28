import { Component, OnInit } from '@angular/core';
import { HttpConsigneeCodeService } from 'src/app/https/http-consignee-code.service';
import { HttpConsigneeService } from 'src/app/https/http-consignee.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-consignee',
  templateUrl: './consignee.component.html',
  styleUrls: ['./consignee.component.scss'],
})
export class ConsigneeComponent implements OnInit {
  consigneeForm: any = {
    code: null,
    line1: 'ARTRON ( THAILAND ) CO., LTD.',
    line2: '1 Empire Tower , Unit No. 1906,   1907/1,  19th Floor,',
    line3:
      'South Sathorn Road,  Yannawa,  Sathorn,   Bangkok,  10120  Thailand',
    line4: 'TAX ID :  0-1055-44071-00-3  ( HEAD OFFICE )',
    line5: 'TEL.  02-6595670-4  EXT. 145',
    line6: 'ATTN  :  MS.  BANDHITA  YINGCHANG',
  };
  codes: any[] = ['TZ0001'];
  consignee: any[] = [];
  code: any = null;
  constructor(
    private $consigneeCode: HttpConsigneeCodeService,
    private $consignee: HttpConsigneeService,
    private $alert: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.codes = await this.$consigneeCode.get().toPromise();
      this.codes = this.codes.map((a: any) => a['CONSIGNEE-CODE']);
      this.consignee = await this.$consignee.get().toPromise();
      const firstCode = this.codes[0];
      this.code = firstCode;
      const item = this.consignee.find((a: any) => a.code == firstCode);
      if (item) {
        this.consigneeForm = { ...item, temp: '' };
      }
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
  async handleSubmit() {
    if (this.consigneeForm._id) {
      await this.$consignee
        .update({ ...this.consigneeForm, code: this.code })
        .toPromise();
    } else {
      await this.$consignee
        .create({ ...this.consigneeForm, code: this.code })
        .toPromise();
    }
    this.$alert.success(2000, 'SUCCESS', true);
  }
  handleChange() {
    const item = this.consignee.find((a: any) => a.code == this.code);
    if (item) {
      this.consigneeForm = item;
    } else {
      this.consigneeForm = {
        code: null,
        line1: null,
        line2: null,
        line3: null,
        line4: null,
        line5: null,
        line6: null,
      };
    }
  }
}
