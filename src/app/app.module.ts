import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbCardModule, NbInputModule, NbButtonModule, NbFormFieldModule, NbIconModule, NbSidebarModule, NbMenuModule, NbToastrModule, NbDialogModule, NbSpinnerModule, NbTooltipModule, NbCheckboxModule, NbProgressBarModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { LogoutComponent } from './core/logout/logout.component';
import { TagsComponent } from './core/tags/tags.component';
import { TableComponent } from './helpers/table/table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ConfirmDialogComponent } from './helpers/confirm-dialog/confirm-dialog.component';
import { ConfirmWaitingDialogComponent } from './helpers/confirm-waiting-dialog/confirm-waiting-dialog.component';
import { IsHoveredDirective } from './directives/is-hovered.directive';
import { ResizeObserverDirective } from './directives/resize-observer.directive';
import { CategoriesComponent } from './core/categories/categories.component';
import { EditCategoryComponent } from './core/categories/edit-category/edit-category.component';
import { StaticComponent } from './core/static/static.component';
import { PrivacyComponent } from './core/privacy/privacy.component';
import { AboutComponent } from './core/about/about.component';
import { MarkedPipe } from './helpers/pipes/marked.pipe';
import { MediaComponent } from './core/media/media.component';
import { DragNDropFileUploadInput } from './core/media/upload/drag-n-drop-file-upload/drag-n-drop-file-input.component';
import { FileToUrlPipe } from './helpers/pipes/file-to-url.pipe';
import { FilesizePipe } from './helpers/pipes/filesize.pipe';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { UploaderComponent } from './core/media/upload/uploader/uploader.component';
import { UploadComponent } from './core/media/upload/upload/upload.component';
import { BrowseMediaComponent } from './core/media/browse-media/browse-media.component';
import { MediaElementComponent } from './core/media/browse-media/media-element/media-element.component'

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
  NbSpinnerModule,
  NbTooltipModule,
  NbCheckboxModule,
  NbProgressBarModule
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
    ConfirmWaitingDialogComponent,
    IsHoveredDirective,
    ResizeObserverDirective,
    CategoriesComponent,
    EditCategoryComponent,
    StaticComponent,
    PrivacyComponent,
    AboutComponent,
    MarkedPipe,
    MediaComponent,
    DragNDropFileUploadInput,
    FileToUrlPipe,
    FilesizePipe,
    UploaderComponent,
    UploadComponent,
    BrowseMediaComponent,
    MediaElementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    ...Nebula
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
