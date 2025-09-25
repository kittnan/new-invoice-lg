import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { lastValueFrom } from 'rxjs';
import { HttpAccounteeService } from 'src/app/https/http-accountee.service';
import { HttpConsigneeCodeService } from 'src/app/https/http-consignee-code.service';
import { HttpConsigneeService } from 'src/app/https/http-consignee.service';
import { HttpCountryService } from 'src/app/https/http-country.service';
import { HttpItemCodeService } from 'src/app/https/http-item-code.service';
import { HttpKtcAddressService } from 'src/app/https/http-ktc-address.service';
import { HttpModelService } from 'src/app/https/http-model.service';
import { HttpUsersService } from 'src/app/https/http-users.service';
import { HttpSapDataService } from 'src/app/https/SAP/http-sap-data.service';
import { HttpSapFormService } from 'src/app/https/SAP/http-sap-form.service';
import { HttpSapPackingService } from 'src/app/https/SAP/http-sap-packing.service';
import { GenerateInvoicePdfService } from 'src/app/services/generate-invoice-pdf.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-sap-config-invoice',
  templateUrl: './sap-config-invoice.component.html',
  styleUrls: ['./sap-config-invoice.component.scss']
})
export class SapConfigInvoiceComponent implements OnInit {

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
    private $pdf: GenerateInvoicePdfService,
    private $user: HttpUsersService,
    private $sapData: HttpSapDataService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.user = localStorage.getItem('INV_ISSUE_user')
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
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])).set('status', JSON.stringify(['available'])))
            .toPromise();


          this.invoice = res['key'];
          let resSapData = await this.$sapData
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])).set('status', JSON.stringify(['available'])))
            .toPromise();


          resSapData = resSapData.sort((a: any, b: any) => a['Sales document'] - b['Sales document']);
          console.log('this.packing', this.packing);

          this.sapData = resSapData.map((a: any) => {
            console.log(a['Sales document']);

            const item = this.packing.filter(
              (b: any) => b['(KGSS) Customer PO'] == a['Sales document'] &&
              a['External Delivery ID'] == b['Invoice No']
            );

            console.log(`⚡ ~ :126 ~ SapConfigInvoiceComponent ~ item:`, item);

            return {
              ...a,
              packing: item,
              printDate: a.printDate ? a.printDate : new Date(),
              typing1: a.typing1 ? a.typing1 : null,
            };
          });
          this.page = this.calculatorPageBreak(this.sapData.length + 1);
          this.pageArr = Array.from(
            { length: this.page },
            (_, index) => index + 1
          );
          const prod = this.sapData.find((a: any) => a['Customer Part#'])
          if (prod) {
            this.model = this.models.find((a: any) => a['Customer Part#'] == prod['Customer Part#'])
          }
          const packingUse = this.packing.filter((a: any) => a['Invoice No'] == this.invoice)

          if (packingUse[0]['Packing content category'] == 'O') {
            this.unitItem = 'PALLET'
          }
          if (packingUse[0]['Packing content category'] == '3') {
            this.unitItem = 'CARTON'
          }

          console.log(this.sapData);

          const invoiceForm = {
            invoice: this.invoice,
            consignee: this.consignee,
            accountee: this.accountee,
            ktcAddress: this.ktcAddress,
            printDate: new Date(),
            "Sales DT": new Date(),
            data: this.sapData.map((sapD: any, i: number) => {
              console.log(i);

              console.log('sapD', sapD.packing[i]);
              console.log(sapD.packing[0]["Case Mark Information 1"]);
              let sapDPacking = sapD.packing[i]
              if (!sapDPacking) {
                sapDPacking = sapD.packing[0]
              }
              return {
                'itemCode': this.htmlItemCode(sapD["Customer Part#"]),
                'Customer Part#': sapD['Customer Part#'],
                'Header Note 2': sapD['Header Note 2'],
                'Header Note 3': sapD['Header Note 3'],
                'Cust Desc': sapD['Cust Desc'],
                'Cust Currency': sapD['Product Type'],
                'Case Mark Information 1': sapDPacking["Case Mark Information 1"],
                'Case Mark Information 2': sapDPacking["Case Mark Information 2"],
                'Case Mark Information 3': sapDPacking["Case Mark Information 3"],
                'Case Mark Information 4': sapDPacking["Case Mark Information 4"],
                'Case Mark Information 5': sapDPacking["Case Mark Information 5"],
                'SO#': sapD['Sales document'],
                'Sales QTY': sapD['Delivery Quantity'],

                'U/P': sapD['Net Price'],
                'UPM': sapD['Condition Pricing Unit'],
                'Sales AMT': Number(sapD['Net Price']) * Number(sapD['Delivery Quantity']),
                'Batch': sapD['Batch'],

                'Customer PO#': sapD['Customer PO#'],
                'Customer SO#': sapD['Customer SO#'],
                // 'Customer SO#': sapD['Customer SO#'],
                'Lot#': sapD['Batch'],
                'CntOf Origin': this.htmlCountry(sapD),
                'Prod Part#': sapD['Material code'],
                'Prod Desc': sapD['Material text'],
                'typing1': this.model && this.model['Prod Part'] ? this.model['Prod Part'] : '',

              }
            }),
            footer: {
              'totalQty': this.htmlTotalQty(this.invoice),
              qty: this.htmlQuantity(),
              amount: this.htmlAmount(),
              netWeight: this.htmlNetWeight(),
              grossWeight: this.htmlGrossWeight(),
              caseQty: this.htmlCaseQuantity(),
              netWeightAll: this.htmlNetWeightAll(this.invoice),
              grossWeightAll: this.htmlGrossWeightAll(this.invoice),
              verifyName: 'Rojjana Sukkasem',
              verifyPosition: 'Department Head',
              verifyDepartment: 'Logistics Department',
            },
            page: this.calculatorPageBreak(this.sapData.length + 1),
            status: 'notReady',
            unitItem: this.unitItem
          }
          this.form = {
            invoice: this.invoice,
            invoiceForm: invoiceForm,
          }
          console.log(this.form);

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
    return this.sapData.reduce((p: any, n: any) => {
      if (n['Delivery Quantity']) return p + Number(n['Delivery Quantity']);
      return p;
    }, 0);
  }
  htmlAmount() {
    console.log('asdasd');

    return this.sapData.reduce((p: any, n: any) => {
      console.log(Number(n['Net Price']) * Number(n['Delivery Quantity']));
      if (n['Net Value'] && n['Delivery Quantity']) {

        return p += (Number(n['Net Price']) * Number(n['Delivery Quantity']))
      }
      return p;
    }, 0);
  }
  htmlCountry(sapData: any) {
    if (this.country && this.country.length > 0) {
      let value = ''
      value = sapData['Address Note']
      const item = this.country.find((a: any) => a.code == String(value).trim())
      if (item) return 'MADE IN ' + item.name
      if (!value) {
        value = sapData["(KGSS) Country Of Origin CD"]
        const item = this.country.find((a: any) => a.key == String(value).trim())
        if (item) return 'MADE IN ' + item.name
      }
    }
    return ''
  }
  htmlTotalQty(invoice: any) {
    const packingUse = this.packing.filter((a: any) => a['Invoice No'] == invoice)
    const arrayUniqueByKey = [...new Map(packingUse.map((item: any) =>
      [item['Start case#'], item])).values()];
    const total = arrayUniqueByKey.reduce((p: any, n: any) => {
      return p += n['Case Quantity']
    }, 0)
    return total
  }
  htmlCaseQuantity() {
    if (this.sapData && this.sapData.length > 0) {
      return this.sapData.reduce((p: any, n: any) => {
        const sum = n.packing.reduce((p2: any, n2: any) => {
          return p2 += n2['Case Quantity']
        }, 0)
        return p += sum
      }, 0)
    }
    return ''
  }
  htmlNetWeight() {
    if (this.sapData && this.sapData.length > 0) {
      return this.sapData.reduce((p: any, n: any) => {
        const sum = n.packing.reduce((p2: any, n2: any) => {
          return p2 += (n2['NET WEIGHT'] * n2['Case Quantity'])
        }, 0)
        return p += sum
      }, 0)
    }
    return ''
  }
  htmlNetWeightAll(invoice: any) {
    const packingUse = this.packing.filter((a: any) => a['Invoice No'] == invoice)
    return packingUse.reduce((p: any, n: any) => {
      if (n['Case Quantity'] > 1) {
        return p += Number((n['NET WEIGHT'] * n['Case Quantity']))
      } else {
        return p += Number(n['NET WEIGHT'])
      }
    }, 0)



  }
  htmlGrossWeight() {
    if (this.sapData && this.sapData.length > 0) {
      return this.sapData.reduce((p: any, n: any) => {
        const sum = n.packing.reduce((p2: any, n2: any) => {
          return p2 += (n2['GROSS WEIGHT'] * n2['Case Quantity'])
        }, 0)
        return p += sum
      }, 0)
    }
    return ''
  }
  htmlGrossWeightAll(invoice: any) {
    let markFirstCase = ''
    const packingUse = this.packing.filter((a: any) => a['Invoice No'] == invoice)
    return packingUse.reduce((p: any, n: any) => {
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
    if (!this.accountee || !this.consignee) {
      this.errorConsigneeMaster = true
    } else {
      this.errorConsigneeMaster = false
    }
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
            this.router.navigate(['user/sap/print'])
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
  changeVerifyName() {
    const user: any = this.userOption.find((user: any) => user.name == this.form.invoiceForm.footer.verifyName)
    if (user) {
      this.form.invoiceForm.footer.verifyDepartment = user.department
      this.form.invoiceForm.footer.verifyPosition = user.position
    }
  }

}
