import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpPackingService } from 'src/app/https/http-packing.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HttpConsigneeService } from 'src/app/https/http-consignee.service';
import { HttpKtcAddressService } from 'src/app/https/http-ktc-address.service';
import { HttpAccounteeService } from 'src/app/https/http-accountee.service';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpItemCodeService } from 'src/app/https/http-item-code.service';
import { HttpCountryService } from 'src/app/https/http-country.service';
import { HttpModelService } from 'src/app/https/http-model.service';
import { HttpReprintService } from 'src/app/https/http-reprint.service';
import { HttpFormService } from 'src/app/https/http-form.service';
@Component({
  selector: 'app-view-packing',
  templateUrl: './view-packing.component.html',
  styleUrls: ['./view-packing.component.scss']
})
export class ViewPackingComponent implements OnInit {
  invoice: any;
  pkta: any;
  packing: any;
  consignee: any;
  ktcAddress: any;
  accountee: any;
  itemCodes: any;
  country: any;
  models: any;

  page: number = 0;
  pageArr: any[] = [];
  pageCurrent: number = 1;

  user: any
  reprint: boolean = false

  constructor(
    private route: ActivatedRoute,
    private $pkta: HttpPktaService,
    private $packing: HttpPackingService,
    private $consignee: HttpConsigneeService,
    private $address: HttpKtcAddressService,
    private $accountee: HttpAccounteeService,
    private $loader: NgxUiLoaderService,
    private $itemCode: HttpItemCodeService,
    private $country: HttpCountryService,
    private $model: HttpModelService,
    private $reprint: HttpReprintService,
    private router: Router,
    private $form: HttpFormService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.user = localStorage.getItem('INVLG_user')
      this.user = JSON.parse(this.user)
      this.route.queryParams.subscribe(async (res) => {
        if (res['key']) {
          if (res['mode'] == 'reprint') {
            this.reprint = true
          }
          this.itemCodes = await this.$itemCode.get().toPromise();
          this.packing = await this.$packing
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])).set('status', JSON.stringify(['available'])))
            .toPromise();
          this.invoice = res['key'];
          const resPkta = await this.$pkta
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])).set('status', JSON.stringify(['available'])))
            .toPromise();
          this.pkta = resPkta.sort((a: any, b: any) => a['S0#'] - b['SO#']);
          this.pkta = this.pkta.map((a: any) => {
            const item = this.packing.filter(
              (b: any) => b['(KGSS) Customer PO'] == a['SO#']
            );
            return {
              ...a,
              packing: item,
              printDate: a.printDate ? a.printDate : new Date()
            };
          });
          this.page = this.calculatorPageBreak(this.pkta.length+1);
          this.pageArr = Array.from(
            { length: this.page },
            (_, index) => index + 1
          );
        }
      });

      const resConsignee: any = await this.$consignee.get().toPromise();
      this.consignee = resConsignee[0];
      const resAddress: any = await this.$address.get().toPromise();
      this.ktcAddress = resAddress[0];
      const resAccountee: any = await this.$accountee.get().toPromise();
      this.accountee = resAccountee[0];
      const resCountry: any = await this.$country.get().toPromise();
      this.country = resCountry
      const resModel: any = await this.$model.get().toPromise();
      this.models = resModel
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }

  calculatorPageBreak(pktaLen: number) {
    return Math.ceil(pktaLen / 2);
  }

  getData(page: number) {
    if (page !== 0) {
      return this.pkta.slice(page * 2, (page * 2)+2);
    }
    return this.pkta.slice(page, 2);
  }

  generatePDF() {
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
            if (index + 1 === div.length) {
              doc.save(`packing_${this.invoice}.pdf`);
              this.handleCreateForm()
              // if (this.reprint) {
              //   await this.handleUpdateReprint(this.invoice)
              // } else {
              // }
              await this.handleUpdatePkta(this.pkta)
              setTimeout(() => {
                // window.close()

                this.router.navigate(['user/print'])
              }, 1000);
              this.$loader.stop();
            }
          });
      }
    }, 300);
  }

  handleUpdatePkta(items: any) {
    const itemsMap = items.map((a: any) => {
      // a.printStatus = !a.printStatus ? true : a.printStatus
      // a.printerUser = a.printerUser ? a.printerUser : this.user.name

      if (!a.printPacking) {
        a.printPacking = {
          date: new Date(),
          status: true
        }
      }

      // a.reprint = !a.reprint ? [] : a.reprint
      // const itemReprint = {
      //   date: new Date(),
      //   user: this.user.name
      // }
      // a.reprint = [...a.reprint,itemReprint]
      return a
    })
    return this.$pkta.createOrUpdate(itemsMap).toPromise()
  }
  handleUpdateReprint(invoice: string) {
    return this.$reprint.create({
      invoice: invoice,
      name: this.user.name,
      date: new Date(),
      mode: 'packing'
    }).toPromise()
  }

  async handleCreateForm() {
    const packingForm = {
      invoice: this.invoice,
      consignee: this.consignee,
      accountee: this.accountee,
      ktcAddress: this.ktcAddress,
      printDate: this.htmlDate(this.pkta[0]["printDate"]),
      "Sales DT": this.htmlDate(this.pkta[0]["Sales DT"]),
      data: this.pkta.map((a: any, i: number) => {
        return {
          'itemCode': this.htmlItemCode(a["Customer Part#"]),
          'Customer Part#': a['Customer Part#'],
          'Sales QTY': a['Sales QTY'],
          'NetWeight': this.htmlNetWeight(a),
          'GrossWeight': this.htmlGrossWeight(a),
          'Cust Desc': a['Cust Desc'],
          'Case Mark Information 3': a.packing[0]["Case Mark Information 3"],
          'SO#': a['SO#'],
          'Measurement (vertical)': a.packing[0]['Measurement (vertical)'],
          'Measurement (horizontal)': a.packing[0]['Measurement (horizontal)'],
          'Measurement (High)': a.packing[0]['Measurement (High)'],
          'Case Mark Information 4': a.packing[0]["Case Mark Information 4"],
          'Customer PO#': a['Customer PO#'],
          'Case Mark Information 5': a.packing[0]["Case Mark Information 5"],
          'Customer SO#': a['Customer SO#'],
          'Lot#': a['Lot#'],
          'CntOf Origin': this.htmlCountry(a["CntOf Origin"]),
          'Prod Part#': a['Prod Part#'],
          'typing1': a['typing1'],

          // 'Cust Currency': a['Cust Currency'],
          // 'U/P': a['U/P'],
          // 'Sales AMT': a['Sales AMT'],

        }
      }),
      footer: {
        caseQty: this.htmlCaseQuantity(),
        qty: this.htmlQuantity(),
        'totalQty': this.htmlCaseQuantity(),

        amount: this.htmlAmount,
        netWeight: this.htmlNetWeightAll(),
        grossWeight: this.htmlGrossWeightAll(),
      },
      page: this.calculatorPageBreak(this.pkta.length+1)
    }

    await this.$form.updateByInvoice({
      invoice: this.invoice,
      packingForm: packingForm,
    }).toPromise()

  }
  htmlDate(d: any) {
    // return moment().format('MMM . , DD,YYYY');
    return moment(d).format('MMM . , DD,YYYY');
  }
  htmlItemCode(value: any) {
    const newItem = this.itemCodes.find((a: any) => a.itemCode == value);
    return newItem ? newItem.itemName : '';
  }
  htmlQuantity() {
    return this.pkta.reduce((p: any, n: any) => {
      if (n['Sales QTY']) return p + Number(n['Sales QTY']);
      return p;
    }, 0);
  }
  htmlAmount() {
    return this.pkta.reduce((p: any, n: any) => {
      if (n['Sales AMT']) return p + Number(n['Sales AMT']);
      return p;
    }, 0);
  }
  htmlCountry(value: any) {
    if (this.country && this.country.length > 0) {
      const item = this.country.find((a: any) => a.code == value)
      if (item) return 'MADE IN ' + item.name
    }
    return ''
  }
  htmlCaseQuantity() {
    if (this.pkta && this.pkta.length > 0) {
      return this.pkta.reduce((p: any, n: any) => {
        const sum = n.packing.reduce((p2: any, n2: any) => {
          return p2 += n2['Case Quantity']
        }, 0)
        return p += sum
      }, 0)
    }
    return ''
  }
  htmlNetWeight(item: any) {
    if (item.packing && item.packing.length > 0) {
      return item.packing.reduce((p: any, n: any) => {
        return p += (n['NET WEIGHT'] * n['Case Quantity'])
      }, 0)
    }
    return ''
  }
  htmlNetWeightAll() {

    return this.pkta.reduce((p1: any, n1: any) => {
      if (n1.packing && n1.packing.length > 0) {
        const s = n1.packing.reduce((p: any, n: any) => {
          return p += (n['NET WEIGHT'] * n['Case Quantity'])
        }, 0)
        p1 = p1 + s
      }
      return p1
    }, 0)

    // if (item.packing && item.packing.length > 0) {
    //   return item.packing.reduce((p: any, n: any) => {
    //     return p += (n['NET WEIGHT'] * n['Case Quantity'])
    //   }, 0)
    // }
    return ''
  }
  htmlGrossWeight(item: any) {
    if (item.packing && item.packing.length > 0) {
      return item.packing.reduce((p: any, n: any) => {
        return p += (n['GROSS WEIGHT'] * n['Case Quantity'])
      }, 0)
    }
    return ''
  }
  htmlGrossWeightAll() {

    return this.pkta.reduce((p1: any, n1: any) => {
      if (n1.packing && n1.packing.length > 0) {
        const s = n1.packing.reduce((p: any, n: any) => {
          return p += (n['GROSS WEIGHT'] * n['Case Quantity'])
        }, 0)
        p1 = p1 + s
      }
      return p1
    }, 0)

    // if (item.packing && item.packing.length > 0) {
    //   return item.packing.reduce((p: any, n: any) => {
    //     return p += (n['NET WEIGHT'] * n['Case Quantity'])
    //   }, 0)
    // }
    return ''
  }

  // htmlNetWeight() {
  //   if (this.pkta && this.pkta.length > 0) {
  //     return this.pkta.reduce((p: any, n: any) => {
  //       const sum = n.packing.reduce((p2: any, n2: any) => {
  //         return p2 += (n2['NET WEIGHT'] * n2['Case Quantity'])
  //       }, 0)
  //       return p += sum
  //     }, 0)
  //   }
  //   return ''
  // }
  // htmlGrossWeight() {
  //   if (this.pkta && this.pkta.length > 0) {
  //     return this.pkta.reduce((p: any, n: any) => {
  //       const sum = n.packing.reduce((p2: any, n2: any) => {
  //         return p2 += (n2['GROSS WEIGHT'] * n2['Case Quantity'])
  //       }, 0)
  //       return p += sum
  //     }, 0)
  //   }
  //   return ''
  // }


}
