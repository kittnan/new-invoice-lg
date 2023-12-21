import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-config-packing',
  templateUrl: './config-packing.component.html',
  styleUrls: ['./config-packing.component.scss']
})
export class ConfigPackingComponent implements OnInit {
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
          const item = this.packing.filter(
            (b: any) => b['(KGSS) Customer PO'] == a['SO#']
          );
          return {
            ...a,
            packing: item,
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
        if (this.model) {
          if (this.model['Packing content category (W)'] == 'O') {
            this.unitItem = 'PALLET'
          }
          if (this.model['Packing content category (W)'] == '3') {
            this.unitItem = 'CARTON'
          }
        }
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
            typing1: null
          },
          page: this.calculatorPageBreak(this.pkta.length + 1)
        }
        this.form = {
          invoice: this.invoice,
          packingForm: packingForm,
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
            // this.router.navigate(['user/print'])
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
      const item = this.country.find((a: any) => a.code == value)
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
  htmlAmount() {
    return this.pkta.reduce((p: any, n: any) => {
      if (n['Sales AMT']) return p + Number(n['Sales AMT']);
      return p;
    }, 0);
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
  generatePDF() {
    this.$pdf.generatePDF(this.form.packingForm.invoice, 'invoice')
  }

}
