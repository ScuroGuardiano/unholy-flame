import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NbSidebarState } from '@nebular/theme';
import firebase from 'firebase';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None // I have to do it like this to reach childs of nb-sidebar.
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(public auth: AngularFireAuth) {}

  title = 'unholy-flame';
  userLoaded = false;
  user: firebase.User | null = null;

  private authUserSub: Subscription | undefined;

  sidebarState: NbSidebarState = "compacted";
  sidebarCompactingTimeout: any;

  onSidebarHover(isHovered: boolean) {
    this.sidebarCompactingTimeout && clearTimeout(this.sidebarCompactingTimeout);

    if (isHovered) {
      return this.sidebarState = "expanded";
    }

    this.sidebarCompactingTimeout = setTimeout(() => this.sidebarState = "compacted", 1000);
    return;
  }

  ngOnInit() {
    /*
      I have to load user here, coz when I use async pipe in component view
      There's a blink of login form for like 50ms or something
      And I don't like that. Giving in timeout function any time didn't worked
      I guess async pipe is waiting for next event loop iteration and that's why
      It blinks. By making this load here I am making sure that view will be shown
      after fully loaded user and it won't be waiting for next event loop iteration
      or something.
    */
    this.authUserSub = this.auth.user.subscribe(user => {
      setTimeout(() => {
        this.userLoaded = true;
        this.user = user;
      }, 0);
    });
  }

  ngOnDestroy() {
    this.authUserSub?.unsubscribe();
  }
}
