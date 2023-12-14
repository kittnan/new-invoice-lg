import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable({
  providedIn: 'root'
})
export class GenerateInvoicePdfService {
  constructor(
    private $loader: NgxUiLoaderService
  ) { }
  generatePDF(invoice:any,name:string) {
    this.$loader.start();
    setTimeout(() => {
      const div: any = document.querySelectorAll('#print');
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
            const bufferX = 5;
            const bufferY = 2;
            const imgProps = (<any>doc).getImageProperties(img);
            const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
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
            if (index + 1 === div.length) {
              doc.save(`${name}_${invoice}.pdf`);
              // this.handleCreateForm()
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
}
