import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';


@Injectable()
export class PilotData {
  
  data: any;
  
  constructor(
    private http: Http
  ) {}
  
  loadPilots() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get('data/pilots.json').subscribe(res => {
        this.data = res.json();
        resolve(this.data);
      });
    });
  }
}
