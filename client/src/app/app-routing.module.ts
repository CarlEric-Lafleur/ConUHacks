import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './pages/form/form.component';
import { AppPages } from './enums/app-pages.enum';
import { AuthPageComponent } from './auth/auth-page/auth-page.component';
import { HomeComponent } from './pages/home/home/home.component';
import { FaceComponent } from './pages/face/face.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: AppPages.Login, pathMatch: 'full' },
  { path: AppPages.Home, component: HomeComponent, canActivate: [authGuard] },
  { path: AppPages.Login, component: AuthPageComponent },
  { path: AppPages.Form, component: FormComponent, canActivate: [authGuard] },
  { path: AppPages.Face, component: FaceComponent },
  {
    path: AppPages.Profile,
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: AppPages.Login },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
