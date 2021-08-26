import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './core/categories/categories.component';
import { LogoutComponent } from './core/logout/logout.component';
import { TagsComponent } from './core/tags/tags.component';

const routes: Routes = [
  { path: "logout", component: LogoutComponent },
  { path: "tags", component: TagsComponent },
  { path: "categories", component: CategoriesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
