import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubHeadComponent } from './sub-head/sub-head.component';
import { MaterialModule } from 'src/material/material.module';
import { Currency2Pipe } from '../pipes/currency2.pipe';

@NgModule({
  declarations: [SubHeadComponent, Currency2Pipe],
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  exports: [SubHeadComponent, Currency2Pipe],
})
export class ShareComponentsModule {}
