import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {ENV} from "../../config/environment-dev";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

    console.log( 'Env> ' + ENV.API_URL );
  }

}
