import {Component, EventEmitter, Output, Input, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {CinemaDatasourceService} from 'src/app/common/cinema.datasource.service';
import {Movie} from "../../../common/model";

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss'],
})
export class MovieFormComponent implements OnInit {
  public formSubmitted: boolean = false;
  public movieExists: boolean = false;
  public regUrl = '^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$';
  public form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    genre: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z ,]+$'),
    ]),
    year: new FormControl('', [
      Validators.required,
      Validators.pattern('^(19|20)\\d{2}$'),
    ]),
    director: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z ,]+$'),
    ]),
    runtime: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?!0+$)[0-9]{1,10}$'),
    ]),
    poster: new FormControl('', [
      Validators.required,
      Validators.pattern(this.regUrl),
    ]),
  });

  constructor(private _movieService: CinemaDatasourceService) {
  }

  @Output()
  closeModal = new EventEmitter<string>();
  @Input()
  public mode?: string;
  @Input()
  public editedMovie?: Movie;

  public onClose() {
    this.closeModal.emit('');
  }

  public onSubmit() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return
    }
    const value = this.form.value;
    const newMovie = <Movie>{
      Title: value.title,
      Genre: value.genre,
      Director: value.director,
      Year: value.year,
      Runtime: value.runtime + 'mm',
      Poster: value.poster
    }
    if (this.mode === 'edit') {
      newMovie.imdbID = this.editedMovie?.imdbID
      this._saveMovieToDb(newMovie)
    }
    this._searchForDuplicate(newMovie);

  }

  private _searchForDuplicate(newMovie: Movie) {
    if (!newMovie.Title) return;
    const title = newMovie.Title;
      this._movieService.searchMovieByTitle(newMovie.Title).subscribe(
        response => {
          if (response.Response !== "True") {
            this._saveMovieToDb(newMovie)
          } else {
            let existingMovie = response.Search.some((movie: { Title: string; }) => movie.Title.toLowerCase().trim() === title.toLowerCase().trim()
            )
            if (!existingMovie) {
              this._saveMovieToDb(newMovie)
            }
            this.form.controls['title'].setErrors({'Exists': true});
            this.movieExists = true;
          }
        },
        error => {
          console.log(error);
        }
      );
    return;
  }

  private _saveMovieToDb(newMovie: Movie) {
    this._movieService.saveMovie(newMovie);
    this.form.reset();
    this.formSubmitted = false;
    this.onClose();
  }

  ngOnInit() {
    if (this.mode === "edit" && this.editedMovie) this.form.patchValue({
      title: this.editedMovie.Title,
      genre: this.editedMovie.Genre,
      director: this.editedMovie.Director,
      year: this.editedMovie.Year,
      runtime: parseInt(String(this.editedMovie.Runtime)),
      poster: this.editedMovie.Poster,
    })
  }

}
