import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpPackingService } from 'src/app/https/http-packing.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';
import { HttpConsigneeService } from 'src/app/https/http-consignee.service';
import { HttpKtcAddressService } from 'src/app/https/http-ktc-address.service';
import { HttpAccounteeService } from 'src/app/https/http-accountee.service';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpItemCodeService } from 'src/app/https/http-item-code.service';
import { HttpCountryService } from 'src/app/https/http-country.service';
import { HttpModelService } from 'src/app/https/http-model.service';
import { HttpReprintService } from 'src/app/https/http-reprint.service';
import { HttpConsigneeCodeService } from 'src/app/https/http-consignee-code.service';
import { HttpFormService } from 'src/app/https/http-form.service';
import { GenerateInvoicePdfService } from 'src/app/services/generate-invoice-pdf.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-config-invoice',
  templateUrl: './config-invoice.component.html',
  styleUrls: ['./config-invoice.component.scss']
})
export class ConfigInvoiceComponent implements OnInit {

  invoice: any;
  pkta: any = null
  packing: any;
  consignee: any;
  consigneeOption: any;
  consigneeCode: any;
  consigneeCodeOption: any;
  ktcAddress: any;
  accountee: any;
  accounteeOption: any;
  itemCodes: any;
  country: any;
  models: any;

  page: number = 0;
  pageArr: any[] = [];
  pageCurrent: number = 1;

  user: any

  saleDate: any = new Date()
  minSaleDate = new Date()
  unitItem: any
  model: any

  form: any = null
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
    private $consigneeCode: HttpConsigneeCodeService,
    private $form: HttpFormService,
    private $pdf: GenerateInvoicePdfService,
  ) { }

  ngOnInit(): void {
    try {
      this.user = localStorage.getItem('INVLG_user')
      this.user = JSON.parse(this.user)
      this.route.queryParams.subscribe(async (res) => {
        if (res['key']) {

          this.itemCodes = await this.$itemCode.get().toPromise();
          const resConsigneeCode: any = await this.$consigneeCode.get().toPromise();
          this.consigneeCodeOption = resConsigneeCode
          const resConsignee: any = await this.$consignee.get().toPromise();
          this.consigneeOption = resConsignee
          const resAddress: any = await this.$address.get().toPromise();
          this.ktcAddress = resAddress[0];
          const resAccountee: any = await this.$accountee.get().toPromise();
          this.accounteeOption = resAccountee
          const resCountry: any = await this.$country.get().toPromise();
          this.country = resCountry
          const resModel: any = await this.$model.get().toPromise();
          this.models = resModel


          this.packing = await this.$packing
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])).set('status', JSON.stringify(['available'])))
            .toPromise();
          this.invoice = res['key'];
          let resPkta = await this.$pkta
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])).set('status', JSON.stringify(['available'])))
            .toPromise();
          resPkta = resPkta.sort((a: any, b: any) => a['S0#'] - b['SO#']);
          this.pkta = resPkta.map((a: any) => {
            const item = this.packing.filter(
              (b: any) => b['(KGSS) Customer PO'] == a['SO#']
            );
            return {
              ...a,
              packing: item,
              printDate: a.printDate ? a.printDate : new Date(),
              typing1: a.typing1 ? a.typing1 : null,
            };
          });
          this.page = this.calculatorPageBreak(this.pkta.length + 1);
          this.pageArr = Array.from(
            { length: this.page },
            (_, index) => index + 1
          );
          const prod = this.pkta.find((a: any) => a['Customer Part#'])
          this.model = this.models.find((a: any) => a['Customer Part#'] == prod['Customer Part#'])
          if (this.model) {
            if (this.model['Packing content category (W)'] == 'O') {
              this.unitItem = 'PALLET'
            }
            if (this.model['Packing content category (W)'] == '3') {
              this.unitItem = 'CARTON'
            }
          }

          const invoiceForm = {
            invoice: this.invoice,
            consignee: this.consignee,
            accountee: this.accountee,
            ktcAddress: this.ktcAddress,
            printDate: new Date(),
            "Sales DT": new Date(),
            data: this.pkta.map((a: any, i: number) => {

              return {
                'itemCode': this.htmlItemCode(a["Customer Part#"]),
                'Customer Part#': a['Customer Part#'],
                'Cust Desc': a['Cust Desc'],
                'Cust Currency': a['Cust Currency'],
                'Case Mark Information 1': a.packing[0]["Case Mark Information 1"],
                'Case Mark Information 2': a.packing[0]["Case Mark Information 2"],
                'Case Mark Information 3': a.packing[0]["Case Mark Information 3"],
                'Case Mark Information 4': a.packing[0]["Case Mark Information 4"],
                'Case Mark Information 5': a.packing[0]["Case Mark Information 5"],
                'SO#': a['SO#'],
                'Sales QTY': a['Sales QTY'],
                'U/P': a['U/P'],
                'UPM': a['UPM'],
                'Sales AMT': a['Sales AMT'],
                'Customer PO#': a['Customer PO#'],
                'Customer SO#': a['Customer SO#'],
                'Lot#': a['Lot#'],
                'CntOf Origin': this.htmlCountry(a["CntOf Origin"]),
                'Prod Part#': a['Prod Part#'],
                'Prod Desc': a['Prod Desc'],
                'typing1': this.model && this.model['Prod Part'] ? this.model['Prod Part'] : '',

              }
            }),
            footer: {
              'totalQty': this.htmlTotalQty(),
              qty: this.htmlQuantity(),
              amount: this.htmlAmount(),
              netWeight: this.htmlNetWeight(),
              grossWeight: this.htmlGrossWeight(),
              caseQty: this.htmlCaseQuantity(),

              netWeightAll: this.htmlNetWeightAll(),
              grossWeightAll: this.htmlGrossWeightAll(),
            },
            page: this.calculatorPageBreak(this.pkta.length + 1),
            status: 'notReady',
            unitItem: this.unitItem
          }
          this.form = {
            invoice: this.invoice,
            invoiceForm: invoiceForm,
          }
        }
      })
    } catch (error) {
      console.log("🚀 ~ error:", error)

    }
  }
  calculatorPageBreak(pktaLen: number) {
    return Math.ceil(pktaLen / 2)
  }
  htmlDate(d: any) {
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
  htmlTotalQty() {
    const arrayUniqueByKey = [...new Map(this.packing.map((item: any) =>
      [item['Start case#'], item])).values()];
    const total = arrayUniqueByKey.reduce((p: any, n: any) => {
      return p += n['Case Quantity']
    }, 0)
    return total
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
  htmlNetWeight() {
    if (this.pkta && this.pkta.length > 0) {
      return this.pkta.reduce((p: any, n: any) => {
        const sum = n.packing.reduce((p2: any, n2: any) => {
          return p2 += (n2['NET WEIGHT'] * n2['Case Quantity'])
        }, 0)
        return p += sum
      }, 0)
    }
    return ''
  }
  htmlNetWeightAll() {

    return this.packing.reduce((p: any, n: any) => {
      if (n['Case Quantity'] > 1) {
        return p += Number((n['NET WEIGHT'] * n['Case Quantity']))
      } else {
        return p += Number(n['NET WEIGHT'])
      }
    }, 0)



  }
  htmlGrossWeight() {
    if (this.pkta && this.pkta.length > 0) {
      return this.pkta.reduce((p: any, n: any) => {
        const sum = n.packing.reduce((p2: any, n2: any) => {
          return p2 += (n2['GROSS WEIGHT'] * n2['Case Quantity'])
        }, 0)
        return p += sum
      }, 0)
    }
    return ''
  }
  htmlGrossWeightAll() {
    let markFirstCase = ''
    return this.packing.reduce((p: any, n: any) => {
      let grossWeightCase: any = ''
      if (markFirstCase != n['Start case#']) {
        if (n['Case Quantity'] > 1) {
          grossWeightCase = Number(n['GROSS WEIGHT'] * n['Case Quantity'])
        } else {
          grossWeightCase = Number(n['GROSS WEIGHT'])
        }
        markFirstCase = n['Start case#']
      }
      return p += Number(grossWeightCase)
    }, 0)

  }

  // todo action
  handleChangeConsigneeCodeSelected() {

    this.accountee = this.accounteeOption.find((a: any) => a.code == this.consigneeCode)
    this.consignee = this.consigneeOption.find((a: any) => a.code == this.consigneeCode)
    this.form.invoiceForm.accountee = this.accountee
    this.form.invoiceForm.consignee = this.consignee
  }
  handleChangeSaleDate() {
    this.form.invoiceForm['Sales DT'] = this.saleDate
  }
  handleSave() {
    try {
      Swal.fire({
        title: "Do you want to save!!",
        icon: 'question',
        showCancelButton: true
      }).then(async (v: SweetAlertResult) => {
        if (v.isConfirmed) {
          this.form.invoiceForm.status = 'ready'
          await this.$form.update({
            invoice: this.invoice,
            invoiceForm: this.form.invoiceForm,
            status: 'available'
          }).toPromise()
          Swal.fire({
            title: "Success",
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['user/print'])
          })
        }
      })
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }
  generatePDF() {
    this.$pdf.generatePDF(this.form.invoiceForm.invoice, 'invoice')
  }



}
