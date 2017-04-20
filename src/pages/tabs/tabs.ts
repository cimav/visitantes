import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import {VisitantesPage} from "../visitantes/visitantes";
import {SalidasPage} from "../salidas/salidas";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
//  tab1Root: any = HomePage;
  tabAboutRoot: any = AboutPage;
//  tab3Root: any = ContactPage;
  tabVisitantesRoot: any = VisitantesPage;
  tabSalidasRoot: any = SalidasPage;

  constructor() {

  }
}
