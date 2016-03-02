import {App, IonicApp, Platform} from 'ionic-angular';
import {EventData} from './providers/event-data';
import {UserData} from './providers/user-data';
import {PilotData} from './providers/pilot-data';

import {EventsListPage} from './pages/events-list/events-list';
import {PilotsListPage} from './pages/pilots-list/pilots-list';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';

interface PageObj{
  title: string,
  component: Type,
  icon: string    	    
}
       
@App({
  templateUrl: 'build/app.html',
  providers: [EventData, UserData, PilotData],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  rootPage: Type = PilotsListPage;
  pages: PageObj[];

  constructor(
    private app: IonicApp,
    private platform: Platform,
    private userData: UserData,
    eventData: EventData,
    pilotData: PilotData
    ) {
      
      eventData.loadEvents();
      
      this.pages = [
        { title: 'Events', component: EventsListPage, icon: 'calendar'}
      ]
  }
  
  openPage(page: PageObj) {
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
