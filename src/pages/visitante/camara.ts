import {Component, ViewChild, ElementRef} from "@angular/core";
import {ViewController, Platform} from "ionic-angular";
import {CameraData} from "../../app/model";

@Component({
  selector: 'modal-camera',
  templateUrl: 'camara.html'
})
export class Camara {

  @ViewChild('video') video: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  //visitante: Visitante;

  constructor(/*params: NavParams,*/ public viewCtrl: ViewController) {
    //this.visitante = params.get('visitante');



  }

  ionViewDidLoad() {

    let video = this.video.nativeElement;

     var n = <any>navigator;

    n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );

    n.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    });

  }

  ionViewDidLeave() {

  }

  closeCamera() {
    let camaraData: CameraData  = new CameraData(0, null);
    this.viewCtrl.dismiss(camaraData);
  }
  takeCanvas() {

    let ctx:CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    let video = this.video.nativeElement;
    ctx.drawImage(video, 0, 0, 300, 300);

    let base64:string = this.canvas.nativeElement.toDataURL();

    let camaraData: CameraData  = new CameraData(2, base64);

    this.viewCtrl.dismiss(camaraData);

  }



/*
  public takePicture() {
    Camera.getPicture({
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: false
    }).then(imageData => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      console.log('Nactiva:> ' + this.base64Image);
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
*/
}
