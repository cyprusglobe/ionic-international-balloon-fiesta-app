import {Page, NavParams} from 'ionic-framework/ionic';


@Page({
  templateUrl: 'build/pages/event-detail/event-detail.html',
})
export class EventDetailPage {
  event: any;
  
  constructor(private navParams: NavParams) {
    this.event = navParams.data
    this.event.url = '';
    
    this.constructImageUrl(this.event)
  }
  
  constructImageUrl(event) {
    if (event.tracks.indexOf("Dawn_Patrol") != -1) {
      this.event.url = 'https://sterlingstarling.files.wordpress.com/2012/10/dawn-patrol-fiesta-4a-small.jpg';
    } else if (event.tracks.indexOf("M_Glow") != -1) {
      this.event.url = 'http://elizabethdillow.typepad.com/.a/6a00d8341c010f53ef01bb08813d27970d-pi';
    }
  }
}
