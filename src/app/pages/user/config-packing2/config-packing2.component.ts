import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pack } from 'html2canvas/dist/types/css/types/color';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpAccounteeService } from 'src/app/https/http-accountee.service';
import { HttpConsigneeCodeService } from 'src/app/https/http-consignee-code.service';
import { HttpConsigneeService } from 'src/app/https/http-consignee.service';
import { HttpCountryService } from 'src/app/https/http-country.service';
import { HttpFormService } from 'src/app/https/http-form.service';
import { HttpItemCodeService } from 'src/app/https/http-item-code.service';
import { HttpKtcAddressService } from 'src/app/https/http-ktc-address.service';
import { HttpModelService } from 'src/app/https/http-model.service';
import { HttpPackingService } from 'src/app/https/http-packing.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';
import { HttpReprintService } from 'src/app/https/http-reprint.service';
import { GenerateInvoicePdfService } from 'src/app/services/generate-invoice-pdf.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
@Component({
  selector: 'app-config-packing2',
  templateUrl: './config-packing2.component.html',
  styleUrls: ['./config-packing2.component.scss']
})
export class ConfigPacking2Component implements OnInit {
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
  async ngOnInit(): Promise<void> {
    this.user = localStorage.getItem('INVLG_user')
    this.user = JSON.parse(this.user)
    this.route.queryParams.subscribe(async (res) => {
      console.log(res);
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
        const resPkta = await this.$pkta
          .getKey(new HttpParams().set('key', JSON.stringify(res['key'])).set('status', JSON.stringify(['available'])))
          .toPromise();
        this.pkta = resPkta.sort((a: any, b: any) => a['S0#'] - b['SO#']);
        this.pkta = this.pkta.map((a: any) => {
          return {
            ...a,
            printDate: a.printDate ? a.printDate : new Date()
          };
        });
        this.page = this.calculatorPageBreak(this.pkta.length + 1);
        this.pageArr = Array.from(
          { length: this.page },
          (_, index) => index + 1
        );
        const prod = this.pkta.find((a: any) => a['Customer Part#'])
        this.model = this.models.find((a: any) => a['Customer Part#'] == prod['Customer Part#'])


        if (this.packing[0]['Packing content category'] == 'O') {
          this.unitItem = 'PALLET'
        }
        if (this.packing[0]['Packing content category'] == '3') {
          this.unitItem = 'CARTON'
        }

        let newPacking = this.packing.reduce((p: any, n: any) => {
          if (p.length === 0) {
            n['quantity shipped'] = [n['quantity shipped']]
            n['NetWeight'] = n['NET WEIGHT']
            p = [n]
          } else {
            const i = p.findIndex((a: any) => (a['(KGSS) Customer PO'] == n['(KGSS) Customer PO']) && (a['Start case#'] == n['Start case#']))
            if (i !== -1) {
              p[i]['quantity shipped'].push(n['quantity shipped'])
              n['NetWeight'] += n['NET WEIGHT']
            } else {
              n['NetWeight'] = n['NET WEIGHT']
              n['quantity shipped'] = [n['quantity shipped']]
              p = p.concat(n)
            }
          }
          return p
        }, [])


        let markFirstCase = ''
        const packingForm = {
          invoice: this.invoice,
          consignee: this.consignee,
          accountee: this.accountee,
          ktcAddress: this.ktcAddress,
          printDate: this.htmlDate(this.pkta[0]["printDate"]),
          "Sales DT": this.htmlDate(this.pkta[0]["Sales DT"]),
          data: newPacking.map((a: any, i: number) => {
            let grossWeightCase = ''
            if (markFirstCase != a['Start case#']) {
              grossWeightCase = this.htmlGrossWeightCase(a)
              markFirstCase = a['Start case#']
            }
            const pk = this.pkta.find((p: any) => p['SO#'] == a['(KGSS) Customer PO'])
            const newItem = {
              'itemCode': this.htmlItemCode(pk["Customer Part#"]),
              'GrossWeight': this.htmlGrossWeight(pk),
              'GrossWeightCase': grossWeightCase,
              'CntOf Origin2': this.htmlCountry(pk["CntOf Origin"]),
            }
            return {
              ...pk,
              ...newItem,
              ...a
            }
          }),
          footer: {
            qty: this.htmlQuantity(),
            'totalQty': this.htmlTotalQty(),
            netWeightAll: this.htmlNetWeightAll(),
            grossWeightAll: this.htmlGrossWeightAll(),
            typing1: null
          },
          page: this.calculatorPageBreak(this.pkta.length + 1)
        }

        const packingFormSlim = {
          invoice: this.invoice,
          consignee: this.consignee,
          accountee: this.accountee,
          ktcAddress: this.ktcAddress,
          printDate: this.htmlDate(this.pkta[0]["printDate"]),
          "Sales DT": this.htmlDate(this.pkta[0]["Sales DT"]),
          data: packingForm.data.map((obj: any, i: number) => {
            return {
              'Case Mark Information 1':obj['Case Mark Information 1'],
              'Start case#':obj['Start case#'],
              'Customer Part#':obj['Customer Part#'],
              'quantity shipped':obj['quantity shipped'],
              'Case Mark Information 2':obj['Case Mark Information 2'],
              'Cust Desc':obj['Cust Desc'],
              'Lot#':obj['Lot#'],
              'NetWeight':obj['NetWeight'],
              'GrossWeightCase':obj['GrossWeightCase'],
              'Case Mark Information 3':obj['Case Mark Information 3'],
              'SO#':obj['SO#'],
              'Measurement (vertical)':obj['Measurement (vertical)'],
              'Measurement (horizontal)':obj['Measurement (horizontal)'],
              'Measurement (High)':obj['Measurement (High)'],
              'Case Mark Information 4':obj['Case Mark Information 4'],
              'Customer PO#':obj['Customer PO#'],
              'Case Mark Information 5':obj['Case Mark Information 5'],
              'Customer SO#':obj['Customer SO#'],
              'CntOf Origin2':obj['CntOf Origin2'],
              'Prod Part#':obj['Prod Part#'],
              'typing1':obj['typing1'],
            }
          }),
          footer: {
            qty: this.htmlQuantity(),
            'totalQty': this.htmlTotalQty(),
            netWeightAll: this.htmlNetWeightAll(),
            grossWeightAll: this.htmlGrossWeightAll(),
            typing1: null
          },
          page: this.calculatorPageBreak(this.pkta.length + 1)
        }

        this.form = {
          invoice: this.invoice,
          packingForm: packingFormSlim,
        }
      }
    });


  }
  handleSave() {
    try {
      Swal.fire({
        title: "Do you want to save!!",
        icon: 'question',
        showCancelButton: true
      }).then(async (v: SweetAlertResult) => {
        if (v.isConfirmed) {
          // console.log(this.form);
          this.form.packingForm.status = 'ready'
          await this.$form.update({
            invoice: this.invoice,
            packingForm: this.form.packingForm,
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

  calculatorPageBreak(pktaLen: number) {
    return Math.ceil(pktaLen / 2)
  }
  htmlCountry(value: any) {
    if (this.country && this.country.length > 0) {
      const item = this.country.find((a: any) => a.key == value)
      if (item) return 'MADE IN ' + item.name
    }
    return ''
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
  htmlTotalQty() {
    const unique = [...new Set(this.packing.map((item: any) => item['Start case#']))];
    return unique.length
  }
  htmlNetWeightAll() {

    return this.packing.reduce((p: any, n: any) => {
      return p += n['NET WEIGHT']
    }, 0)

  }
  htmlGrossWeight(item: any) {
    if (item.packing && item.packing.length > 0) {
      return item.packing.reduce((p: any, n: any) => {
        return p += (n['GROSS WEIGHT'] * n['Case Quantity'])
      }, 0)
    }
    return ''
  }
  htmlGrossWeightCase(item: any) {
    const onlyCases = this.packing.filter((a: any) => a['Start case#'] == item['Start case#'])
    if (onlyCases && onlyCases.length > 0) {
      const newItem = onlyCases.reduce((p: any, n: any) => {
        return p += n['GROSS WEIGHT']
      }, 0)
      return newItem + ' KGS'
    } else {
      return ''
    }
  }
  htmlGrossWeightAll() {

    return this.packing.reduce((p: any, n: any) => {
      return p += n['GROSS WEIGHT']
    }, 0)

  }

  // todo action
  handleChangeConsigneeCodeSelected() {
    this.accountee = this.accounteeOption.find((a: any) => a.code == this.consigneeCode)
    this.consignee = this.consigneeOption.find((a: any) => a.code == this.consigneeCode)
    this.form.packingForm.accountee = this.accountee
    this.form.packingForm.consignee = this.consignee
  }
  handleChangeSaleDate() {
    this.form.packingForm['Sales DT'] = this.saleDate
  }
  // generatePDF() {
  //   this.$pdf.generatePDF(this.form.packingForm.invoice, 'packing')
  // }


}
