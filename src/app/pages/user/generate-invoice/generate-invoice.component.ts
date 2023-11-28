import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpPackingService } from 'src/app/https/http-packing.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertTextService } from 'src/app/services/convertText/convert-text.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';

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

  constructor(
    private $convertText: ConvertTextService,
    private $convertXLSX: ConvertXLSXService,
    private $packing: HttpPackingService,
    private $pkta: HttpPktaService,
    private $alert: AlertService
  ) {}

  ngOnInit(): void {}

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
        return newItem;
      });
      this.pkta = dataMap;
    } else {
      this.pkta = [];
    }
    // setTimeout(() => {
    //   this.dataSource1 = new MatTableDataSource(dataFilter);
    //   for (const key in dataFilter[0]) {
    //     this.displayedColumns.push(key);
    //   }
    // }, 1000);
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
        return newItem;
      });
      this.packing = dataMap;
    } else {
      this.packing = [];
    }
  }

  async handleSubmit() {
    try {
      await this.$packing.create(this.packing).toPromise();
      await this.$pkta.create(this.pkta).toPromise();
      this.$alert.success(2000, 'Success', true);
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
}
