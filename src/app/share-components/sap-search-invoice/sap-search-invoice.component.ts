import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpSapFormService } from 'src/app/https/SAP/http-sap-form.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sap-search-invoice',
  templateUrl: './sap-search-invoice.component.html',
  styleUrls: ['./sap-search-invoice.component.scss']
})
export class SapSearchInvoiceComponent implements OnInit {
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
    private $form: HttpSapFormService
  ) { }

  ngOnInit(): void {
    try {
      let d: any = localStorage.getItem('DIS_filter')
      if (d) {
        d = JSON.parse(d)
        this.invoice = d.invoice ? d.invoice : null
        this.date = d.date ? d.date : {
          start: null,
          end: null
        }
        this.statusSelected = d.status ? d.status : 'available'
      } else {
        this.date.start = new Date()
      }
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
      p = p.set('sort', JSON.stringify(1))
      const resData = await this.$form.search(p).toPromise()
      this.resultFilter.emit(resData)
      this.saveFilter()
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
  saveFilter() {
    let d: any = {
      invoice: this.invoice,
      date: this.date,
      status: this.statusSelected
    }
    d = JSON.stringify(d)
    localStorage.setItem('DIS_filter', d)
  }
  clearStartDate(key: any) {
    this.date[key] = null
  }
  handleClearFilter() {
    this.invoice = null
    this.date = {
      start: null,
      end: null
    }
    this.statusSelected = 'available'
    localStorage.removeItem('DIS_filter')
    Swal.fire({
      title: 'Success',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }

}
