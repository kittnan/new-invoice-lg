import { Component, OnInit } from '@angular/core';
import { HttpAccounteeService } from 'src/app/https/http-accountee.service';
import { HttpConsigneeCodeService } from 'src/app/https/http-consignee-code.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-accountee',
  templateUrl: './accountee.component.html',
  styleUrls: ['./accountee.component.scss'],
})
export class AccounteeComponent implements OnInit {
  accounteeForm: any = {
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    line5: '',
    line6: '',
    shippedFrom: '',
    to: '',
    per: '',
    paymentItem: '',
    freight: '',
    contractTerm: '',
  };
  accountee: any[] = [];
  codes: any[] = [];
  code: any = null;
  constructor(
    private $consigneeCode: HttpConsigneeCodeService,
    private $accountee: HttpAccounteeService,
    private $alert: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.codes = await this.$consigneeCode.get().toPromise();
      this.codes = this.codes.map((a: any) => a['CONSIGNEE-CODE']);
      this.accountee = await this.$accountee.get().toPromise();
      const firstCode = this.codes[0];
      this.code = firstCode;
      const item = this.accountee.find((a: any) => a.code == firstCode);
      if (item) {
        this.accounteeForm = { ...item, temp: '' };
      }
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
  async handleSubmit() {
    if (this.accounteeForm._id) {
      await this.$accountee
        .update({ ...this.accounteeForm, code: this.code })
        .toPromise();
    } else {
      await this.$accountee
        .create({ ...this.accounteeForm, code: this.code })
        .toPromise();
    }
    this.$alert.success(2000, 'SUCCESS', true);
  }
  handleChange() {
    const item = this.accountee.find((a: any) => a.code == this.code);
    if (item) {
      this.accounteeForm = item;
    } else {
      this.accounteeForm = {
        line1: '',
        line2: '',
        line3: '',
        line4: '',
        line5: '',
        line6: '',
        shippedFrom: '',
        to: '',
        per: '',
        paymentItem: '',
        freight: '',
        contractTerm: '',
      };
    }
  }
}
