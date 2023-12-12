import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpPackingService } from 'src/app/https/http-packing.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConvertTextService } from 'src/app/services/convertText/convert-text.service';
import { ConvertXLSXService } from 'src/app/services/convertXLSX/convert-xlsx.service';
import Swal from 'sweetalert2';

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
    private $alert: AlertService,
    private router:Router
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
      if(e.target.files[0].name.includes(this.pkta[0]['Delivery Note#'])){
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
      }else{
        this.$alert.error(1500,'packing file is wrong!!',true)
      }

    } else {
      this.packing = [];
    }
  }

  async handleSubmit() {
    try {
      await this.$pkta.create({
        data: this.pkta,
        option :'clear'
      }).toPromise();
      await this.$packing.create(this.packing).toPromise();
      Swal.fire({
        title:'Success',
        icon:'success',
        showConfirmButton:false,
        timer:1500
      }).then(()=>{
        this.router.navigate(['user/view-invoice'],{
          queryParams:{
            key:this.pkta[0]['Delivery Note#']
          }
        })
      })
    } catch (error) {
      console.log('🚀 ~ error:', error);
      this.$alert.error(2000,'Duplicate invoice please check!',true)
    }
  }

  // foo() {
  //   localStorage.setItem('new-invoice-lg-view', 'true');
  //   const width = 1200;
  //   const height = 800;
  //   const left = (window.innerWidth - width) / 2;
  //   const top = (window.innerHeight - height) / 2;

  //   const newWindow = window.open(
  //     'http://localhost:4200/user/view-invoice?key=C23L1301A',
  //     '_blank',
  //     `width=${width},height=${height},left=${left},top=${top}`
  //   );

  //   // Optional: You can focus on the new window if needed
  //   if (newWindow) {
  //     newWindow.focus();
  //   }
  // }
}
