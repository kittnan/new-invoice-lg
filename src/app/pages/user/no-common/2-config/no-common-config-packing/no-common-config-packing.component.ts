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
import { HttpNoCommonDataFormService } from 'src/app/https/NO_COMMON/http-no-common-data-form.service';
import { HttpSapFormService } from 'src/app/https/SAP/http-sap-form.service';
import { GenerateInvoicePdfService } from 'src/app/services/generate-invoice-pdf.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-no-common-config-packing',
  templateUrl: './no-common-config-packing.component.html',
  styleUrls: ['./no-common-config-packing.component.scss']
})
export class NoCommonConfigPackingComponent implements OnInit {


  form: any = {

  }

  consignee: any;
  consigneeOption: any;
  consigneeCode: any;
  consigneeCodeOption: any;

  saleDate: any = new Date()
  minSaleDate = new Date()

  pageArr: any[] = [];
  page: number = 0;


  errorConsigneePacking: boolean = false
  errorConsigneeMaster: boolean = false

  user: any
  userOption: any = []

  invoice: any

  itemCodes: any;
  ktcAddress: any;
  accounteeOption: any;
  country: any;
  models: any;
  accountee: any;
  model: any


  constructor(
    private $user: HttpUsersService,
    private route: ActivatedRoute,
    private $noComForm: HttpNoCommonDataFormService,
    private $consignee: HttpConsigneeService,
    private $address: HttpKtcAddressService,
    private $accountee: HttpAccounteeService,
    private $itemCode: HttpItemCodeService,
    private $country: HttpCountryService,
    private $model: HttpModelService,
    private $consigneeCode: HttpConsigneeCodeService,
    private $pdf: GenerateInvoicePdfService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = localStorage.getItem('INV_ISSUE_user')
    this.user = JSON.parse(this.user)


    let resUser: any = await lastValueFrom(this.$user.get(
      new HttpParams().set('verify', 'y')
    ))
    this.userOption = resUser

    this.route.queryParams.subscribe(async (res) => {
      if (!res['key']) {
        Swal.fire({
          title: "No Data",
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.history.back()
        })
        return
      }
      this.invoice = res['key']
      let resData = await this.$noComForm
        .getForConfig(new HttpParams().set('key', JSON.stringify([this.invoice])).set('status', JSON.stringify(['available'])))
        .toPromise();


      if (resData.length === 0) {
        Swal.fire({
          title: "No Data",
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.history.back()
        })
        return
      }
      this.form = resData[0]



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

      let consigneeCodeFix = this.form.no_common_datas.find((item: any) => item['Consignee CD'])
      consigneeCodeFix = consigneeCodeFix ? consigneeCodeFix['Consignee CD'] : null
      if (consigneeCodeFix) {
        this.consigneeCode = consigneeCodeFix
        this.handleChangeConsigneeCodeSelected()
        this.errorConsigneePacking = false
      } else {
        this.errorConsigneePacking = true
      }

      this.page = this.calculatorPageBreak(this.form.no_common_datas.length + 1);


      this.pageArr = Array.from(
        { length: this.page },
        (_, index) => index + 1
      );
      let startMark = ""
      let measureMark = ""
      const packingForm = {
        invoice: this.invoice,
        consignee: this.consignee,
        accountee: this.accountee,
        ktcAddress: this.ktcAddress,
        printDate: new Date(),
        page: this.page,
        "Sales DT": new Date(),
        data: this.form.no_common_datas.map((d: any, i: number) => {

          if (startMark != d["Marks & Nos"]) {
            startMark = d["Marks & Nos"];
          } else {
            d["Marks & Nos"] = ""
          }

          if (measureMark != d["Start case#"]) {
            measureMark = d["Start case#"];
            d.measurement = this.showField(d, "Measurement (vertical)") + ' X ' + this.showField(d, "Measurement (horizontal)") + ' X ' + this.showField(d, "Measurement (High)") + ' CM'
            this.showField(d, "Measurement (High)") + ' CM'
            d["GROSS WEIGHT2"] = Number(d["GROSS WEIGHT"]).toFixed(2)
          } else {
            d["Start case#"] = ""
            d.measurement = ""
            d["GROSS WEIGHT2"] = ""
          }


          return d
        }).sort((a: any, b: any) => a.rowNum - b.rowNum),
        footer: {
          'totalQty': this.htmlTotalQty(this.form.no_common_datas),
          unitItem: this.htmlUnitItem(this.form.no_common_datas[0]),
          qty: this.htmlQuantity(this.form.no_common_datas),
          amount: this.htmlAmount(this.form.no_common_datas),
          netWeightAll: this.htmlNetWeightAll(this.form.no_common_datas),
          grossWeightAll: this.htmlGrossWeightAll(this.form.no_common_datas),

          verifyName: 'Rojjana Sukkasem',
          verifyPosition: 'Department Head',
          verifyDepartment: 'Logistics Department',
        }
      }





      if (!this.form.packingForm) {
        this.form.packingForm = {}
      }
      this.form.packingForm = packingForm

      // if (!this.accountee || !this.consignee) {
      //   this.errorConsigneeMaster = true
      // } else {
      //   this.errorConsigneeMaster = false
      // }
      // this.form = {
      //   invoice: this.invoice,
      //   packingForm: packingForm,
      // }



    })

  }
  calculatorPageBreak(pktaLen: number) {
    return Math.ceil(pktaLen / 2)
  }
  htmlItemCode(value: any) {
    const newItem = this.itemCodes.find((a: any) => a.itemCode == value);
    return newItem ? newItem.itemName : '';
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

  htmlTotalQty(items: any) {
    const packingUse = items
    const total = packingUse.reduce((p: any, n: any) => {
      if(n['Marks & Nos']){
        return p += n['Case Quantity']
      }
      return p
    }, 0)
    return total
  }

  htmlUnitItem(data: any) {
    if (data) {
      if (
        data["Packing content category"] && data["Packing content category"] == '3'
      ) return 'CARTON'
      if (
        data["Packing content category"] && data["Packing content category"] == 'O'
      ) return 'PALLET'
    }
    return '-'
  }

  htmlQuantity(items: any) {
    return items.reduce((p: any, n: any) => {
      if (n['quantity shipped']) return p + Number(n['quantity shipped']);
      return p;
    }, 0);
  }
  htmlAmount(items: any) {
    return items.reduce((p: any, n: any) => {
      if (n['Unit price'] && n['quantity shipped']) {
        return p += Number(Number((Number(n['Unit price']) * Number(n['quantity shipped']))).toFixed(2))
      }
      return p;
    }, 0);
  }
  htmlNetWeightAll(items: any) {
    const packingUse = items
    return packingUse.reduce((p: any, n: any) => {
      if (n['Case Quantity'] > 1) {
        return p += Number((n['NET WEIGHT'] * n['Case Quantity']))
      } else {
        return p += Number(n['NET WEIGHT'])
      }
    }, 0)

  }
  htmlGrossWeightAll(items: any) {
    let mark = ""
    return items.reduce((p: any, n: any) => {
      p = Number(Number(p) + Number(Number(n['GROSS WEIGHT2']).toFixed(2))).toFixed(2)
      return p
    }, 0)

  }

  changeVerifyName() {
    const user: any = this.userOption.find((user: any) => user.name == this.form.packingForm.footer.verifyName)
    if (user) {
      this.form.packingForm.footer.verifyDepartment = user.department
      this.form.packingForm.footer.verifyPosition = user.position
    }
  }

  handleSave() {
    try {
      console.log(this.form);

      Swal.fire({
        title: "Do you want to save!!",
        icon: 'question',
        showCancelButton: true
      }).then(async (v: SweetAlertResult) => {
        if (v.isConfirmed) {
          this.form.packingForm.status = 'ready'
          await this.$noComForm.update({
            invoice: this.invoice,
            packingForm: this.form.packingForm,
          }).toPromise()
          Swal.fire({
            title: "Success",
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['user/no-common/print'])
          })
        }
      })
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }

  handleChangeConsigneeCodeSelected() {
    this.accountee = this.accounteeOption.find((a: any) => a.code == this.consigneeCode)


    this.consignee = this.consigneeOption.find((a: any) => a.code == this.consigneeCode)



  }

  handleChangeSaleDate() {
    this.form.packingForm['Sales DT'] = this.saleDate
  }

  showField(item: any, key: string): string {
    if (item[key]) return item[key]
    return ''
  }

}
