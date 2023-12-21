import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpFormService } from 'src/app/https/http-form.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpReprintService } from 'src/app/https/http-reprint.service';
import { GenerateInvoicePdfService } from 'src/app/services/generate-invoice-pdf.service';

@Component({
  selector: 'app-reprint-invoice',
  templateUrl: './reprint-invoice.component.html',
  styleUrls: ['./reprint-invoice.component.scss']
})
export class ReprintInvoiceComponent implements OnInit {

  user: any
  form:any
  pageArr:any=[]

  constructor(
    private $form: HttpFormService,
    private route: ActivatedRoute,
    private $reprint: HttpReprintService,
    private $pdf: GenerateInvoicePdfService,

  ) { }

  ngOnInit(): void {
    try {
      this.user = localStorage.getItem('INVLG_user')
      this.user = JSON.parse(this.user)
      this.route.queryParams.subscribe(async (res) => {
        const resForm = await this.$form.get(new HttpParams().set('key', JSON.stringify(res['key']))).toPromise()
        this.form = resForm[resForm.length-1]
        for (let i = 0; i < this.form.invoiceForm.page; i++) {
          this.pageArr.push(i)
        }
      })
    } catch (error) {
      console.log("🚀 ~ error:", error)

    }
  }
  getData(page: number) {
    if (page !== 0) {
      return this.form.invoiceForm.data.slice(page + 1, page + 2);
    }
    return this.form.invoiceForm.data.slice(page, 2);
  }

  async generatePDF() {
    this.$pdf.generatePDF(this.form.invoiceForm.invoice, 'invoice')
    await this.handleUpdateReprint(this.form.invoiceForm.invoice)
  }

  handleUpdateReprint(invoice: string) {
    return this.$reprint.create({
      invoice: invoice,
      name: this.user.name,
      date: new Date(),
      mode: 'invoice'
    }).toPromise()
  }


}
