import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './pages/form/form.component';
import { AppPages } from './enums/app-pages.enum';
import { AuthPageComponent } from './auth/auth-page/auth-page.component';
import { HomeComponent } from './pages/home/home/home.component';
import { FaceComponent } from './pages/face/face.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: AppPages.Home, pathMatch: 'full' },
  { path: AppPages.Home, component: HomeComponent },
  { path: AppPages.Login, component: AuthPageComponent },
  { path: AppPages.takeDrug, component: FormComponent },
  { path: AppPages.Form, component: FormComponent },
  { path: 'face', component: FaceComponent },
  { path: AppPages.Profile, component: ProfileComponent },
  { path: '**', redirectTo: AppPages.Home },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
