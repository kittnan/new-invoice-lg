import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpSapFormService } from 'src/app/https/SAP/http-sap-form.service';
import { HttpSapReprintService } from 'src/app/https/SAP/http-sap-reprint.service';
import { GenerateInvoicePdfService } from 'src/app/services/generate-invoice-pdf.service';

@Component({
  selector: 'app-sap-print-packing',
  templateUrl: './sap-print-packing.component.html',
  styleUrls: ['./sap-print-packing.component.scss']
})
export class SapPrintPackingComponent implements OnInit {


  user: any
  form:any
  pageArr:any=[]

  constructor(
    private $form: HttpSapFormService,
    private route: ActivatedRoute,
    private $reprint: HttpSapReprintService,
    private $pdf: GenerateInvoicePdfService,

  ) { }

  ngOnInit(): void {
    try {
      this.user = localStorage.getItem('INV_ISSUE_user')
      this.user = JSON.parse(this.user)
      this.route.queryParams.subscribe(async (res) => {
        const resForm = await this.$form.get(new HttpParams().set('key', JSON.stringify([res['key']]))).toPromise()
        this.form = resForm[resForm.length-1]
        for (let i = 0; i < this.form.packingForm.page; i++) {
          this.pageArr.push(i)
        }
      })
    } catch (error) {
      console.log("🚀 ~ error:", error)

    }
  }
  getData(page: number) {
    if (page !== 0) {
      return this.form.packingForm.data.slice(page + 1, page + 2);
    }
    return this.form.packingForm.data.slice(page, 2);
  }

  async generatePDF() {
    this.$pdf.generatePDF(this.form.packingForm.invoice, 'packing','user/sap/print')
    await this.handleUpdateReprint(this.form.packingForm.invoice)
  }

  handleUpdateReprint(invoice: string) {
    return this.$reprint.create({
      invoice: invoice,
      name: this.user.name,
      date: new Date(),
      mode: 'packing'
    }).toPromise()
  }

}
