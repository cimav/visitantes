import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {VisitantesPage} from "../pages/visitantes/visitantes";
import {VisitantePage} from "../pages/visitante/visitante";
import {DataService} from "./data.service";
import {Camara} from "../pages/visitante/camara";
import {VisitasPage} from "../pages/visitas/visitas";
import {VisitaPage} from "../pages/visitas/visita";
import {Camera} from "ionic-native";
import {SalidasPage} from "../pages/salidas/salidas";
import {Registro} from "../pages/visitantes/registro";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    VisitantesPage, VisitantePage, Camara, VisitasPage, VisitaPage, SalidasPage, Registro,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    VisitantesPage, VisitantePage, Camara, VisitasPage, VisitaPage, SalidasPage, Registro,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, DataService, Camera]
})
export class AppModule {}
