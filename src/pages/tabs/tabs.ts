import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import {VisitantesPage} from "../visitantes/visitantes";
import {SalidasPage} from "../salidas/salidas";
import {ProveedoresPage} from "../proveedores/proveedores";
import {ProgramadasPage} from "../programadas/programadas";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabVisitantesRoot: any = VisitantesPage;
  tabSalidasRoot: any = SalidasPage;
  tabProveedoresRoot: any = ProveedoresPage;
  tabProgramadasRoot: any = ProgramadasPage;
  tabAboutRoot: any = AboutPage;

  constructor() {

  }
}
