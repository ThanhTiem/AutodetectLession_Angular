import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterService'
})
export class FilterServicePipe implements PipeTransform {

  transform(items: any[], field: string[], value: string): any[] {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }

    return items.filter(item => {
      let itemFound: Boolean;
      for (let i = 0; i < field.length; i++) {
        if (item[field[i]].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          itemFound = true;
          break;
        }
      }
      return itemFound;
    });

    // return items.filter(singleItem =>
    //   singleItem[field].toLowerCase().includes(value.toLowerCase())
    // );
  }
}
