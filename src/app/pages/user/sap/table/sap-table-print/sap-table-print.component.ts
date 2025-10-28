import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-sap-table-print',
  templateUrl: './sap-table-print.component.html',
  styleUrls: ['./sap-table-print.component.scss']
})
export class SapTablePrintComponent implements OnInit {


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
    private router: Router,
    private $loader: NgxUiLoaderService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.$loader.stopAll()
  }
  handleSearch(e: any) {
    this.$loader.startBackground()
    const uniquePkta = [...new Map(e.map((item: any) =>
      [item['invoice'], item])).values()];
    let sortArr = uniquePkta.sort((a: any, b: any) => a.invoice?.localeCompare(b.invoice))
    this.forms = sortArr
    this.dataSource = new MatTableDataSource(this.forms);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.$loader.stopAll()

    }, 300);
  }
  handleInvoiceConfig(item: any) {
    this.router.navigate(['user/sap/config-invoice'], {
      queryParams: {
        key: item['invoice']
      }
    })
  }
  handlePackingConfig(item: any) {
    this.router.navigate(['user/sap/config-packing'], {
      queryParams: {
        key: item['invoice']
      }
    })
  }

  handleInvoicePrint(item: any, key: any) {

    this.router.navigate(['user/sap/reprint-invoice'], {
      queryParams: {
        key: item['invoice']
      }
    })


  }
  handlePackingPrint(item: any, key: any) {


    this.router.navigate(['user/sap/reprint-packing'], {
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


    localStorage.setItem('INV_ISSUE_printItems', JSON.stringify(arr))
    setTimeout(() => {
      // Open in new tab with _blank
      window.open(`/invoice-issuing/user/sap/reprint-all`, '_blank')
    }, 300);



  }



  handleShowConfigInvoiceForm(element: any) {
    if (moment().diff(moment(element.createdAt), 'days') < 7) return true
    if (!element.invoiceForm) return true
    return false
  }
  handleShowPackingForm(element: any) {
    if (moment().diff(moment(element.createdAt), 'days') < 7) return true
    if (!element.packingForm) return true
    return false
  }

}
