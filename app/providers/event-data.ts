import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {UserData} from './user-data';

/**
 * (description)
 * 
 * @export
 * @class EventData
 */
@Injectable()
export class EventData {
  /**
   * (description)
   * 
   * @type {*}
   */
  data: any;
  
  /**
   * Creates an instance of EventData.
   * 
   * @param {Http} http (description)
   */
  constructor(
    private http: Http,
    private user: UserData
  ) {}
  
  /**
   * (description)
   * 
   * @returns (description)
   */
  loadEvents() {
        if (this.data) {
            //already loaded events
            return Promise.resolve(this.data);
        }

        return new Promise(resolve => {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.
            this.http.get('data/events.json').subscribe(res => {
                this.data = this.processEvents(res.json());
                resolve(this.data);
            });
        });
    }
    
    /**
     * (description)
     * 
     * @param data (description)
     * @returns (description)
     */
    processEvents(data) {
        data.tracks = [];

        // Loop Through each day in the schedule
        data.schedule.forEach(day => {
            // loop through each timeline group in the day
            day.groups.forEach(group => {
                // loop through each event in the timeline group
                group.events.forEach(event => {
                    this.processEvent(data, event);
                });
            });
        });

        return data;
    }

    /**
     * (description)
     * 
     * @param data (description)
     * @param event (description)
     */
    processEvent(data, event) {
        // loop through each speaker and load the speaker data
        // using the speaker name as the key
        if (event.tracks) {
            event.tracks.forEach(track => {
                if (data.tracks.indexOf(track) < 0) {
                    data.tracks.push(track);
                }
            });
        }
    }

    /**
     * (description)
     * 
     * @param dayIndex (description)
     * @param {string} [queryText=''] (description)
     * @param [excludeTracks] (description)
     * @param {string} [segment='all'] (description)
     * @returns (description)
     */
    getTimeline(dayIndex, queryText='', excludeTracks=[], segment='all') {
        return this.loadEvents().then(data => {
          let day = data.schedule[dayIndex];
          day.shownEvents = 0;

          queryText = queryText.toLowerCase().replace(/,|\.|-/g,' ');
          let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

          day.groups.forEach(group => {
              group.hide = true;

              group.events.forEach(event => {

                  this.filterEvent(event, queryWords, excludeTracks, segment);

                  if (!event.hide) {
                      // if this event is not hidden then this group should show
                      group.hide = false;
                      day.shownEvents++;
                  }
              });
          });
          return day;
      });
    }

    /**
     * (description)
     * 
     * @param event (description)
     * @param queryWords (description)
     * @param excludeTracks (description)
     * @param segment (description)
     */
    filterEvent(event, queryWords, excludeTracks, segment) {

        let matchesQueryText = false;
        if (queryWords.length) {
            // of any query word is in the event name than it passes the query test
            queryWords.forEach(queryWord => {
                if (event.name.toLowerCase().indexOf(queryWord) > -1) {
                    matchesQueryText = true;
                }
            });
        } else {
            // if there are no query words then this event passes the query test
            matchesQueryText = true;
        }

        // if any of the events tracks are not in the
        // exclude tracks then this event passes the track test
        let matchesTracks = false;
        event.tracks.forEach(trackName => {
            if (excludeTracks.indexOf(trackName) === -1) {
                matchesTracks = true;
            }
        });

        let matchesSegment = false;
        if (segment === 'favorites') {
            if (this.user.hasFavorite(event.uuid)) {
                matchesSegment = true;
            }
        } else {
            matchesSegment = true
        }

        // all tests must be true if it should not be hidden
        event.hide = !(matchesQueryText && matchesTracks && matchesSegment);
    }

    /**
     * (description)
     * 
     * @returns (description)
     */
    getTracks() {
        return this.loadEvents().then(data => {
            //console.dir(data.tracks);
            return data.tracks.sort();
        });
    }
}
