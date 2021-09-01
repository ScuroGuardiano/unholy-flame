import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './core/about/about.component';
import { CategoriesComponent } from './core/categories/categories.component';
import { LogoutComponent } from './core/logout/logout.component';
import { PrivacyComponent } from './core/privacy/privacy.component';
import { TagsComponent } from './core/tags/tags.component';

const routes: Routes = [
  { path: "logout", component: LogoutComponent },
  { path: "tags", component: TagsComponent },
  { path: "categories", component: CategoriesComponent },
  { path: "privacy", component: PrivacyComponent },
  { path: "about", component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
