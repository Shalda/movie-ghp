import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'movieTitle',
})
export class MovieTitlePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string | null {
    if (!value) return null;
    return MovieTitlePipe.editStr(value);
  }

  private static editStr(str: string) {
    let res = '';
    res = str
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, ' ')
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
    return res;
  }
}
