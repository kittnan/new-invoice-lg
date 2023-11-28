import { Component, OnInit } from '@angular/core';
import { HttpConsigneeCodeService } from 'src/app/https/http-consignee-code.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import * as XLSX from 'xlsx';
interface consigneeCode {
  'CONSIGNEE-CODE': string;
}
@Component({
  selector: 'app-consignee-code',
  templateUrl: './consignee-code.component.html',
  styleUrls: ['./consignee-code.component.scss'],
})
export class ConsigneeCodeComponent implements OnInit {
  codes: consigneeCode[] | null = null;
  constructor(
    private $consigneeCode: HttpConsigneeCodeService,
    private $alert: AlertService,
    private $convertXLSX: ConvertXLSXService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.codes = await this.$consigneeCode.get().toPromise();
    } catch (error) {
      console.log('🚀 ~ error:', error);
      this.$alert.error(2000, JSON.stringify(error), false);
    }
  }

  async handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const dataJson = await this.$convertXLSX.readExcel(file);
      this.createDataImport(dataJson);
    }
  }

  async createDataImport(data: any) {
    try {
      const stat = await this.$consigneeCode.import(data).toPromise();
      console.log('🚀 ~ stat:', stat);
      this.$alert.success(2000, 'Data created!!', true);
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
  handleDownload() {
    try {
      if (this.codes) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.codes);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Generate blob from workbook
        const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Create download link and trigger click
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'data.xlsx';
        link.click();
      }
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }

  // async ngOnInit(): Promise<void> {
  //   try {
  //     this.codes = await this.$consigneeCode.get().toPromise();
  //   } catch (error) {
  //     console.log('🚀 ~ error:', error);
  //     this.$alert.error(2000, JSON.stringify(error), false);
  //   }
  // }

  // handleNewConsigneeCode() {
  //   Swal.fire({
  //     title: 'Do you want to add new consignee code?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     allowOutsideClick: false,
  //   }).then((v: SweetAlertResult) => {
  //     if (v.isConfirmed) {
  //       this.onNewConsigneeCode();
  //     }
  //   });
  // }

  // onNewConsigneeCode() {
  //   try {
  //     Swal.fire({
  //       title: 'New Consignee Code',
  //       input: 'text',
  //       showCancelButton: true,
  //       allowOutsideClick: false,
  //     }).then((v: SweetAlertResult) => {
  //       if (v.isConfirmed) {
  //         this.create(v.value);
  //       }
  //     });
  //   } catch (error) {
  //     console.log('🚀 ~ error:', error);
  //     this.$alert.error(2000, JSON.stringify(error), false);
  //   }
  // }
  // async create(value: string) {
  //   try {
  //     if (this.codes?.some((code: consigneeCode) => code.name == value))
  //       throw `${value} is duplicate!`;
  //     await this.$consigneeCode.create({ name: value }).toPromise();
  //     this.$alert.success(2000, 'New consignee code added', true);
  //   } catch (error) {
  //     console.log('🚀 ~ error:', error);
  //     this.$alert.error(2000, JSON.stringify(error), false);
  //   }
  // }

  // handleEdit(code: consigneeCode) {
  //   Swal.fire({
  //     title: 'Do you want to edit?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     allowOutsideClick: false,
  //   }).then((v: SweetAlertResult) => {
  //     if (v.isConfirmed) {
  //       this.onEdit(code);
  //     }
  //   });
  // }

  // onEdit(code: consigneeCode) {
  //   try {
  //     Swal.fire({
  //       title: 'New Consignee Code',
  //       input: 'text',
  //       inputValue: code.name,
  //       showCancelButton: true,
  //       allowOutsideClick: false,
  //     }).then((v: SweetAlertResult) => {
  //       if (v.isConfirmed) {
  //         code.name = v.value;
  //         this.edit(code);
  //       }
  //     });
  //   } catch (error) {
  //     console.log('🚀 ~ error:', error);
  //     this.$alert.error(2000, JSON.stringify(error), false);
  //   }
  // }

  // async edit(code: consigneeCode) {
  //   try {
  //     await this.$consigneeCode.update(code).toPromise();
  //     this.$alert.success(2000, 'Consignee code updated', true);
  //   } catch (error) {
  //     console.log('🚀 ~ error:', error);
  //     this.$alert.error(2000, JSON.stringify(error), false);
  //   }
  // }
}
