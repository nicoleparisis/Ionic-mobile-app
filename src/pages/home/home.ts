import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { MapquestApiService } from '../../app/mapquest-api.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MapquestApiService]
})
export class HomePage implements OnInit{

  form: FormGroup;
  selectedItem: any;
  dataItems: any;
  distance: string;
  time: string;
  maneuvers: string[];
  start: string;
  end: string;
  errMessage: string;
  private addressString1: Subject<string>;
  private addressString2: Subject<string>; 

  constructor(public navCtrl: NavController, private mapQuest: MapquestApiService, public navParams: NavParams) {
    if(navParams.get('start')){
      this.start = navParams.get('start');
    }else{
      this.start = 'New York City NY';
    }
    if(navParams.get('end')){
      this.end = navParams.get('end');
    }else{
      this.end = 'Boston MA';
    }
    
    this.selectedItem = navParams.get('item');
    this.form = new FormGroup({
       startLocation: new FormControl("", Validators.required),
       endLocation: new FormControl("", Validators.required)
    });
  }
 itemTapped(event, item, start, end){
   this.navCtrl.push(HomePage, {
     item:item,
     start:start,
     end:end
   })
 }
 startAddress(start: string): void{
     this.addressString1.next(start);
   }
   endAddress(end: string): void{
     this.addressString2.next(end);
   }

   processForm(){
        this.mapQuest
        .getDirections(this.form.value.startLocation, this.form.value.endLocation)
        .subscribe(result =>
        {
          this.errMessage = null;
          if(result.route.routeError.errorCode == 211){
            this.errMessage = "Please check the start and end location for valid addresses.";
          }else{
            this.dataItems = result;
            this.distance = result.route.distance;
            this.time = result.route.formattedTime;
            this.maneuvers = result.route.legs[0].maneuvers;
          }
        });
   }

  ngOnInit() {
    this.mapQuest
    .getDirections(this.start, this.end)
    .subscribe(result =>
    {
      this.dataItems = result;
      this.distance = result.route.distance;
      this.time = result.route.formattedTime;
      this.maneuvers = result.route.legs[0].maneuvers;
    });
  
    this.addressString1 = new Subject<string>();
    this.addressString2 = new Subject<string>();

    this.addressString1
    .debounceTime(1000)
    .distinctUntilChanged()
    .switchMap(term =>{
     // console.log(term);
      return this.mapQuest.getDirections(term, this.form.value.endLocation);
    })
    .subscribe((result: any) =>
    {
      this.errMessage = null;
      if(result.route.routeError.errorCode == 211){
        this.errMessage = "Please check the start and end location for valid addresses.";
      }else{
        this.dataItems = result;
        this.distance = result.route.distance;
        this.time = result.route.formattedTime;
        this.maneuvers = result.route.legs[0].maneuvers;
      }
    });

    this.addressString2
    .debounceTime(1000)
    .distinctUntilChanged()
    .switchMap(term =>{
      //console.log(term);
      return this.mapQuest.getDirections(this.form.value.startLocation, term);
    })
    .subscribe((result: any) =>
    {
      this.errMessage = null;
      if(result.route.routeError.errorCode == 211){
        this.errMessage = "Please check the start and end location for valid addresses.";
      }else{
        this.dataItems = result;
        this.distance = result.route.distance;
        this.time = result.route.formattedTime;
        this.maneuvers = result.route.legs[0].maneuvers;
      }
      
    });
  }
}
