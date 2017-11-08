import {Component, ViewChild, ElementRef,} from '@angular/core';
import {ModalController, NavParams, NavController, ToastController, Platform, LoadingController} from 'ionic-angular';
import {Visitante, CameraData, Visita} from "../../app/model";
import {Response} from "@angular/http";
import {DataService} from "../../app/data.service";
import {Camara} from "./camara";
import {Camera} from "ionic-native";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Registro} from "../visitantes/registro";
import {ENV} from "../../config/environment-dev";

@Component({
  selector: 'page-visitante',
  templateUrl: 'visitante.html'
})
export class VisitantePage {

  visitante: Visitante;

  statusCamera: number = 0;

  @ViewChild('canvasEle') canvasEle: ElementRef;

  private ctx: CanvasRenderingContext2D;

  private isDesktop: boolean = false;
  private isAndroid: boolean = false;

  private loading: any;

  visitanteForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService,
              public  modalCtrl: ModalController, public toastCtrl: ToastController, platform: Platform, public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder) {

    this.visitanteForm = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      apellido: ['', Validators.compose([Validators.maxLength(40), Validators.required])], //Validators.pattern('[a-zA-Z ñáéíóúüÑÁÉÍÓÚÜ]*'),
      empresa: ['', Validators.required],
      nota: [''],
      tipo: ['']
    });

    platform.ready().then(() => {
      this.isDesktop = platform.is('core');
      this.isAndroid = platform.is('android');
    });

    // If we navigated to this page, we will have an item available as a nav param
    this.visitante = navParams.get('visitante');

    this.goBackToVisitantes(false);

  }

  public onSubmit(updated:any) {

    this.presentLoadingDefault(true);

    if (this.visitante.id) {
      this.dataService.putVisitante(this.visitante).subscribe(
        (response: Response) => {
          this.goBackToVisitantes(true);

        },
        error => console.log(error),
        () => {
          this.presentLoadingDefault(false);
          this.presentToast('Visitante  guardado', 'bottom');
          console.log("Update Single Vistante #" + this.visitante.id);
        }
      );
    } else {
      this.dataService.postVisitante(this.visitante).subscribe(
        (newVisitante: Visitante) => {
          this.visitante.id = newVisitante.id;

          this.goEntrada();
        },
        error => console.log(error),
        () => {
          this.presentLoadingDefault(false);
          this.presentToast('Visitante  nuevo guardado', 'bottom');
          console.log("Bew Single Vistante #" + this.visitante.nombre);
        }
      );
    }

  }

  goEntrada() {

    let profileModal = this.modalCtrl.create(Registro, {visitante:this.visitante}, {showBackdrop: true, enableBackdropDismiss: true});
    profileModal.onDidDismiss(dataVisitante => {
      //visitante = dataVisitante;

      this.goBackToVisitantes(true);

    });
    profileModal.present();
  }

  goBackToVisitantes(regresar: boolean) {

    if (this.visitante.id) {
      this.presentLoadingDefault(true);
      /* Lo regreso desde la DB */
      this.dataService.getVisitanteLast(this.visitante.id).subscribe(
        (response: Visitante) => {
          let avatarTmp: string = this.visitante.avatar;
          let visitaTmp: Visita = this.visitante.visita;
          this.visitante = response;
          this.visitante.avatar = avatarTmp;
          this.visitante.visita = visitaTmp;
          this.visitante.random_num = Math.random();

          if (regresar) {
            this.navCtrl.pop().then(() => this.navParams.get('resolve')(this.visitante));
          }
        },
        error => {
          console.log(error);
        },
        () => {
          this.presentLoadingDefault(false);
          console.log("Get Visitante:" + this.visitante.id);
        }
      );
    } else {
      this.navCtrl.pop().then(() => this.navParams.get('reject')(this.visitante));
    }

  }

  ionViewWillLeave() {
  }

  getAvatarUrlRest() {
    let src = ENV.API_URL + "/visitantes/avatar/" + this.visitante.id + "?c=" + this.visitante.random_num;
    return src;
  }

  showImagen() {
    if(this.statusCamera == 2) {
      return "none";
    } else {
      return "flex";
    }
  }

  showCanvas() {
    if(this.statusCamera == 2) {
      return "flex";
    } else {
      return "none";
    }
  }

  openCamera() {
    this.statusCamera = 1;

    if (this.isDesktop) {
      let profileModal = this.modalCtrl.create(Camara, {}, {showBackdrop: true, enableBackdropDismiss: false}); //, { userId: 8675309 }, {showBackdrop: false}
      profileModal.onDidDismiss(data => {
        let cameraData: CameraData = data;
        this.statusCamera = cameraData.status;
        if (this.statusCamera == 2) {

          let base64Image: string = /*"data:image/png;base64," + */ cameraData.base64;

          this.visitanteForm.get('empresa').markAsDirty(true);
          this.visitanteForm.markAsDirty();

          this.visitante.avatar = base64Image;
          this.visitante.random_num = Math.random();

          let canvas = this.canvasEle.nativeElement;
          this.ctx = canvas.getContext('2d');
          var image = new Image();
          image.src = base64Image;

          image.onload = () => {
            this.ctx.drawImage(image, 0, 0, 300, 300);
          }

        }
      });
      profileModal.present();
    } else {

        Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 300,
        targetHeight: 300
      }).then((imageData) => {

        // imageData is a base64 encoded string
        let base64Image: string = "data:image/png;base64," + imageData;

        this.visitanteForm.markAsDirty();
        this.statusCamera = 2;

        this.visitante.avatar = base64Image;
        this.visitante.random_num = Math.random();

        let canvas = this.canvasEle.nativeElement;
        this.ctx = canvas.getContext('2d');
        var image = new Image();
        image.src = this.visitante.avatar;

        /*
        var wRatio = canvas.width / image.width;
        var hRatio = canvas.height / image.height;
        var ratio = Math.min (wRatio, hRatio);
        this.ctx.drawImage(image, 0, 0, canvas.width,canvas.height,   0,0,image.width*ratio,image.height*ratio);
*/
        var wRatio = canvas.width / image.width;
        var hRatio = canvas.height / image.height;
        var ratio = Math.min (wRatio, hRatio);

        //image.width = image.width * wRatio;
        //image.height = image.height * hRatio;

        image.onload = () => {
          this.ctx.drawImage(image, 0, 0,image.width, image.height,0,0,canvas.width*ratio, canvas.height*ratio);
        }

        /*
         var wRatio = canvas.width / imageObj.width;
         var hRatio = canvas.height / imageObj.height;
         var ratio = Math.min (wRatio, hRatio);
         context.drawImage(imageObj, 0, 0, canvas.width, canvas.height,0,0,imageObj.width*ratio, imageObj.height*ratio);         */

      }, (err) => {
        this.presentToast('Error> ' + err, 'bottom');
        console.log('Camera.getPicture> Error >' + err);
      });
    }
  }

  presentToast(msg: string, pos: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: pos
    });
    toast.present();
  }


  presentLoadingDefault(start: boolean) {
    if (start) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    } else {
      this.loading.dismiss();
    }
    /*
    setTimeout(() => {
      loading.dismiss();
    }, 15000);
    */
  }

}
