import {App, IonicApp, Platform} from 'ionic-framework/ionic';
import {EventData} from './providers/event-data';
import {UserData} from './providers/user-data';

import {EventsListPage} from './pages/events-list/events-list';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';

interface PageObj{
  title: string,
  component: Type,
  icon: string    	    
}
       
@App({
  templateUrl: 'build/app.html',
  providers: [EventData, UserData],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  rootPage: Type = EventsListPage;
  pages: PageObj[];

  constructor(
    private app: IonicApp,
    private platform: Platform,
    private userData: UserData,
    eventData: EventData
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
