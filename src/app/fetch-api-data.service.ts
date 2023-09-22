import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators'

const apiUrl = 'https://list-o-movies-311c22237892.herokuapp.com/'

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  constructor(private http: HttpClient) { }

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    )
  }

  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    )
  }

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + token }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + token }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  getAllDirectors(): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(apiUrl + 'directors', {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + token }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(apiUrl + 'directors/' + directorName, {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + token }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + token }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  getAllGenres(): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(apiUrl + 'genres', {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + token }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  getOneUser(username: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user
  }

  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = localStorage.getItem('token')
    return this.http.put(apiUrl + 'users/' + user.UserName, updatedUser, {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + token }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = localStorage.getItem('token')
    return this.http.delete(apiUrl + 'users/' + user._id, {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + token }
      )
    }).pipe(
      catchError(this.handleError)
    )
  }

  getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        { Authorization: 'Bearer ' + token }
      )
    }).pipe(
      map(this.extractResponseData),
      map(data => data.FavoriteMovies),
      catchError(this.handleError)
    )
  }

  addFavoriteMovie(userName: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    })

    return this.http.post(apiUrl + 'users/' + userName + '/movies/' + movieId, null, {
      headers,
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    )
  }

  deleteFavoriteMovie(userName: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    })

    return this.http.delete(apiUrl + 'users/' + userName + '/movies/' + movieId, {
      headers,
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    )
  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user) return user.FavoriteMovies.includes(movieId)
    return false
  }

  private extractResponseData(res: any): any {
    const body = res
    return body || {}
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message)
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      )
    }
    return throwError('Something bad happened; please try again later.')
  }
}