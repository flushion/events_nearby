// src/app/services/event.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Définir l'interface de l'événement
export interface Event {
  id: string;
  title: string;
  location: string;
  description: string;
  date: string;
  latitude: number | null;
  longitude: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient
  ) {}

  // Méthode pour ajouter un événement
  async addEvent(event: Omit<Event, 'id'>): Promise<void> {
    try {
      // Ajouter l'événement dans Firestore (id sera généré automatiquement)
      const eventRef = await this.firestore.collection('events').add(event);
      console.log('Événement ajouté avec ID:', eventRef.id);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
    }
  }

  // Recherche d'adresses via l'API OpenStreetMap
  searchAddress(location: string): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    return this.http.get(url);
  }

  // Récupérer tous les événements depuis Firestore
  getEvents(): Observable<Event[]> {
    return this.firestore.collection<Event>('events').valueChanges({ idField: 'id' });
  }

  // Supprimer un événement
  deleteEvent(eventId: string): Promise<void> {
    return this.firestore.collection('events').doc(eventId).delete();
  }

}