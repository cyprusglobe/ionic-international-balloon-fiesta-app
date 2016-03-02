import {Page, NavParams, ViewController} from 'ionic-angular';
import {EventData} from '../../providers/event-data';

@Page({
  templateUrl: 'build/pages/events-list-filter/events-list-filter.html',
})
export class EventsListFilterPage {
  tracks: Array<{name: String, isChecked: Boolean}> = [];
  
  constructor(
    private eventData: EventData,
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    let excludedTrackNames = this.navParams.data;
    
    this.eventData.getTracks().then((trackNames: String[]) => {
      trackNames.forEach(trackName => {
        this.tracks.push({
          name: trackName,
          isChecked: (excludedTrackNames.indexOf(trackName) === -1)
        });
      });
    });
  }
  
  resetFilters() {
    // reset all of the toggles to be checked
    this.tracks.forEach(track => {
      track.isChecked = true;
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    let excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTrackNames);
  }

  dismiss(data) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}
