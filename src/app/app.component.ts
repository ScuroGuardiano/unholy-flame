import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public auth: AngularFireAuth) {}

  title = 'unholy-flame';
  userLoaded = false;

  ngOnInit() {
    const sub = this.auth.user.subscribe((user) => {
      setTimeout(() => this.userLoaded = true, 0);
      sub.unsubscribe();
    })
  }
}
