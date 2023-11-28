import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './pages/admin/admin.module';
import { UserModule } from './pages/user/user.module';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => AdminModule,
  },
  {
    path: 'user',
    loadChildren: () => UserModule,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
