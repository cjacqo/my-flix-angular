import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public username: string = ''

  constructor(public router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem('user')!).UserName
  }

  navigateToMovieView() {
    this.router.navigate(['movies'])
  }

  navigateToUserProfile() {
    this.router.navigate(['user-profile'])
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['welcome'])
  }
}
