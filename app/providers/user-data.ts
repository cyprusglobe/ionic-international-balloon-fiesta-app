import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, Events} from 'ionic-framework/ionic';


@Injectable()
export class UserData {
  _favorites = [];
  storage = new Storage(LocalStorage);

  constructor(private events: Events) {}

  hasFavorite(eventName) {
    return (this._favorites.indexOf(eventName) > -1);
  }

  addFavorite(eventName) {
    this._favorites.push(eventName);
  }

  removeFavorite(eventName) {
    let index = this._favorites.indexOf(eventName)
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }
}