import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor() { }

  menuItems: NbMenuItem[] = [
    {
      icon: "home-outline",
      title: "Home",
      link: "/"
    },
    {
      icon: "file-text-outline",
      title: "Posts",
      link: "/posts"
    },
    {
      icon: "person-outline",
      title: "Authors",
      link: "/authors"
    },
    {
      icon: "folder-outline",
      title: "Categories",
      link: "/categories"
    },
    {
      icon: "hash-outline",
      title: "Tags",
      link: "/tags"
    },
    {
      icon: "lock-outline",
      title: "Privacy policy",
      link: "/privacy"
    },
    {
      icon: "info-outline",
      title: "About",
      link: "/about"
    },
    {
      icon: "log-out-outline",
      title: "Logout",
      link: "/logout"
    }
  ]

  ngOnInit(): void {
  }

}
