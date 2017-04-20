import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  cont: number = 0;

  constructor(public navCtrl: NavController) {

  }

  tapEvent() {
    this.cont++;
  }

}
