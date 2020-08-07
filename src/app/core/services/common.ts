import {HttpHeaders} from '@angular/common/http';

export class CommonService {
  constructor() {
  }

  public static getOption() {
    const h = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {headers: h};
    return options;
  }

  formatSizeUnits(bytes) {
    if (bytes >= 1152921504606846976) {
      bytes = (bytes / 1152921504606846976).toFixed(2) + ' EB';
    } else if (bytes >= 1125899906842624) {
      bytes = (bytes / 1125899906842624).toFixed(2) + ' PB';
    } else if (bytes >= 1099511627776) {
      bytes = (bytes / 1099511627776).toFixed(2) + ' TB';
    } else if (bytes >= 1073741824) {
      bytes = (bytes / 1073741824).toFixed(2) + ' GB';
    } else if (bytes >= 1048576) {
      bytes = (bytes / 1048576).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
      bytes = (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes > 1) {
      bytes = bytes + ' bytes';
    } else if (bytes === 1) {
      bytes = bytes + ' byte';
    } else {
      bytes = '0 bytes';
    }
    return bytes;
  }

  formatSizeUnitsTotal(gibs) {
    if (gibs >= 1073741824) {
      gibs = (gibs / 1073741824).toFixed(2) + ' EB';
    } else if (gibs >= 1048576) {
      gibs = (gibs / 1048576).toFixed(2) + ' PB';
    } else if (gibs >= 1024) {
      gibs = (gibs / 1024).toFixed(2) + ' TB';
    } else if (gibs > 1) {
      gibs = gibs + ' GB';
    } else if (gibs === 1) {
      gibs = gibs + ' GB';
    } else {
      gibs = '0 GB';
    }
    return gibs;
  }

  maskAccessKey(pass: string): string {
    let mask = '';
    if (pass != null && pass.length > 0) {
      const length = pass.length > 10 ? 10 : pass.length;
      for (let i = 0; i < length; i++) {
        mask += '*';
      }
      return mask;
    }
    return '';
  }

  showIcon(key: string): string {
    let icon = '';
    const conut = key.split('.').length;
    const extent = key.split('.')[conut - 1].toLowerCase();
    switch (extent) {
      case 'pdf':
        icon = 'fas fa-file-pdf';
        break;
      case 'doc':
        icon = 'far fa-file-word';
        break;
      case 'docx':
        icon = 'far fa-file-word';
        break;
      case 'xlsx':
        icon = 'far fa-file-excel';
        break;
      default:
        icon = 'fas fa-file-alt';
        break;
    }
    return icon;
  }
}
