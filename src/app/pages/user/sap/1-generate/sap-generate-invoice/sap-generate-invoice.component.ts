import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { HttpSapDataService } from 'src/app/https/SAP/http-sap-data.service';
import { HttpSapFormService } from 'src/app/https/SAP/http-sap-form.service';
import { HttpSapPackingService } from 'src/app/https/SAP/http-sap-packing.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-sap-generate-invoice',
  templateUrl: './sap-generate-invoice.component.html',
  styleUrls: ['./sap-generate-invoice.component.scss']
})
export class SapGenerateInvoiceComponent implements OnInit {
  user: any

  sapData: any = []
  packing: any = []
  constructor(
    private $convertXLSX: ConvertXLSXService,
    private $sapData: HttpSapDataService,
    private $alert: AlertService,
    private $sapPacking: HttpSapPackingService,
    private $sapForm: HttpSapFormService,
    private router: Router
  ) {
    this.user = localStorage.getItem('DIS_user')
    this.user = JSON.parse(this.user)
  }

  ngOnInit(): void {
  }

  async uploadSAPData(e: any) {
    if (e.target.files && e.target.files.length !== 0) {
      const convertedData: any = await this.$convertXLSX.readExcel(e.target.files[0])
      console.log("🚀 ~ convertedData:", convertedData)
      const mappingData = convertedData.map((cData: any) => {
        const newItem: any = {};
        for (const key in cData) {
          const keyStr: any = key;
          const newKey: any = keyStr.toString().replaceAll('.', '');
          newItem[newKey] = cData[key];
        }
        return newItem
      }).map((cData: any) => {
        cData["Goods Issue Date"] = this.convertExcelTimeToDate(cData["Goods Issue Date"])
        cData["Customer PO#"] = cData["Customer PO#"]?.toString()
        cData["Delivery"] = cData["Delivery"]?.toString()
        cData["Prod Part#"] = cData["Prod Part#"]?.toString()
        cData["Seal No"] = cData["Seal No"]?.toString()
        cData['status'] = 'available'
        return cData
      })
      console.log("🚀 ~ mappingData:", mappingData)
      this.sapData = mappingData
    } else {
      this.sapData = [];
    }
  }

  async uploadPacking(e: any) {
    if (e.target.files && e.target.files.length !== 0) {
      const data: any = await this.$convertXLSX.readExcel(e.target.files[0]);
      const dataFilter = data.filter((a: any) => a['External Delivery ID']);
      const dataMap = dataFilter.map((a: any) => {
        const newItem: any = {};
        for (const key in a) {
          const keyStr: any = key;
          const newKey: any = keyStr.toString().replaceAll('.', '');
          newItem[newKey] = a[key];
        }
        newItem['status'] = 'available'
        return newItem;
      });
      this.packing = dataMap;
      console.log("🚀 ~ this.packing:", this.packing)
      this.sapData = this.sapData.map((data: any) => {
        const items = this.packing.filter((pk: any) => pk["Sales document"] == data['Sales document'])
        data.packing = items
        return data
      })
      console.log(this.sapData);

    } else {
      this.packing = [];
    }
  }
  private convertExcelTimeToDate(excelTime: number): Date {
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const resultDate = new Date(excelEpoch.getTime() + excelTime * millisecondsInADay);

    return resultDate;
  }


  handleValidateSubmit() {

  }

  async handleSubmit() {
    try {
      let no = [...new Map(this.sapData.map((item: any) =>
        [item['External Delivery ID'], item])).values()];

      no = no.map((a: any) => a['External Delivery ID'])
      console.log("🚀 ~ no:", no)

      let p: HttpParams = new HttpParams().set('key', JSON.stringify(no)).set('status', JSON.stringify(['available']))
      const { data, form } = await this.$sapData.checkDuplicate(p).toPromise()
      console.log("🚀 ~ form:", form)
      console.log("🚀 ~ data:", data)

      if ((data && data.length > 0) || (form && form.length > 0)) {
        let list = [...new Map(data.map((item: any) =>
          [item['External Delivery ID'], item])).values()];
        list = list.map((a: any) => a['External Delivery ID'])

        const textBody = list.map((a: any) => {
          return `<li>${a}</li>`
        })
        const textAlert = `<ul style="color:red">${textBody}</ul>`

        this.$alert.error(2000, 'Duplicate invoice please check!', false)
        Swal.fire({
          title: `Invoice below is already exists. Do you want to replace!!`,
          icon: 'warning',
          html: textAlert,
          showCancelButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((v: SweetAlertResult) => {
          if (v.isConfirmed) {
            this.createData()
          }
        })
      } else {
        this.createData()
      }
    } catch (error) {
      console.log('🚀 ~ error:', error);
      this.$alert.error(2000, 'Duplicate invoice please check!', false)
    }
  }

  async createData() {
    try {

      const newPacking = this.packing.map((a: any) => {
        const mainPacking = this.packing.find((b: any) => {
          if (b['External Delivery ID'] === a['External Delivery ID'] && b['Case Mark Information 1']) return true
          return false
        })
        if (mainPacking) {
          return {
            ...a
          }
        } {
          return a
        }
      })
      console.log(newPacking);


      const newSapData = this.sapData.map((a: any) => {
        delete a['packing']
        return a
      })

      await this.$sapData.create({
        data: newSapData,
        option: 'clear'
      }).toPromise();
      await this.$sapPacking.create(newPacking).toPromise();

      let no = [...new Map(newSapData.map((item: any) =>
        [item['External Delivery ID'], item])).values()];
      no = no.map((a: any) => a['External Delivery ID'])
      const dataForm = no.map((a: any) => {
        return {
          invoice: a,
          invoiceForm: null,
          status: 'available',
          user: this.user
        }
      })
      await this.$sapForm.create(dataForm).toPromise()
      Swal.fire({
        title: 'Success',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.router.navigate(['user/sap/print'], {
        })
      })
    } catch (error) {
      console.log("🚀 ~ error:", error)
      this.$alert.error(2000, '', false)

    }

  }

}
