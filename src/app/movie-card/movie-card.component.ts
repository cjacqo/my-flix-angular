import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenreDetailsComponent } from '../genre-details/genre-details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  directors: any[] = []
  genres: any[] = []
  movies: any[] = []
  userName: any | undefined

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      this.fetchDirectors()
      this.fetchMovies()
      this.fetchGenres()
      this.userName = localStorage.getItem('user')
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

  fetchDirectors(): void {
    this.fetchApiData.getAllDirectors().subscribe((resp: any) => {
      this.directors = resp
      return this.directors
    })
  }

  fetchGenres(): void {
    this.fetchApiData.getAllGenres().subscribe((resp: any) => {
      this.genres = resp
      return this.genres
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
    this.dialog.open(GenreDetailsComponent, {
      width: '500px'
    })
  }
}
