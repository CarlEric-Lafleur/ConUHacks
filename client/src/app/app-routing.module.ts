import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPages } from './enums/app-pages.enum';
import { AuthPageComponent } from './auth/auth-page/auth-page.component';

const routes: Routes = [
  { path: '', redirectTo: AppPages.Home, pathMatch: 'full' },
  { path: AppPages.Home, component: AuthPageComponent },
  { path: '**', redirectTo: AppPages.Home }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
