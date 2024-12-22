import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  events: any[] = []; // Liste de tous les événements
  nearbyEvents: any[] = []; // Liste des événements à proximité
  latitude: number | null = null; // Latitude actuelle
  longitude: number | null = null; // Longitude actuelle
  filterNearby: boolean = false; // Indicateur pour filtrer les événements à proximité

  constructor(private firestore: AngularFirestore) {}

  async ngOnInit() {
    // Récupérer la position actuelle au démarrage du composant
    await this.getCurrentLocation();
    // Récupérer les événements depuis Firestore
    this.fetchEvents();
  }

  // Méthode pour récupérer la position actuelle via Capacitor Geolocation
  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('Position actuelle:', this.latitude, this.longitude);
      this.filterNearbyEvents(); // Filtrer les événements à proximité après avoir obtenu la position
    } catch (error) {
      console.error('Erreur lors de la récupération de la position :', error);
    }
  }

  // Méthode pour récupérer les événements depuis Firestore
  fetchEvents() {
    this.firestore
      .collection('events')
      .valueChanges({ idField: 'id' })
      .subscribe((data: any[]) => {
        this.events = data;
        // Filtrer les événements à proximité ou afficher tous les événements
        this.filterNearbyEvents();
      });
  }

  // Méthode pour filtrer les événements à proximité
  filterNearbyEvents() {
    if (this.latitude != null && this.longitude != null) {
      const maxDistance = 0.18; // Distance maximale en degrés (20 km ≈ 0.18°)
      
      if (this.filterNearby) {
        this.nearbyEvents = this.events.filter((event) => {
          if (event.latitude && event.longitude) {
            const distanceLat = Math.abs(event.latitude - this.latitude!);
            const distanceLon = Math.abs(event.longitude - this.longitude!);
            return distanceLat <= maxDistance && distanceLon <= maxDistance;
          }
          return false;
        });
      } else {
        this.nearbyEvents = this.events; // Afficher tous les événements
      }
    } else {
      console.warn('Latitude ou longitude non définie, impossible de filtrer.');
    }
  }

  // Méthode pour changer le filtre (afficher les événements à proximité ou tous)
  toggleFilter() {
    this.filterNearby = !this.filterNearby;
    this.filterNearbyEvents();
  }
}