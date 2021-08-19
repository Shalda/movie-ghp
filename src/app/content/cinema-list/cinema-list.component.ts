import {Component, OnDestroy, OnInit} from '@angular/core';
import {CinemaDatasourceService} from '../../common/cinema.datasource.service';
import {Movie, PageInfo} from '../../common/model';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {PaginatorService} from "../../common/paginator.service";

@Component({
  selector: 'app-cinema-list',
  templateUrl: './cinema-list.component.html',
  styleUrls: ['./cinema-list.component.scss'],
})
export class CinemaListComponent implements OnInit, OnDestroy {
  public movie: Movie = {};
  public movies: Movie[] = [];
  public paginationData: PageInfo;
  public isLoading!: boolean;
  public mode: string = "";
  public editedMovie: Movie = {};
  public movieSub: Subscription;
  public isLoadingSub: Subscription;
  public paginatorSub: Subscription;

  constructor(private _movieService: CinemaDatasourceService,
              private _pageService: PaginatorService) {
  }

  onChangePage(pageData: PageEvent) {
    this._pageService.setPageData({
      moviesPerPage: pageData.pageSize,
      currentPage: pageData.pageIndex
    })
    this._movieService.fetchMovies();
  }

  public removeMovie(id: string | undefined) {
    if (!id) return;
    this._movieService.removeMovie(id);
  }

  public onChangeMode(val: string) {
    this.mode = val;
  }

  ngOnInit(): void {
    this.paginatorSub = this._pageService
      .getPaginatorListener()
      .subscribe((pageData: PageInfo) => {
          this.paginationData = pageData
        }
      );
    this.movieSub = this._movieService
      .getMovieListener()
      .subscribe((movies) => {
        this.movies = movies;
      });
    this.isLoadingSub = this._movieService
      .getLoadingListener()
      .subscribe((val: boolean) => (this.isLoading = val));
    this._pageService.setPageData({})
    this._movieService.fetchMovies();
  }

  ngOnDestroy() {
    this.movieSub.unsubscribe();
    this.paginatorSub.unsubscribe();
  }
}
