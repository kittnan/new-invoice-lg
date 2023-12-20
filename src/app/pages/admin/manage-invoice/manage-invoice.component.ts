import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HttpFormService } from 'src/app/https/http-form.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-manage-invoice',
  templateUrl: './manage-invoice.component.html',
  styleUrls: ['./manage-invoice.component.scss']
})
export class ManageInvoiceComponent implements OnInit {
  pkta: any = null

  constructor(
    private $pkta: HttpPktaService,
    private $alert: AlertService,
    private $form: HttpFormService
  ) { }

  ngOnInit(): void {
  }
  handleSearch(e: any) {
    const uniquePkta = [...new Map(e.map((item: any) =>
      [item['invoice'], item])).values()];
    this.pkta = uniquePkta
  }
  handleDelete(item: any) {
    Swal.fire({
      title: "Do you want to delete?",
      icon: 'warning',
      showCancelButton: true
    }).then(async (v: SweetAlertResult) => {
      if (v.isConfirmed) {
        await this.$form.deleteAllByInvoice(new HttpParams().set('invoice',item.invoice)).toPromise()
        this.$alert.success(1500, 'Success', true)
      }
    })
  }
  handleValidDelete(item: any) {
    if(item && item.status=='unavailable'){
      return true
    }
    if (item && item.createdAt) {
      const startDay = moment().startOf('day')
      const dataDate = moment(item.createdAt)
      if (dataDate.isAfter(startDay)) return false
    }

    return true
  }

}
