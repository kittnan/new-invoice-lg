import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver'
import { HttpUsersService } from 'src/app/https/http-users.service';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  users:any = null
  displayedColumns: string[] = ['no', 'employee_code','name','auth_admin','auth_user'];
  dataSource = new MatTableDataSource();
  constructor(
    private $alert: AlertService,
    private $convertXLSX: ConvertXLSXService,
    private $user:HttpUsersService
  ) { }


  async ngOnInit(): Promise<void> {
    try {
      this.users = await this.$user.get().toPromise();
      this.dataSource = new MatTableDataSource(this.users);

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
      const stat = await this.$user.import(data).toPromise();
      this.$alert.success(2000, 'Data created!!', true);
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
  handleDownload() {
    try {
      if (this.users) {
        const dataExport = this.users.map((a:any)=>{
          return {
            employee_code: a.employee_code,
            name: a.name,
            auth_admin: a.auth_admin,
            auth_user: a.auth_user,
          }
        })
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        const wb_out = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
        const blob = new Blob([wb_out], { type: 'application/vnd.ms-excel' });
        fs.saveAs(blob,'users.xlsx')

      }
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }


}
