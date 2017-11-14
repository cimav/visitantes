import {Component} from '@angular/core';
import {ENV} from "../../config/environment-dev";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  versionNumber: any = "4.45";

  tabCont: number = 0;

  serverUrl: string = ENV.API_URL;

  constructor() {

  }

  tapShow() {
    this.tabCont++;
  }
  tapHide() {
    this.tabCont = 0;
  }

}
