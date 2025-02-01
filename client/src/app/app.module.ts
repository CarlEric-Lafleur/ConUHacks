import { isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HomeComponent } from './pages/home/home/home.component';
import { MedicineCardComponent } from './components/medicine-card/medicine-card/medicine-card.component';
import { AuthPageComponent } from './auth/auth-page/auth-page.component';
import { environment } from './environments/environment';
import { NotificationComponent } from './notification/notification.component';
import { FirstConnectionComponent } from './auth/auth-page/first-connection/first-connection.component';
import { LoginComponent } from './auth/auth-page/login/login.component';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user/user.service';
import { FirebaseService } from './services/firebase/firebase.service';
import { HttpCommunicationService } from './services/http-communication/http-communication.service';
import { NotificationService } from './services/notification/notification.service';
import { UserCommunicationService } from './services/user-communication/user-communication.service';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';

const modules = [
  MatMenuModule,
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatButtonToggleModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  DragDropModule,
  MatSelectModule,
  MatStepperModule,
  MatDialogModule,
  MatMenuModule,
  MatChipsModule,
  FormsModule
];

@NgModule({
  declarations: [AppComponent, AuthPageComponent, MedicineCardComponent, NotificationComponent, FirstConnectionComponent, LoginComponent, HomeComponent, HeaderComponent],
  imports: [
    ...modules,  
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),

  ],
  providers: [provideAnimationsAsync(),
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
      provideHttpClient(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
