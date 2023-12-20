import { Component, OnInit } from '@angular/core';
import { HttpCountryService } from 'src/app/https/http-country.service';
import { HttpModelService } from 'src/app/https/http-model.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver'
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements OnInit {
  model: any[] = [];
  displayColumn: any[] = [];
  dataSource = new MatTableDataSource();
  constructor(
    private $alert: AlertService,
    private $convertXLSX: ConvertXLSXService,
    private $model: HttpModelService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.model = await this.$model.get().toPromise();
      const firstItem: any = this.model[0];
      delete firstItem._id;
      delete firstItem.createdAt;
      delete firstItem.updatedAt;
      for (const key in firstItem) {
        this.displayColumn.push(key);
      }
      console.log(this.displayColumn);
      this.dataSource = new MatTableDataSource(this.model);

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
      console.log('🚀 ~ data:', data);
      const newData = data.map((a: any) => {
        const newItem: any = {};
        for (const key in a) {
          const keyStr: any = key.toString();
          const newKey: any = keyStr.replaceAll('.', '');
          newItem[newKey] = a[key];
        }
        return newItem;
      });
      console.log('🚀 ~ newData:', newData);
      const stat = await this.$model.import(newData).toPromise();
      console.log('🚀 ~ stat:', stat);
      this.$alert.success(2000, 'Data created!!', true);
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
  handleDownload() {
    try {
      if (this.model) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.model);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        const wb_out = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
        const blob = new Blob([wb_out], { type: 'application/vnd.ms-excel' });
        fs.saveAs(blob,'model.xlsx')

        // Generate blob from workbook
        // const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // // Create download link and trigger click
        // const link = document.createElement('a');
        // link.href = window.URL.createObjectURL(blob);
        // link.download = 'data.xlsx';
        // link.click();
      }
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
}
