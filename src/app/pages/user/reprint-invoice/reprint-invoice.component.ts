import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpFormService } from 'src/app/https/http-form.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpReprintService } from 'src/app/https/http-reprint.service';

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
    private $loader: NgxUiLoaderService,
    private $reprint: HttpReprintService

  ) { }

  ngOnInit(): void {
    try {
      this.user = localStorage.getItem('INVLG_user')
      this.user = JSON.parse(this.user)
      console.log("🚀 ~ this.user:", this.user)
      this.route.queryParams.subscribe(async (res) => {
        const resForm = await this.$form.get(new HttpParams().set('key', JSON.stringify(res['key']))).toPromise()
        this.form = resForm[resForm.length-1]
        console.log("🚀 ~ this.form:", this.form)
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

  generatePDF() {
    this.$loader.start();
    setTimeout(() => {
      const div: any = document.querySelectorAll('#print');
      console.log('🚀 ~ div:', div);
      const options = {
        background: 'white',
        scale: 3,
      };
      var doc = new jsPDF('l', 'mm', 'a4');
      for (let index = 0; index < div.length; index++) {
        const d = div[index];
        html2canvas(d, options)
          .then((canvas) => {
            var img = canvas.toDataURL('image/PNG');

            // let width = doc.internal.pageSize.getWidth();
            // let height = doc.internal.pageSize.getHeight();

            // Add image Canvas to PDF
            const bufferX = 5;
            const bufferY = 2;
            const imgProps = (<any>doc).getImageProperties(img);
            const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // doc.addImage(img, 'JPEG', 10, 10, width, height);
            if (index > 0) {
              doc.addPage('a4', 'l');
            }
            doc.addImage(
              img,
              'PNG',
              bufferX,
              bufferY,
              pdfWidth,
              pdfHeight,
              undefined,
              'FAST'
            );

            return doc;
          })
          .then(async (doc) => {
            console.log(`${index + 1}`, doc);
            if (index + 1 === div.length) {
              doc.save(`invoice_${this.form.invoice}.pdf`);
             await this.handleUpdateReprint(this.form.invoice)
              // if (this.reprint) {
              //   await this.handleUpdateReprint(this.invoice)
              // } else {
              //   this.handleCreateForm()
              // }
              // await this.handleUpdatePkta(this.pkta)
              // setTimeout(() => {
              //   // window.close()
              //   this.router.navigate(['user/print'])
              // }, 1000);
              this.$loader.stop();
            }
          });
      }
    }, 300);
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
