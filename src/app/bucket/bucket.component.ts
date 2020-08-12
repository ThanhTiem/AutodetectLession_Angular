import {ClusterService} from '../core/services/Swarm/cluster.service';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router,NavigationEnd} from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CropperComponent, ImageCropperResult } from 'angular-cropperjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { DomSanitizer } from '@angular/platform-browser';
import Cropper from 'cropperjs';
import { HttpClient } from '@angular/common/http';
import { identity } from 'rxjs';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent implements OnInit {
  @ViewChild('angularCropper', { static: false }) public angularCropper: CropperComponent;
  @ViewChild('image', { static: false }) image: ElementRef;
 

  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';
  label:any;
  img_detect:any;
  fileExtractTable: any;
  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  imageSrc: any = '';

  src_img:any;
  config: any;
  resultImage: any;
  resultResult: any = '';
  imageData: any[];
  item = 0;
  type = '';


  style = false;

  // public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  constructor(private toastr: ToastrService,private httpClient: HttpClient, private router: Router, private clusterService: ClusterService, private domSanitizer:DomSanitizer ) {
    this.config = {
      zoomable: true,
      scalable: true,
      multiaple: true
    }; 
  }
  ngOnInit(){
    var cropper;
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    if (this.imageSrc != '') {
      cropper = new Cropper(this.image.nativeElement, {
        aspectRatio: 9 / 11,
      });
    }
    document.getElementById('napp').style.display = "none";

  }
  handleDragEnter() {
    this.dragging = true;
  }
  
  handleDragLeave() {
    this.dragging = false;
  }
  reload(){
    location.reload();
  }
  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
    //this.iconColor = this.overlayColor;
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    console.log('file',file);
    if (file == undefined) {
      return;
    }
    this.type = file.type.replace('image/', '');
    console.log("type",this.type);
    if (this.type == 'pdf') {
      this.type = 'jpeg';
    }
    this.resultResult = undefined;
    var pattern = /image-*/;


    if (!file.type.match(pattern)) {
      alert('invalid format');
      // return;
      // this.uploadPdf(e)
    } else {
      var reader = new FileReader();
      console.log('cc: ', reader);
      this.loaded = false;
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
      // console.log('alo: ', this);
    }
  }

  handleReaderLoaded(e) {
    if (this.imageSrc != '')
      this.angularCropper.cropper.destroy();
    var reader = e.target;
    this.imageSrc = reader.result;
    console.log('reader', reader);
    this.style = false;
    this.loaded = true;
    
  }

  cancel() {
    
  }
  CropMe() {
    this.angularCropper.exportCanvas();

  }

  resultImageFun(event: ImageCropperResult) {
    let urlCreator = window.URL;
    this.resultResult = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg');
    // console.log('this.resultResult', this.resultResult);
  }

  checkstatus(event: any) {
    if (event.blob === undefined) {
      return;
    }
    let urlCreator = window.URL;
  }
  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
    //("zoom");
  }
  ronate() {
    this.angularCropper.cropper.rotate(90);
  }
  next() {
    if (this.item === this.imageData.length - 1)
      this.item = 0;
    else this.item++;
    this.angularCropper.cropper.destroy();
    this.imageSrc = 'data:image/jpeg;base64,' + this.imageData[this.item];
    // console.log('this.imageSrc', this.imageSrc);
  }
  pre() {
    if (this.item === 0)
      this.item = this.imageData.length - 1;
    else this.item--;
    this.angularCropper.cropper.destroy();
    this.imageSrc = 'data:image/jpeg;base64,' + this.imageData[this.item];
    // console.log('this.imageSrc ', this.imageSrc );
  }
  public base64ToBlob(b64Data, contentType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8', sliceSize=1024) {
    b64Data = b64Data.slice(1, b64Data.length-1);
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }
  detect(){
    // console.log('this.resultResult',this.resultResult);
    if(this.resultResult == undefined){
      alert('cần cắt ảnh trước!')
    }
    try {
      this.img_detect = null;
      this.label = null;
      this.httpClient.post<any>('http://127.0.0.1:5000/api/yoloPredict', this.resultResult.replace('data:image/jpeg;base64,', '') ).subscribe(data =>{
          // console.log('data', data);
          this.img_detect = data.img
          this.label = data.txt
          
          // console.log('this.img_detect', this.img_detect );
          console.log('this.label', this.label );

      });
      document.getElementById('napp').style.display = "block";
    } catch (error) {
      throw new Error(error);
     
    }
    
  }
  zoomin() {
    console.log('zoom out');
    var myImg = document.getElementById("nap");
    var currWidth = myImg.clientWidth;
    if (currWidth == 2500) return false;
    else {
      myImg.style.width = (currWidth + 100) + "px";
    }
  }
  
  zoomout() {
    console.log('zoomout');
    var myImg = document.getElementById("nap");
    var currWidth = myImg.clientWidth;
    if (currWidth == 100) return false;
    else {
      myImg.style.width = (currWidth - 100) + "px";
    }
  }
}
