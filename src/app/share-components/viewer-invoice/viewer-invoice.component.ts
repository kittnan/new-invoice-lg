import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-viewer-invoice',
  templateUrl: './viewer-invoice.component.html',
  styleUrls: ['./viewer-invoice.component.scss']
})
export class ViewerInvoiceComponent implements OnInit {

  @Input() invoiceForm: any
  @Input() pageArr: any
  @Input() page: any
  @Input() unitItem: any

  constructor(
    private $loader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
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



}
