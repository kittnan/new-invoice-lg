import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubHeadComponent } from './sub-head/sub-head.component';
import { MaterialModule } from 'src/material/material.module';

@NgModule({
  declarations: [SubHeadComponent],
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  exports: [SubHeadComponent],
})
export class ShareComponentsModule {}
