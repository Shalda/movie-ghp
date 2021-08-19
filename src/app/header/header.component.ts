import {Component, OnDestroy, Output, EventEmitter, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CinemaDatasourceService} from '../common/cinema.datasource.service';
import {PaginatorService} from "../common/paginator.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public searchTextChanged = new Subject();
  private inputSubscr: Subscription;

  constructor(private _movieService: CinemaDatasourceService, private _pageService: PaginatorService) {
  }

  public changed(text: string) {
    this.searchTextChanged.next(text.trim());
  }

  public onGoHome() {
    this._pageService.setPageData({currentPage: 0, moviesPerPage: 8})
    this._movieService.fetchMovies()
  }

  ngOnInit(): void {
    this.inputSubscr = this.searchTextChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((text) => {
        this._movieService.searchMovie(text as string);
      });
  }

  ngOnDestroy(): void {
    this.inputSubscr.unsubscribe();
  }
}
