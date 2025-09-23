import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCountryService } from 'src/app/https/http-country.service';
import { HttpNoCommonDataService } from 'src/app/https/NO_COMMON/http-no-common-data.service';
import { HttpSapDataService } from 'src/app/https/SAP/http-sap-data.service';
import { HttpSapFormService } from 'src/app/https/SAP/http-sap-form.service';
import { HttpSapPackingService } from 'src/app/https/SAP/http-sap-packing.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-generate-common',
  templateUrl: './generate-common.component.html',
  styleUrls: ['./generate-common.component.scss']
})
export class GenerateCommonComponent implements OnInit {

  user: any

  noCommonData: any = []
  packing: any = []

  constructor(
    private $convertXLSX: ConvertXLSXService,
    private $alert: AlertService,
    private router: Router,
    private $noCommonData: HttpNoCommonDataService
  ) {
    this.user = localStorage.getItem('DIS_user')
    this.user = JSON.parse(this.user)
  }

  ngOnInit(): void {
  }

  async uploadData(e: any) {
    if (e.target.files && e.target.files.length !== 0) {
      const convertedData: any = await this.$convertXLSX.readExcel(e.target.files[0])


      const dataFilter = convertedData.filter((a: any) => a["Invoice no"]);

      console.log(`⚡ ~ :46 ~ GenerateCommonComponent ~ dataFilter:`, dataFilter);


      const mappingData = dataFilter.map((cData: any) => {
        const newItem: any = {};
        for (const key in cData) {
          const keyStr: any = key;
          const newKey: any = keyStr.toString().replaceAll('.', '');
          newItem[newKey] = cData[key];
        }
        newItem['rowNum'] = cData['__rowNum__']
        return newItem
      })

      this.noCommonData = mappingData
    } else {
      this.noCommonData = [];
    }
  }


  private convertExcelTimeToDate(excelTime: number): Date {
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const resultDate = new Date(excelEpoch.getTime() + excelTime * millisecondsInADay);

    return resultDate;
  }


  async handleSubmit() {
    try {
      // let no = [...new Map(this.sapData.map((item: any) =>
      //   [item['External Delivery ID'], item])).values()];

      // no = no.map((a: any) => a['External Delivery ID'])
      // console.log("🚀 ~ no:", no)

      // let p: HttpParams = new HttpParams().set('key', JSON.stringify(no)).set('status', JSON.stringify(['available']))
      // const { data, form } = await this.$sapData.checkDuplicate(p).toPromise()
      // console.log("🚀 ~ form:", form)
      // console.log("🚀 ~ data:", data)

      // if ((data && data.length > 0) || (form && form.length > 0)) {
      //   let list = [...new Map(data.map((item: any) =>
      //     [item['External Delivery ID'], item])).values()];
      //   list = list.map((a: any) => a['External Delivery ID'])

      //   const textBody = list.map((a: any) => {
      //     return `<li>${a}</li>`
      //   })
      //   const textAlert = `<ul style="color:red">${textBody}</ul>`

      //   this.$alert.error(2000, 'Duplicate invoice please check!', false)
      //   Swal.fire({
      //     title: `Invoice below is already exists. Do you want to replace!!`,
      //     icon: 'warning',
      //     html: textAlert,
      //     showCancelButton: true,
      //     allowOutsideClick: false,
      //     allowEscapeKey: false
      //   }).then((v: SweetAlertResult) => {
      //     if (v.isConfirmed) {
      //       this.createData()
      //     }
      //   })
      // } else {
      //   this.createData()
      // }
    } catch (error) {
      console.log('🚀 ~ error:', error);
      this.$alert.error(2000, 'Duplicate invoice please check!', false)
    }
  }

  async createData() {
    try {

      // const newPacking = this.packing.map((a: any) => {
      //   const mainPacking = this.packing.find((b: any) => {
      //     if (b['External Delivery ID'] === a['External Delivery ID'] && b['Case Mark Information 1']) return true
      //     return false
      //   })
      //   if (mainPacking) {
      //     return {
      //       ...a
      //     }
      //   } {
      //     return a
      //   }
      // })
      // console.log(newPacking);


      // const newSapData = this.sapData.map((a: any) => {
      //   delete a['packing']
      //   return a
      // })

      // await this.$sapData.create({
      //   data: newSapData,
      //   option: 'clear'
      // }).toPromise();
      // await this.$sapPacking.create(newPacking).toPromise();

      // let no = [...new Map(newSapData.map((item: any) =>
      //   [item['External Delivery ID'], item])).values()];
      // no = no.map((a: any) => a['External Delivery ID'])
      // const dataForm = no.map((a: any) => {
      //   return {
      //     invoice: a,
      //     invoiceForm: null,
      //     status: 'available',
      //     user: this.user
      //   }
      // })
      // await this.$sapForm.create(dataForm).toPromise()
      // Swal.fire({
      //   title: 'Success',
      //   icon: 'success',
      //   showConfirmButton: false,
      //   timer: 1500
      // }).then(() => {
      //   this.router.navigate(['user/sap/print'], {
      //   })
      // })
    } catch (error) {
      console.log("🚀 ~ error:", error)
      this.$alert.error(2000, '', false)

    }

  }


}
