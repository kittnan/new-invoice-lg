import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpPktaService } from 'src/app/https/http-pkta.service';
import { HttpReprintService } from 'src/app/https/http-reprint.service';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {

  forms: any = null
  date: any = {
    start: new Date(),
    end: null
  }

  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'no', 'invoice', 'createdAt', 'invoicePdf', 'packingPdf', 'issue'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private $pkta: HttpPktaService,
    private router: Router,
  ) {

  }

  async ngOnInit(): Promise<void> {
  }
  handleSearch(e: any) {
    const uniquePkta = [...new Map(e.map((item: any) =>
      [item['invoice'], item])).values()];
    let sortArr = uniquePkta.sort((a: any, b: any) => a.invoice.localeCompare(b.invoice))
    this.forms = sortArr
    this.dataSource = new MatTableDataSource(this.forms);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 300);
  }
  handleInvoiceConfig(item: any) {
    this.router.navigate(['user/config-invoice'], {
      queryParams: {
        key: item['invoice']
      }
    })
  }
  handlePackingConfig(item: any) {
    this.router.navigate(['user/config-packing'], {
      queryParams: {
        key: item['invoice']
      }
    })
  }

  handleInvoicePrint(item: any, key: any) {

    this.router.navigate(['user/reprint-invoice'], {
      queryParams: {
        key: item['invoice']
      }
    })


  }
  handlePackingPrint(item: any, key: any) {


    this.router.navigate(['user/reprint-packing'], {
      queryParams: {
        key: item['invoice'],
        mode: key
      }
    })


  }


  htmlViewReprint(mode: string, data: any) {
    let len = data.reprint?.filter((a: any) => a.mode == mode).length
    if (len === 0) return ''
    return len
  }
  handleValidReprint(item: any, mode: string) {
    if (item && item.reprint && item.reprint.some((a: any) => a.mode == mode)) return true
    return false
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  printAll() {
    let arr = this.selection.selected.filter((item: any) => {
      if (item.packingForm && item.invoiceForm) {
        return true
      } else {
        return false
      }
    })
    arr = arr.map((a: any) => a['invoice'])


    localStorage.setItem('DIS_printItems', JSON.stringify(arr))
    setTimeout(() => {
      // todo new tab
      window.open(`/domestics-invoice-system/user/reprint-all`, '_blank')
      // todo route normal
      // this.router.navigate(['user/reprint-all'])
    }, 300);



  }

}
