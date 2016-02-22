import {Page} from 'ionic-framework/ionic';
import {PilotData} from '../../providers/pilot-data';

@Page({
  templateUrl: 'build/pages/pilots-list/pilots-list.html',
})
export class PilotsListPage {

  pilots: [];

  constructor(
    private pilotData: PilotData
  ) {
    this.loadData();
  }

  loadData() {
    this.pilotData.loadPilots().then(data => {
      this.pilots = data.pilots;
    });
  }
}
