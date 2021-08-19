import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {PageInfo} from "./model";

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  private _pageInfo: PageInfo = {
    totalMovies: 0,
    moviesPerPage: 8,
    pageSizeOptions: [8, 12, 16],
    currentPage: 0,
  }
  private _paginationData = new Subject<PageInfo>();

  constructor() {
  }

  public getPaginatorListener() {
    return this._paginationData.asObservable()
  }

  public setPageData({
                       moviesPerPage = this._pageInfo.moviesPerPage,
                       currentPage = this._pageInfo.currentPage,
                       totalMovies = this._pageInfo.totalMovies,
                       pageSizeOptions = this._pageInfo.pageSizeOptions
                     }: any) {
    this._pageInfo = {moviesPerPage, currentPage, totalMovies, pageSizeOptions}
    this._paginationData.next({...this._pageInfo})
  }
}
