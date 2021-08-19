import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {CinemaDatasourceService} from './common/cinema.datasource.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MovieTitlePipe} from './common/movie-title.pipe';
import {CommonModule} from '@angular/common';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {CinemaListComponent} from './content/cinema-list/cinema-list.component';
import {MovieFormComponent} from './content/cinema-list/movie-form/movie-form.component';
import {MovieCardComponent} from './content/cinema-list/movie-card/movie-card.component';
import {ClickStopPropagationDirective} from './common/stop-propagation.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CinemaListComponent,
    MovieTitlePipe,
    MovieFormComponent,
    MovieCardComponent,
    ClickStopPropagationDirective,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    BrowserModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [CinemaDatasourceService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
