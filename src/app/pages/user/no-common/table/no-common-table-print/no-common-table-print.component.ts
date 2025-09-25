import { SelectionModel } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpNoCommonDataFormService } from 'src/app/https/NO_COMMON/http-no-common-data-form.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-no-common-table-print',
  templateUrl: './no-common-table-print.component.html',
  styleUrls: ['./no-common-table-print.component.scss']
})
export class NoCommonTablePrintComponent implements OnInit {


  invoice: any = null
  statusOption = [
    'available',
    'unavailable',
    'all'
  ]
  statusSelected = 'available'

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
    private $loader: NgxUiLoaderService,
    private $noComForm: HttpNoCommonDataFormService

  ) {

  }

  async ngOnInit(): Promise<void> {
    this.$loader.stopAll()
  }

  clearStartDate(key: any) {
    this.date[key] = null
  }

  async handleSearch() {
    try {
      let p: HttpParams = new HttpParams()
      if (this.invoice) {
        p = p.set('key', JSON.stringify(this.invoice))
      }
      p = p.set('date', JSON.stringify(this.date))
      if (this.statusSelected != 'all') {
        p = p.set('status', JSON.stringify([this.statusSelected]))
      }
      p = p.set('sort', JSON.stringify(1))
      const resData = await this.$noComForm.search(p).toPromise()

      console.log(`⚡ ~ :67 ~ NoCommonTablePrintComponent ~ resData:`, resData);
      this.dataSource = new MatTableDataSource(resData);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.$loader.stopAll()

      }, 300);
      this.selection.clear()
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
  }

  handleClearFilter() {
    this.invoice = null
    this.date = {
      start: null,
      end: null
    }
    this.statusSelected = 'available'
    localStorage.removeItem('INV_ISSUE_filter')
    Swal.fire({
      title: 'Success',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    })
  }

  handleInvoiceConfig(item: any) {
    this.router.navigate(['user/no-common/config-invoice'], {
      queryParams: {
        key: item['invoice']
      }
    })
  }
  handlePackingConfig(item: any) {
    this.router.navigate(['user/no-common/config-packing'], {
      queryParams: {
        key: item['invoice']
      }
    })
  }

  handleInvoicePrint(item: any, key: any) {

    this.router.navigate(['user/no-common/reprint-invoice'], {
      queryParams: {
        key: item['invoice']
      }
    })


  }
  handlePackingPrint(item: any, key: any) {


    this.router.navigate(['user/no-common/reprint-packing'], {
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
      // todo new tab
      window.open(`/invoice-issuing/user/sap/reprint-all`, '_blank')
      // todo route normal
      // this.router.navigate(['user/sap/reprint-all'])
    }, 300);



  }
}
