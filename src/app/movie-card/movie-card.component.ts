import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { InfoDialogBasicComponent } from '../info-dialog-basic/info-dialog-basic.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  directors: any[] = []
  genres: any[] = []
  movies: any[] = []
  user: any | undefined

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      this.fetchApiData.getAllDirectors().subscribe((resp: any) => {
        this.directors = resp
        this.fetchApiData.getAllGenres().subscribe((resp: any) => {
          this.genres = resp
          this.fetchMovies()
        })
      })
      this.user = JSON.parse(localStorage.getItem('user')!)
    } else {
      this.router.navigate(['welcome'])
    }
  }

  fetchMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp
      for (const movie of this.movies) {
        this.findMoviesDirectors(movie)
        this.findMoviesGenre(movie)
      }
      return this.movies
    })
  }

  private findMoviesDirectors(movie: any): void {
    let foundDirectors: any[] = []
    movie.Directors.forEach((director: any) => {
      foundDirectors.push(this.directors.find(d => d._id === director))
    })
    movie.Directors = foundDirectors
  }

  private findMoviesGenre(movie: any): void {
    let foundGenre: any
    foundGenre = this.genres.find(g => g._id === movie.Genre)
    movie.Genre = foundGenre
  }

  listDirectors(directors: any) {
    return directors.map((director: any) => {
      return director.Name
    })
  }

  openGenreDialog(genre: any): void {
    this.dialog.closeAll()
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      dialogTitle: genre.Name,
      dialogContent: genre.Description
    }
    dialogConfig.width = '500px'
    this.dialog.open(InfoDialogBasicComponent, dialogConfig)
  }

  openDirectorsDialog(directors: any): void {
    this.dialog.closeAll()
    console.log(directors)
    const dialogConfig = new MatDialogConfig()
    const directorNames = directors.map((director: any) => director.Name)
    const directorBios = directors.map((director: any) => director.Bio)
    dialogConfig.data = {
      dialogTitle: directorNames,
      dialogContent: directorBios
    }
    dialogConfig.width = '500px'
    this.dialog.open(InfoDialogComponent, dialogConfig)
  }

  openSynopsisDialog(description: any): void {
    this.dialog.closeAll()
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      dialogTitle: 'Synopsis',
      dialogContent: description
    }
    dialogConfig.width = '500px'
    this.dialog.open(InfoDialogBasicComponent, dialogConfig)
  }

  handleSetFavoriteMovie(movieId: string): void {
    if (this.user.FavoriteMovies.includes(movieId)) {
      this.fetchApiData
        .deleteFavoriteMovie(this.user.UserName, movieId)
        .subscribe((resp: any) => {
          this.user.FavoriteMovies = this.user.FavoriteMovies.filter((id: String) => id !== movieId)
          localStorage.setItem('user', JSON.stringify(this.user))
        })
    } else {
      this.fetchApiData
        .addFavoriteMovie(this.user.UserName, movieId)
        .subscribe((resp: any) => {
          this.user.FavoriteMovies.push(movieId)
          localStorage.setItem('user', JSON.stringify(this.user))
        })
    }
  }
}
