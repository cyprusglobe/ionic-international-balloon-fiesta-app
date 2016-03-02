import {IonicApp, Page, NavController, Alert, Modal, ItemSliding} from 'ionic-angular';
import {EventsListFilterPage} from '../events-list-filter/events-list-filter';
import {EventDetailPage} from '../event-detail/event-detail';
import {EventData} from '../../providers/event-data';
import {UserData} from '../../providers/user-data';
import {Http} from 'angular2/http';

@Page({
  templateUrl: 'build/pages/events-list/events-list.html',
})
export class EventsListPage {
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks = [];
  shownEvents = [];
  groups = [];
  
  constructor(
    private app: IonicApp,
    private nav: NavController,
    private eventData: EventData,
    private user: UserData
  ) {
	    this.updateEvent();
  }
  
  updateEvent() {
    this.eventData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).then(data => {
      this.shownEvents = data.shownEvents;
      this.groups = data.groups;
    });
  }
  
  presentFilter() {
    let modal = Modal.create(EventsListFilterPage, this.excludeTracks);
    this.nav.present(modal);

    modal.onDismiss((data: any[]) => {
      if (data) {
        this.excludeTracks = data;
        this.updateEvent();
      }
    });
  }
  
  goToEventDetail(eventData) {
    this.nav.push(EventDetailPage, eventData);
  }
  
  addFavorite(slidingItem: ItemSliding, eventData) {

    if (this.user.hasFavorite(eventData.uuid)) {
      // woops, they already favorited it! What shall we do!?
      // create an alert instance
      let alert = Alert.create({
        title: 'Remove Favorite',
        message: 'Would you like to remove this event from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              // they clicked the cancel button, do not remove the event
              // close the sliding item and hide the option buttons
              slidingItem.close();
            }
          },
          {
            text: 'Remove',
            handler: () => {
              // they want to remove this event from their favorites
              this.user.removeFavorite(eventData.uuid);

              // close the sliding item and hide the option buttons
              slidingItem.close();
              
              this.updateEvent();
            }
          }
        ]
      });
      // now present the alert on top of all other content
      this.nav.present(alert);

    } else {
      // remember this event as a user favorite
      this.user.addFavorite(eventData.uuid);

      // create an alert instance
      let alert = Alert.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      this.nav.present(alert);
    }

  }
}
