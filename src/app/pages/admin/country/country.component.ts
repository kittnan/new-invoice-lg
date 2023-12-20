import { Component, OnInit } from '@angular/core';
import { HttpCountryService } from 'src/app/https/http-country.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver'
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  country: any[] | null = null;
  displayedColumns: string[] = ['code','name','key'];
  dataSource = new MatTableDataSource();
  constructor(
    private $alert: AlertService,
    private $convertXLSX: ConvertXLSXService,
    private $country: HttpCountryService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const resData: any =await this.$country.get().toPromise();
      this.country = resData
      console.log("🚀 ~ resData:", resData)

      this.dataSource = new MatTableDataSource(resData);
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
      const stat = await this.$country.import(data).toPromise();
      console.log('🚀 ~ stat:', stat);
      this.$alert.success(2000, 'Data created!!', true);
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
  handleDownload() {
    try {
      if (this.country) {
        const dataExport = this.country.map((a:any)=>{
          return{
            code: a.code,
            name:a.name,
            key:a.key
          }
        })
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Generate blob from workbook
        const wb_out = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
        const blob = new Blob([wb_out], { type: 'application/vnd.ms-excel' });
        fs.saveAs(blob,'country.xlsx')
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
