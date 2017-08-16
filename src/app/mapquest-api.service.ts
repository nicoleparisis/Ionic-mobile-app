import { Injectable } from '@angular/core';
import { Http, Response, Jsonp, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class MapquestApiService {

  constructor(private http: Http) { }

  getDirections(start: string, end: string): Observable<any>{
    let url: string = 'https://www.mapquestapi.com/directions/v2/route?key=7HlX1mhMFCXVAMUV8eHObsrLkjm7vqyj&from=' + start+ '&to=' + end + '&outFormat=json&ambiguities=ignore&routeType=fastest&doReverseGeocode=false&enhancedNarrative=false&avoidTimedConditions=false';
    let params = new URLSearchParams();

    return this.http.get(url).map((res: Response) => res.json());
  }

}
