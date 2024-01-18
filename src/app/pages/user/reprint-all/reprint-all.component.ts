import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpFormService } from 'src/app/https/http-form.service';
import { HttpReprintService } from 'src/app/https/http-reprint.service';
import { GenerateInvoicePdfService } from 'src/app/services/generate-invoice-pdf.service';

@Component({
  selector: 'app-reprint-all',
  templateUrl: './reprint-all.component.html',
  styleUrls: ['./reprint-all.component.scss']
})
export class ReprintAllComponent implements OnInit {
  form: any
  pageArr: any = []
  user: any

  items: any
  constructor(
    private route: ActivatedRoute,
    private $form: HttpFormService,
    private $pdf: GenerateInvoicePdfService,
    private $reprint: HttpReprintService

  ) {
    this.items = localStorage.getItem('DIS_printItems')
    this.items = JSON.parse(this.items)
    localStorage.removeItem('DIS_printItems')
    this.user = localStorage.getItem('DIS_user')
    this.user = JSON.parse(this.user)
  }

  async ngOnInit(): Promise<void> {
    try {
      // this.route.queryParams.subscribe(async (params: any) => {
      //   let invoices = params['key']
      //   const resForm = await this.$form.get(new HttpParams().set('key', JSON.stringify(invoices))).toPromise()
      //   this.form = resForm.map((item: any) => {
      //     let pa1 = []
      //     let pa2 = []
      //     for (let i = 0; i < item.invoiceForm.page; i++) {
      //       pa1.push(i)
      //     }
      //     for (let i = 0; i < item.packingForm.page; i++) {
      //       pa2.push(i)
      //     }
      //     item['pa1'] = pa1
      //     item['pa2'] = pa2
      //     return item
      //   })
      //   // let foo = Math.ceil(((resForm.length + 1) * 2) / 2)
      //   // for (let i = 0; i < foo; i++) {
      //   //   this.pageArr.push(i)
      //   // }
      //   // this.form = resForm[resForm.length - 1]
      // })

      if (this.items) {
        const resForm = await this.$form.get(new HttpParams().set('key', JSON.stringify(this.items))).toPromise()
        this.form = resForm.map((item: any) => {
          let pa1 = []
          let pa2 = []
          for (let i = 0; i < item.invoiceForm.page; i++) {
            pa1.push(i)
          }
          for (let i = 0; i < item.packingForm.page; i++) {
            pa2.push(i)
          }
          item['pa1'] = pa1
          item['pa2'] = pa2
          return item
        })
      }
    } catch (error) {
      console.log("🚀 ~ error:", error)

    }
  }

  async generatePDF() {
    this.$pdf.generatePDF(new Date(), 'invoice')
    // todo reprint
    this.reprintCreate(this.items)
  }
  async reprintCreate(arr: any[]) {
    try {
      let formUpdateInvoice = arr.map((item: any) => {
        return {
          invoice: item,
          name: this.user.name,
          date: new Date(),
          mode: 'invoice'
        }
      })
      let formUpdatePacking = arr.map((item: any) => {
        return {
          invoice: item,
          name: this.user.name,
          date: new Date(),
          mode: 'packing'
        }
      })
      await this.$reprint.create([...formUpdateInvoice, ...formUpdatePacking]).toPromise()
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }

  }



}
