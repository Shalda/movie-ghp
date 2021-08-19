import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Movie, PageInfo} from './model';
import {environment} from 'src/environments/environment';
import {imdbId} from 'src/app/common/imdbId';
import {Observable, Subject, Subscription, zip} from 'rxjs';
import {PaginatorService} from "./paginator.service";

@Injectable({
  providedIn: 'root',
})
export class CinemaDatasourceService {
  private dBUrl: string = environment.apiUrl;
  private dBKey: string = environment.apiKey;
  private imdbId: string[] = imdbId;
  private movies: Movie[] = [];
  private _paginatorSub: Subscription;
  private _paginationData: PageInfo;
  private movieUpdated = new Subject<Movie[]>();
  private isLoading = new Subject<boolean>();

  constructor(private _http: HttpClient,
              private _pageService: PaginatorService) {
    this._paginatorSub = this._pageService.getPaginatorListener().subscribe(
      (pageData: PageInfo) => {
        this._paginationData = pageData
      });
  }

  public getMovieListener() {
    return this.movieUpdated.asObservable();
  }

  public getLoadingListener() {
    return this.isLoading.asObservable();
  }

  public movieTransform() {
    this.isLoading.next(false);
    this.movieUpdated.next(
      [...this.movies]
    );
  }

  public saveMovie(movie: Movie) {
    if(!movie.imdbID){
      movie.imdbID =  'id' + (new Date()).getTime();
      let mTotal = ++this._paginationData.totalMovies;
      this._pageService.setPageData({totalMovies: mTotal })
      this.movies.unshift(movie);
      this.movies.pop();
    } else {
      console.log()
     this.movies.splice(this.movies.findIndex(m=> m.imdbID === movie.imdbID), 1, movie)
    }
    this.movieTransform();
  }

  public removeMovie(id: string) {
    let totalM = --this._paginationData.totalMovies;
    this.isLoading.next(true);
    this.movies.splice(this.movies.findIndex(m => m.imdbID === id), 1)
    this._pageService.setPageData({totalMovies: totalM})
    this.movieTransform()

  }

  public fetchMovies() {
    this._pageService.setPageData({totalMovies: this.imdbId.length})
    const keyArray: string[]= this.getMoviesKey();
    this.isLoading.next(true);
    const moviesReqArray = keyArray.map((id) => {
      return this._http.get<Movie>(`${this.dBUrl}${this.dBKey}&i=${id}`);
    });
    zip<Movie[]>(...moviesReqArray).subscribe((data) => {
      this.movies = data;
      setTimeout(() => {
        this.movieTransform();
      }, 500);
    });
  }

  public getMoviesKey() {
    const from = this._paginationData.currentPage * (this._paginationData.moviesPerPage + 1) ;
    const to = from + this._paginationData.moviesPerPage;
    return  this.imdbId.slice(from, to);
  }


  public searchMovieByTitle(title: string): Observable<{ Search: Movie[] } | any> {
    return this._http
      .get<{ Search: Movie[] } | any>(`${this.dBUrl}${this.dBKey}&s=${title}`)
  }

  public searchMovie(text: string) {
    if (text == '') this.fetchMovies();
    this.isLoading.next(true);
    return this._http
      .get<{ Search: Movie[] }>(`${this.dBUrl}${this.dBKey}&s=${text}`)
      .subscribe(
        (movies) => {
          if (movies.Search && movies.Search.length) {
            this._pageService.setPageData({currentPage: 0, totalMovies: movies.Search.length, moviesPerPage:  movies.Search.length} )
            this.movies = movies.Search;
            this.movieTransform();
          }
        },
        (err) => console.log('HTTP Error', err)
      );
  }
}
