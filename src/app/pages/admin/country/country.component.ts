import { Component, OnInit } from '@angular/core';
import { HttpCountryService } from 'src/app/https/http-country.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  country: any[] | null = null;
  constructor(
    private $alert: AlertService,
    private $convertXLSX: ConvertXLSXService,
    private $country: HttpCountryService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.country = await this.$country.get().toPromise();
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
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.country);
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
}
