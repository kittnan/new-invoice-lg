import { Component, OnInit, Pipe } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpItemCodeService } from 'src/app/https/http-item-code.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-item-code',
  templateUrl: './item-code.component.html',
  styleUrls: ['./item-code.component.scss'],
})
export class ItemCodeComponent implements OnInit {
  displayedColumns: string[] = ['itemCode', 'itemName', 'action'];
  dataSource = new MatTableDataSource();
  newItems: any[] = [];
  constructor(
    private $itemCode: HttpItemCodeService,
    private $alert: AlertService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      const resItemCode = await this.$itemCode.get().toPromise();
      console.log('🚀 ~ resItemCode:', resItemCode);
      this.dataSource = new MatTableDataSource(resItemCode);
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
  handleAddNew() {
    this.newItems.push({
      itemCode: null,
      itemName: null,
      active: true,
    });
  }
  handleDelete(index: number) {
    this.newItems = this.newItems.filter((a: any, i: number) => i !== index);
  }
  async handleSubmit() {
    try {
      Swal.fire({
        title: "Do you want to save?",
        icon: 'question',
        showCancelButton: true
      }).then(async (v: SweetAlertResult) => {
        if (v.isConfirmed) {

          console.log(this.newItems);
          const dataCreate = this.newItems.filter(
            (a: any) => a.itemCode && a.itemName
          );
          await this.$itemCode.create(dataCreate).toPromise();
          this.$alert.success(1000, 'SUCCESS', true);

        }
      })
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
  async handleDeleteTable(item: any) {
    try {
      Swal.fire({
        title: 'Do you want to delete?',
        icon: 'question',
        showCancelButton: true,
      }).then(async (v: SweetAlertResult) => {
        if (v.isConfirmed) {
          await this.$itemCode.update({ ...item, active: false }).toPromise();
          this.$alert.success(1000, 'SUCCESS', true);
        }
      });
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
}
