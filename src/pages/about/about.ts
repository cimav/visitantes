import {Component} from '@angular/core';
import {ENV} from "../../config/environment-dev";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  versionNumber: any = "4.40";

  tabCont: number = 0;

  serverUrl: string = ENV.API_URL;

  constructor() {

  }

  tapEvent() {
    this.tabCont++;
    console.log("tap>", this.tabCont);
  }

}
