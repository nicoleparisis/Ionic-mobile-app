import { Component, OnInit } from '@angular/core';
import { MapquestApiService } from '../mapquest-api.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-mapquest',
  templateUrl: './mapquest.component.html',
  styleUrls: [ './mapquest.component.css'],
  providers: [MapquestApiService]
})
export class MapquestComponent implements OnInit {

  dataItems: any;
  distance: string;
  time: string;
  maneuvers: string[];
  start: string;
  end: string;
  private addressString1: Subject<string>;
  private addressString2: Subject<string>; 

  constructor(private mapQuest: MapquestApiService) {
    this.start = 'New York City NY';
    this.end = 'Boston MA';
   }

   startAddress(start: string): void{
     this.addressString1.next(start);
   }
   endAddress(end: string): void{
     this.addressString2.next(end);
   }
   getDirections(start: string, end: string): any{
        this.mapQuest
        .getDirections(this.start, this.end)
        .subscribe(result =>
        {
          this.dataItems = result;
          this.distance = result.route.distance;
          this.time = result.route.formattedTime;
          this.maneuvers = result.route.legs[0].maneuvers;
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
      console.log(term);
      return this.mapQuest.getDirections(term, this.end);
    })
    .subscribe((result: any) =>
    {
      console.log(result);
      this.dataItems = result;
      this.distance = result.route.distance;
      this.time = result.route.formattedTime;
      this.maneuvers = result.route.legs[0].maneuvers;
    });

    this.addressString2
    .debounceTime(1000)
    .distinctUntilChanged()
    .switchMap(term =>{
      console.log(term);
      return this.mapQuest.getDirections(this.start, term);
    })
    .subscribe((result: any) =>
    {
      console.log(result);
      this.dataItems = result;
      this.distance = result.route.distance;
      this.time = result.route.formattedTime;
      this.maneuvers = result.route.legs[0].maneuvers;
    });
  }

}
