import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LogoutComponent } from './logout/logout.component';
import { TagsComponent } from './tags/tags.component';

const routes: Routes = [
  { path: "logout", component: LogoutComponent },
  { path: "tags", component: TagsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
