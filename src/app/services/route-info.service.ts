import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteInfoService {

  private routeIdentifiers: Map<string, string> = new Map();
  private routeIdentifiersSubject: BehaviorSubject<Map<string, string>> = new BehaviorSubject<Map<string, string>>(this.routeIdentifiers);

  setRouteIdentifier(path: string, identifier: string): void {
    this.routeIdentifiers.set(path, identifier);
    this.routeIdentifiersSubject.next(this.routeIdentifiers);
  }

  getRouteIdentifier(path: string): string | undefined {
    return this.routeIdentifiers.get(path);
  }

  getAllRouteIdentifiers(): Observable<Map<string, string>> {
    return this.routeIdentifiersSubject.asObservable();
  }
}
