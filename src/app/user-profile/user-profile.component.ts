import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {}
  updatedUser: any = {}
  movies: any[] = []
  favoriteMovies: any[] = []

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      this.user = JSON.parse(localStorage.getItem('user')!)
      this.fetchFavoriteMovies()
    } else {
      this.router.navigate(['welcome'])
    }
  }

  fetchFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      const movies = resp
      movies.forEach((movie: any) => {
        if (this.user.FavoriteMovies.includes(movie._id)) {
          this.favoriteMovies.push(movie.Title)
        }
      })
    })
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.user.UserName, this.updatedUser).subscribe((resp: any) => {
      this.snackBar.open('Update Successful!', 'OK', {
        duration: 2000
      })
      localStorage.setItem('user', JSON.stringify(resp))
    }, result => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      })
    })
  }

}
