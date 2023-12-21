import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpFormService } from 'src/app/https/http-form.service';
import { HttpPackingService } from 'src/app/https/http-packing.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertTextService } from 'src/app/services/convertText/convert-text.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss'],
})
export class GenerateInvoiceComponent implements OnInit {
  pkta: any[] = [];
  packing: any[] = [];

  dataSource1!: MatTableDataSource<any>;
  displayedColumns: string[] = [];

  pktaUnique: any = []
  user: any
  constructor(
    private $convertText: ConvertTextService,
    private $convertXLSX: ConvertXLSXService,
    private $packing: HttpPackingService,
    private $pkta: HttpPktaService,
    private $alert: AlertService,
    private router: Router,
    private $form: HttpFormService
  ) { }

  ngOnInit(): void {
    this.user = localStorage.getItem('INVLG_user')
    this.user = JSON.parse(this.user)
  }

  async handleUploadPKTA(e: any) {
    if (e.target.files && e.target.files.length !== 0) {
      const data = await this.$convertText.continueFiles(e.target.files);
      const dataFilter = data.filter((a: any) => a['Delivery Note#']);
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
      this.pkta = dataMap;
      this.mapData()
    } else {
      this.pkta = [];
    }

  }

  async handleUploadXLSX(e: any) {
    if (e.target.files && e.target.files.length !== 0) {
      const data: any = await this.$convertXLSX.readExcel(e.target.files[0]);
      const dataFilter = data.filter((a: any) => a['Invoice No.']);
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
      this.mapData()
      // } else {
      //   this.$alert.error(1500, 'packing file is wrong!!', true)
      // }

      // const uniquePkta = [...new Map(this.pkta.map((item: any) =>
      //   [item['Delivery Note#'], item])).values()];

    } else {
      this.packing = [];
    }
  }

  mapData() {
    this.pkta = this.pkta.map((a: any) => {
      const item = this.packing.filter(
        (b: any) => b['(KGSS) Customer PO'] == a['SO#']
      );
      a.packing = item
      return a
    })
  }

  async handleSubmit() {
    try {
      let no = [...new Map(this.pkta.map((item: any) =>
        [item['Delivery Note#'], item])).values()];
      no = no.map((a: any) => a['Delivery Note#'])
      let p: HttpParams = new HttpParams().set('key', JSON.stringify(no)).set('status', JSON.stringify(['available']))
      const {pkta,form} = await this.$pkta.checkDuplicate(p).toPromise()
      console.log("🚀 ~ pkta,form:", pkta,form)
      if ((pkta && pkta.length > 0) || (form &&form.length>0) ) {
        let list = [...new Map(pkta.map((item: any) =>
          [item['Delivery Note#'], item])).values()];
        list = list.map((a: any) => a['Delivery Note#'])

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
          if (b['invoice No'] === a['invoice No'] && b['Case Mark Information 1']) return true
          return false
        })
        if (mainPacking) {
          return {
            // ...mainPacking,
            ...a
          }
        } {
          return a
        }
      })

      const newPkta = this.pkta.map((a: any) => {
        delete a['packing']
        return a
      })

      await this.$pkta.create({
        data: newPkta,
        option: 'clear'
      }).toPromise();
      await this.$packing.create(newPacking).toPromise();

      let no = [...new Map(newPkta.map((item: any) =>
        [item['Delivery Note#'], item])).values()];
      no = no.map((a: any) => a['Delivery Note#'])
      const dataForm = no.map((a: any) => {
        return {
          invoice: a,
          invoiceForm: null,
          status: 'available'
        }
      })
      await this.$form.create(dataForm).toPromise()
      Swal.fire({
        title: 'Success',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.router.navigate(['user/print'], {

        })
        // this.router.navigate(['user/view-invoice'], {
        //   queryParams: {
        //     key: this.pkta[0]['Delivery Note#']
        //   }
        // })
      })
    } catch (error) {
      console.log("🚀 ~ error:", error)
      this.$alert.error(2000, '', false)

    }

  }

  handleValidateSubmit() {
    if (this.pkta && this.pkta.length > 0) {
      if (!this.pkta.some((a: any) => a.packing && a.packing.length === 0)) {
        return false
      }
    }
    return true
  }


}
