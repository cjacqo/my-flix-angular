import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InfoDialogBasicComponent } from '../info-dialog-basic/info-dialog-basic.component';

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
    public snackBar: MatSnackBar,
    public dialog: MatDialog
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
          this.favoriteMovies.push(movie)
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

  deleteUser(): void {
    this.fetchApiData.deleteUser(this.user.UserName).subscribe((resp: any) => {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.router.navigate(['welcome'])
    }, result => {
      console.log(result)
      this.snackBar.open('Cannot delete user', 'OK', {
        duration: 2000
      })
    })
  }

  openMovieDetailsDialog(movie: any): void {
    this.dialog.closeAll()
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      dialogTitle: 'Synopsis',
      dialogContent: movie.Description
    }
    dialogConfig.width = '500px'
    this.dialog.open(InfoDialogBasicComponent, dialogConfig)
  }

  removeFromFavoriteMovies(movie: any): void {
    if (this.user.FavoriteMovies.includes(movie._id)) {
      this.fetchApiData
        .deleteFavoriteMovie(this.user.UserName, movie._id)
        .subscribe((resp: any) => {
          this.user.FavoriteMovies = this.user.FavoriteMovies.filter((id: String) => id !== movie._id)
          localStorage.setItem('user', JSON.stringify(this.user))
        })
    }
  }
}
