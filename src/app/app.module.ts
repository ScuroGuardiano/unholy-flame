import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbCardModule, NbInputModule, NbButtonModule, NbFormFieldModule, NbIconModule, NbSidebarModule, NbMenuModule, NbToastrModule, NbDialogModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation/navigation.component';
import { LogoutComponent } from './logout/logout.component';
import { TagsComponent } from './tags/tags.component';
import { TableComponent } from './table/table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ConfirmDialogComponent } from './helpers/confirm-dialog/confirm-dialog.component';
import { ConfirmWaitingDialogComponent } from './helpers/confirm-waiting-dialog/confirm-waiting-dialog.component';

const Nebula = [
  NbThemeModule.forRoot({ name: 'dark' }),
  NbLayoutModule,
  NbEvaIconsModule,
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbFormFieldModule,
  NbIconModule,
  NbSidebarModule.forRoot(),
  NbMenuModule.forRoot(),
  NbToastrModule.forRoot(),
  NbDialogModule.forRoot(),
  NbSpinnerModule
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    LogoutComponent,
    TagsComponent,
    TableComponent,
    ConfirmDialogComponent,
    ConfirmWaitingDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    ...Nebula
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
