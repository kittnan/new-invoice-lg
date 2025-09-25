import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpNoCommonDataFormService } from 'src/app/https/NO_COMMON/http-no-common-data-form.service';
import { GenerateInvoicePdfService } from 'src/app/services/generate-invoice-pdf.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-no-common-print-invoice',
  templateUrl: './no-common-print-invoice.component.html',
  styleUrls: ['./no-common-print-invoice.component.scss']
})
export class NoCommonPrintInvoiceComponent implements OnInit {
  user: any
  form: any
  pageArr: any = []

  constructor(
    private $noComForm: HttpNoCommonDataFormService,
    private route: ActivatedRoute,
    private $pdf: GenerateInvoicePdfService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (res) => {
      if (!res['key']) {
        Swal.fire({
          title: "No Data",
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.history.back()
        })
        return
      }
      let resData: any = await this.$noComForm.get(new HttpParams().set('key', JSON.stringify([res['key']]))).toPromise();

      this.form = resData[0];

      console.log(`⚡ ~ :37 ~ NoCommonPrintInvoiceComponent ~ this.form:`, this.form);

      this.pageArr = Array.from({ length: this.form.invoiceForm.page }, (_, i) => i + 1);
    })

  }
  async generatePDF() {
    this.$pdf.generatePDF(this.form.invoiceForm.invoice, 'invoice', 'user/no-common/print')
  }

}
