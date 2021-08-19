import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Movie} from "../../../common/model";

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  constructor() {
  }

  @Output()
  public closeModal = new EventEmitter<string>();

  @Input()
  public editedMovie: Movie;

  public stopEvent(event: MouseEvent) {
    event.stopPropagation()
  }

  public onClose() {
    this.closeModal.emit('');
  }

  ngOnInit(): void {
  }
}
