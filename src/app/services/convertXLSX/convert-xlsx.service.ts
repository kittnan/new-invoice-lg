import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ConvertXLSXService {
  constructor() {}

  readExcel(file: File) {
    return new Promise((resolve) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const binaryData = e.target.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        resolve(data);
      };
      reader.readAsBinaryString(file);
    });
  }
}
