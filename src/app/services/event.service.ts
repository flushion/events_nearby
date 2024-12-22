import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsSubject = new BehaviorSubject<any[]>([]);
  events$ = this.eventsSubject.asObservable();

  constructor(private firestore: AngularFirestore) {}

  fetchEvents() {
    this.firestore
      .collection('events')
      .valueChanges({ idField: 'id' })
      .subscribe((events) => this.eventsSubject.next(events));
  }

  createEvent(event: any) {
    return this.firestore.collection('events').add(event);
  }

  updateEvent(id: string, event: any) {
    return this.firestore.collection('events').doc(id).update(event);
  }

  deleteEvent(id: string) {
    return this.firestore.collection('events').doc(id).delete();
  }
}