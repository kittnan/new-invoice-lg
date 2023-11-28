import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpPackingService } from 'src/app/https/http-packing.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HttpConsigneeService } from 'src/app/https/http-consignee.service';
import { HttpKtcAddressService } from 'src/app/https/http-ktc-address.service';
import { HttpAccounteeService } from 'src/app/https/http-accountee.service';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss'],
})
export class ViewInvoiceComponent implements OnInit {
  invoice: any;
  pkta: any;
  packing: any;
  consignee: any;
  ktcAddress: any;
  accountee: any;

  page: number = 0;
  pageArr: any[] = [];
  pageCurrent: number = 1;

  constructor(
    private route: ActivatedRoute,
    private $pkta: HttpPktaService,
    private $packing: HttpPackingService,
    private $consignee: HttpConsigneeService,
    private $address: HttpKtcAddressService,
    private $accountee: HttpAccounteeService,
    private $loader: NgxUiLoaderService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.route.queryParams.subscribe(async (res) => {
        console.log(res);
        if (res['key']) {
          this.packing = await this.$packing
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])))
            .toPromise();
          this.invoice = res['key'];
          const resPkta = await this.$pkta
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])))
            .toPromise();
          this.pkta = resPkta.sort((a: any, b: any) => a['S0#'] - b['SO#']);
          this.pkta = this.pkta.map((a: any) => {
            const item = this.packing.filter(
              (b: any) => b['(KGSS) Customer PO'] == a['SO#']
            );
            return {
              ...a,
              packing: item,
            };
          });
          console.log('🚀 ~ this.pkta:', this.pkta);
          this.page = this.calculatorPageBreak(this.pkta.length);
          this.pageArr = Array.from(
            { length: this.page },
            (_, index) => index + 1
          );
          console.log('🚀 ~ this.pageArr:', this.pageArr);
        }
      });

      const resConsignee: any = await this.$consignee.get().toPromise();
      this.consignee = resConsignee[0];
      const resAddress: any = await this.$address.get().toPromise();
      this.ktcAddress = resAddress[0];
      const resAccountee: any = await this.$accountee.get().toPromise();
      this.accountee = resAccountee[0];
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }

  calculatorPageBreak(pktaLen: number) {
    return Math.ceil(pktaLen / 2);
  }

  getData(page: number) {
    return this.pkta.slice(page, 2);
  }

  generarPDF() {
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
          .then((doc) => {
            console.log(`${index + 1}`, doc);
            if (index + 1 === div.length) {
              doc.save('postres.pdf');
              this.$loader.stop();
            }
          });
      }
    }, 300);
  }
  htmlDate(d: any) {
    return moment(d).format('MMM . , DD,YYYY');
  }
}
