import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getItemByKey(key: string): string {
    return localStorage.getItem(key);
  }
}
