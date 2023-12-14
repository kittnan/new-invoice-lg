import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpFormService } from 'src/app/https/http-form.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';

@Component({
  selector: 'app-search-invoice',
  templateUrl: './search-invoice.component.html',
  styleUrls: ['./search-invoice.component.scss']
})
export class SearchInvoiceComponent implements OnInit {

  @Output() resultFilter: EventEmitter<any> = new EventEmitter()

  date: any = {
    start: null,
    end: null
  }
  invoice: any = null
  statusOption = [
    'available',
    'unavailable',
    'all'
  ]
  statusSelected = 'available'
  constructor(
    private $pkta: HttpPktaService,
    private $form: HttpFormService
  ) { }

  ngOnInit(): void {
    try {
      this.date.start = new Date()
      this.handleSearch()
    } catch (error) {
      console.log("🚀 ~ error:", error)

    }
  }
  async handleSearch() {
    try {
      let p: HttpParams = new HttpParams()
      if (this.invoice) {
        p = p.set('key', JSON.stringify(this.invoice))
      }
      p = p.set('date', JSON.stringify(this.date))
      if (this.statusSelected != 'all') {
        p = p.set('status', JSON.stringify([this.statusSelected]))
      }
      const resData = await this.$form.search(p).toPromise()
      this.resultFilter.emit(resData)
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
  clearStartDate(key: any) {
    this.date[key] = null
  }

}
