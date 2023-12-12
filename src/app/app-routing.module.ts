import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './pages/admin/admin.module';
import { UserModule } from './pages/user/user.module';
import { LoginComponent } from './pages/login/login.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    loadChildren: () => AdminModule,
    canActivate: [AdminGuard]
  },
  {
    path: 'user',
    loadChildren: () => UserModule,
    canActivate: [UserGuard]
  },
  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
