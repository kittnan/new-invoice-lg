import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pack } from 'html2canvas/dist/types/css/types/color';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { lastValueFrom } from 'rxjs';
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
import { HttpUsersService } from 'src/app/https/http-users.service';
import { HttpSapDataService } from 'src/app/https/SAP/http-sap-data.service';
import { HttpSapFormService } from 'src/app/https/SAP/http-sap-form.service';
import { HttpSapPackingService } from 'src/app/https/SAP/http-sap-packing.service';
import { GenerateInvoicePdfService } from 'src/app/services/generate-invoice-pdf.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
@Component({
  selector: 'app-sap-config-packing',
  templateUrl: './sap-config-packing.component.html',
  styleUrls: ['./sap-config-packing.component.scss']
})
export class SapConfigPackingComponent implements OnInit {

  invoice: any;
  sapData: any = null
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

  errorConsigneePacking: boolean = false
  errorConsigneeMaster: boolean = false
  userOption: any = []
  constructor(
    private route: ActivatedRoute,
    private $sapData: HttpSapDataService,
    private $packing: HttpSapPackingService,
    private $consignee: HttpConsigneeService,
    private $address: HttpKtcAddressService,
    private $accountee: HttpAccounteeService,
    private $loader: NgxUiLoaderService,
    private $itemCode: HttpItemCodeService,
    private $country: HttpCountryService,
    private $model: HttpModelService,
    private router: Router,
    private $consigneeCode: HttpConsigneeCodeService,
    private $form: HttpSapFormService,
    private $user: HttpUsersService
  ) { }
  async ngOnInit(): Promise<void> {
    this.user = localStorage.getItem('DIS_user')
    this.user = JSON.parse(this.user)
    let resUser: any = await lastValueFrom(this.$user.get(
      new HttpParams().set('verify', 'y')
    ))
    this.userOption = resUser
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
        .getKey(new HttpParams().set('invoice', JSON.stringify([res['key']])).set('status', JSON.stringify(['available'])))
        .toPromise();
        console.log("🚀 ~ this.packing:", this.packing)
        this.invoice = res['key'];
        const resSapData = await this.$sapData
          .getKey(new HttpParams().set('key', JSON.stringify(res['key'])).set('status', JSON.stringify(['available'])))
          .toPromise();

        this.sapData = resSapData.sort((a: any, b: any) => a['Sales document'] - b['Sales document']);

        this.sapData = this.sapData.map((a: any) => {
          return {
            ...a,
            printDate: a.printDate ? a.printDate : new Date()
          };
        });

        const prod = this.sapData.find((a: any) => a['Header Note 2'])
        this.model = this.models.find((a: any) => a['Customer Part#'] == prod['Header Note 2'])


        if (this.packing[0]['Packing content category'] == 'O') {
          this.unitItem = 'PALLET'
        }
        if (this.packing[0]['Packing content category'] == '3') {
          this.unitItem = 'CARTON'
        }

        let newPacking = this.packing.reduce((p: any, n: any) => {
          if (p.length === 0) {
            n['quantity shipped'] = [n['quantity shipped']]
            n['NET WEIGHT2'] = [n['NET WEIGHT']]
            p = [n]
          } else {
            const i = p.findIndex((a: any) => (a['(KGSS) Customer PO'] == n['(KGSS) Customer PO']) && (a['Start case#'] == n['Start case#']))
            if (i !== -1) {
              p[i]['quantity shipped'].push(n['quantity shipped'])
              p[i]['NET WEIGHT2'].push(n['NET WEIGHT'])
            } else {
              n['quantity shipped'] = [n['quantity shipped']]
              n['NET WEIGHT2'] = [n['NET WEIGHT']]
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
          printDate: this.htmlDate(this.sapData[0]["printDate"]),
          "Sales DT": this.htmlDate(this.sapData[0]["Sales DT"]),
          data: newPacking.map((packingData: any, i: number) => {
            let grossWeightCase = ''
            if (markFirstCase != packingData['Start case#']) {
              grossWeightCase = this.htmlGrossWeightCase(packingData)
              markFirstCase = packingData['Start case#']
            }

            const pk = this.sapData.find((sap: any) => sap['Sales document'] == packingData['(KGSS) Customer PO'])

            const newItem = {
              'itemCode': this.htmlItemCode(pk["Header Note 1"]),
              'GrossWeight': this.htmlGrossWeight(pk),
              'GrossWeightCase': grossWeightCase,
              'GrossWeightCaseSub': this.htmlGrossWeightSub(packingData),
              'CntOf Origin2': this.htmlCountry(pk["CntOf Origin"]),
              'Case No': this.htmlCaseNo(packingData),
              'quantity shipped': this.htmlQuantityShip(packingData),
              'NetWeight': this.htmlNetWeight(packingData)
            }
            return {
              ...pk,
              ...newItem,
              ...packingData
            }
          }),

        }

        console.log(packingForm);

        let p0: HttpParams = new HttpParams()
        p0 = p0.set('key', JSON.stringify([res['key']]))
        let resForm: any = await lastValueFrom(this.$form.get(p0))
        const packingFormSlim: any = {
          invoice: this.invoice,
          consignee: this.consignee,
          accountee: this.accountee,
          ktcAddress: this.ktcAddress,
          printDate: this.htmlDate(this.sapData[0]["printDate"]),
          "Sales DT": this.htmlDate(this.sapData[0]["Sales DT"]),
          data: packingForm.data.map((obj: any, i: number) => {

            return {
              'Case Mark Information 1': obj['Case Mark Information 1'],
              'Case No': obj['Case No'],
              'Customer Part#': obj['Customer Part#'],

              'quantity shipped': obj['quantity shipped'],
              'Case Mark Information 2': obj['Case Mark Information 2'],
              'Cust Desc': obj['Cust Desc'],
              'Lot#': obj['Lot#'],
              'NetWeight': obj['NetWeight'],
              'GrossWeightCase': obj['GrossWeightCase'],
              'GrossWeightCaseSub': obj['GrossWeightCaseSub'],
              'Case Mark Information 3': obj['Case Mark Information 3'],
              'SO#': obj['Sales document'],
              'Measurement (vertical)': obj['Measurement (vertical)'],
              'Measurement (horizontal)': obj['Measurement (horizontal)'],
              'Measurement (High)': obj['Measurement (High)'],
              'Case Mark Information 4': obj['Case Mark Information 4'],
              'Customer PO#': obj['Customer PO#'],
              'Case Mark Information 5': obj['Case Mark Information 5'],
              'Customer SO#': obj['Customer SO#'],
              'CntOf Origin2': obj['CntOf Origin2'],
              'Prod Part#': obj['Prod Part#'],
              'typing1': obj['typing1'],
            }
          }),
          unitItem: this.unitItem,
          footer: {
            qty: this.htmlQuantity(),
            'totalQty': this.htmlTotalQty(),
            netWeightAll: this.htmlNetWeightAll(packingForm.data),
            grossWeightAll: this.htmlGrossWeightAll(packingForm.data),
            typing1: null,
            verifyName: resForm.length != 0 && resForm[0].invoiceForm?.footer?.verifyName ? resForm[0].invoiceForm?.footer?.verifyName : 'Rojjana Sukkasem',
            verifyPosition: resForm.length != 0 && resForm[0].invoiceForm?.footer?.verifyPosition ? resForm[0].invoiceForm?.footer?.verifyPosition : 'Department Head',
            verifyDepartment: resForm.length != 0 && resForm[0].invoiceForm?.footer?.verifyDepartment ? resForm[0].invoiceForm?.footer?.verifyDepartment : 'Logistics Department',
          },
        }

        packingFormSlim.page = this.calculatorPageBreak(packingFormSlim.data.length + 1)
        this.page = packingFormSlim.page
        this.pageArr = Array.from(
          { length: this.page },
          (_, index) => index + 1
        );


        this.form = {
          invoice: this.invoice,
          packingForm: packingFormSlim,
        }
        let consigneeCodeFix = this.packing.find((item: any) => item["Invoice No"] == this.invoice && item['(KGSS) Consignee CD'])
        consigneeCodeFix = consigneeCodeFix ? consigneeCodeFix['(KGSS) Consignee CD'] : null
        if (consigneeCodeFix) {
          this.consigneeCode = consigneeCodeFix
          this.handleChangeConsigneeCodeSelected()
          this.errorConsigneePacking = false
        } else {
          this.errorConsigneePacking = true
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
            verifyName: this.form.verifyName,
            status: 'available'
          }).toPromise()
          Swal.fire({
            title: "Success",
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['user/sap/print'])
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
  htmlCaseNo(item: any) {
    const lastCase = item['Start case#'] + item['Case Quantity'] - 1
    if (item['Start case#'] == lastCase) {
      return item['Start case#']
    } else {
      return `${item['Start case#']} - ${lastCase}`
    }
  }
  htmlQuantityShip(item: any) {
    if (item['Case Quantity'] > 1) {
      item['quantity shipped'][1] = `(EA.${item['quantity shipped'][0]} PC)`
      item['quantity shipped'][0] = item['quantity shipped'][0] * item['Case Quantity']
      return item['quantity shipped']
    } else {
      if (item['quantity shipped'][1]) {
        item['quantity shipped'][1] = item['quantity shipped'][1] + ' PC'
      }
      return item['quantity shipped']
    }
  }
  htmlQuantity() {
    return this.sapData.reduce((p: any, n: any) => {
      if (n['Delivery Quantity']) return p + Number(n['Delivery Quantity']);
      return p;
    }, 0);
  }
  htmlTotalQty() {
    const arrayUniqueByKey = [...new Map(this.packing.map((item: any) =>
      [item['Start case#'], item])).values()];
    const total = arrayUniqueByKey.reduce((p: any, n: any) => {
      return p += n['Case Quantity']
    }, 0)
    return total
  }
  htmlNetWeight(item: any) {

    if (item['Case Quantity'] > 1) {
      item['NET WEIGHT2'][0] = Number(item['NET WEIGHT2'][0] * item['Case Quantity']).toFixed(2)
      return item['NET WEIGHT2']
    } else {
      if (item['NET WEIGHT2'][1]) {
        item['NET WEIGHT2'][1] = Number(item['NET WEIGHT2'][1]).toFixed(2)
      }
      if (item['NET WEIGHT2'][2]) {
        item['NET WEIGHT2'][2] = Number(item['NET WEIGHT2'][2]).toFixed(2)
      }
      if (item['NET WEIGHT2'][3]) {
        item['NET WEIGHT2'][3] = Number(item['NET WEIGHT2'][3]).toFixed(2)
      }
      if (item['NET WEIGHT2'][4]) {
        item['NET WEIGHT2'][4] = Number(item['NET WEIGHT2'][4]).toFixed(2)
      }
      if (item['NET WEIGHT2'][5]) {
        item['NET WEIGHT2'][5] = Number(item['NET WEIGHT2'][5]).toFixed(2)
      }
      if (item['NET WEIGHT2'][6]) {
        item['NET WEIGHT2'][6] = Number(item['NET WEIGHT2'][6]).toFixed(2)
      }
      return item['NET WEIGHT2']
    }


  }
  htmlNetWeightAll(data: any) {

    return this.packing.reduce((p: any, n: any) => {
      if (n['Case Quantity'] > 1) {
        return p += Number(n['Case Quantity'] * n['NET WEIGHT'])
      } else {
        return p += n['NET WEIGHT']
      }
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

    if (item['Case Quantity'] > 1) {
      return Number(item['GROSS WEIGHT'] * item['Case Quantity']).toFixed(2) + ' KGS'
    } else {
      return Number(item['GROSS WEIGHT']).toFixed(2) + ' KGS'
    }

  }
  htmlGrossWeightSub(item: any) {
    if (item['Case Quantity'] > 1) {
      return `(EA.${Number(item['GROSS WEIGHT']).toFixed(2)} KGS)`
    }
    return ''
  }
  htmlGrossWeightAll(data: any) {
    const foo = data.reduce((p: any, n: any) => {
      return p += Number(n['GrossWeightCase'].toString().replaceAll('KGS', ''))
    }, 0)
    return Number(foo).toFixed(2)

  }

  // todo action
  handleChangeConsigneeCodeSelected() {
    this.accountee = this.accounteeOption.find((a: any) => a.code == this.consigneeCode)
    this.consignee = this.consigneeOption.find((a: any) => a.code == this.consigneeCode)
    this.form.packingForm.accountee = this.accountee
    this.form.packingForm.consignee = this.consignee
    if (!this.accountee || !this.consignee) {
      this.errorConsigneeMaster = true
    } else {
      this.errorConsigneeMaster = false
    }
  }
  handleChangeSaleDate() {
    this.form.packingForm['Sales DT'] = this.saleDate
  }
  changeVerifyName() {
    const user: any = this.userOption.find((user: any) => user.name == this.form.invoiceForm.footer.verifyName)
    if (user) {
      this.form.invoiceForm.footer.verifyDepartment = user.department
      this.form.invoiceForm.footer.verifyPosition = user.position
    }
  }

}
