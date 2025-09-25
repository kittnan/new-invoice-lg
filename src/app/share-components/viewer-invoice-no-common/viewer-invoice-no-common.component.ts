import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-viewer-invoice-no-common',
  templateUrl: './viewer-invoice-no-common.component.html',
  styleUrls: ['./viewer-invoice-no-common.component.scss']
})
export class ViewerInvoiceNoCommonComponent implements OnInit {


  @Input() invoiceForm: any
  @Input() pageArr: any
  @Input() page: any
  @Input() config: boolean = false

  constructor(
    private $loader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    console.log(this.invoiceForm);

  }

  // todo html control
  getData(page: number) {
    if (page !== 0) {
      return this.invoiceForm.data.slice(page * 2, (page * 2) + 2);
    }
    return this.invoiceForm.data.slice(page, 2);
  }
  htmlDate(d: any) {
    return moment(d).format('MMM . , DD,YYYY');
  }

  convertUP(text: any) {
    if (text == 1) {
      return 'A'
    }
    if (text == 100) {
      return 'H'
    }
    if (text == 1000) {
      return 'K'
    }
    return '-'
  }

  showField(item: any, key: string): string {
    if (item[key]) return item[key]
    return ''
  }
}
