import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  directors: any[] = []
  movies: any[] = []
  userName: any | undefined

  constructor(public fetchApiData: FetchApiDataService) { }

  ngOnInit(): void {
    this.fetchDirectors()
    this.fetchMovies()
    this.userName = localStorage.getItem('user')
  }

  fetchMovies(): void {
    this.fetchApiData.getAllMoviesTEST().subscribe((resp: any) => {
      this.movies = resp
      for (const movie of this.movies) {
        this.findMoviesDirectors(movie)
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

  private findMoviesDirectors(movie: any): void {
    let foundDirectors: any[] = []
    movie.Directors.forEach((director: any) => {
      foundDirectors.push(this.directors.find(d => d._id === director))
    })
    movie.Directors = foundDirectors
  }

  listDirectors(directors: any) {
    return directors.map((director: any) => {
      return director.Name
    })
  }
}
