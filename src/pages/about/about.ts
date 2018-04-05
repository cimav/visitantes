import {Component} from '@angular/core';
import {ENV} from "../../config/environment-dev";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  versionNumber: any;

  tabCont: number = 0;

  serverUrl: string = ENV.API_URL;

  constructor() {
    console.log('6> ', ENV.SEDE);

    var sede_txt: string = 'Desconocida';
    switch(ENV.SEDE) {
      case 1: sede_txt = 'Chihuahua'; break;
      case 2: sede_txt = 'Juaréz'; break;
      case 3: sede_txt = 'Monterrey'; break;
      case 4: sede_txt = 'Durango'; break;
    }

    this.versionNumber = "1.23 | " + sede_txt;
  }

  tapShow() {
    this.tabCont++;
  }
  tapHide() {
    this.tabCont = 0;
    console.log('7> ', ENV.SEDE);

  }

}
