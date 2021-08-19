export interface Movie {
  imdbID?: string;
  Title?: string;
  Director?: string;
  Year?: number;
  Runtime?: string;
  Genre?: string;
  Poster?: string;
  Plot?: string;
  Actors? :string;
  imdbRating? :string;
}
export interface PageInfo {
  moviesPerPage: number,
  currentPage: number,
  pageSizeOptions: number[],
  totalMovies: number,
}

