import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  events: any[] = [];
  nearbyEvents: any[] = [];
  filteredEvents: any[] = [];
  latitude: number | null = null;
  longitude: number | null = null;
  filterNearby: boolean = false;
  searchTerm: string = '';

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.getCurrentLocation();
    this.fetchEvents();
  }

  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    } catch (error) {
      console.error('Erreur lors de la récupération de la position :', error);
    }
  }

  fetchEvents() {
    this.firestore
      .collection('events')
      .valueChanges({ idField: 'id' })
      .subscribe((data: any[]) => {
        this.events = data;
        this.updateFilteredEvents();
      });
  }

  updateFilteredEvents() {
    if (this.filterNearby) {
      this.filterNearbyEvents();
    } else {
      this.nearbyEvents = this.events;
    }
    this.filterEventsBySearchTerm();
  }

  filterNearbyEvents() {
    if (this.latitude != null && this.longitude != null) {
      const maxDistance = 50;
      this.nearbyEvents = this.events.filter((event) => {
        if (event.latitude && event.longitude) {
          const distance = this.calculateDistance(
            this.latitude!,
            this.longitude!,
            event.latitude,
            event.longitude
          );
          return distance <= maxDistance;
        }
        return false;
      });
    } else {
      this.nearbyEvents = [];
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  filterEventsBySearchTerm() {
    if (this.searchTerm.trim().length > 0) {
      this.filteredEvents = this.nearbyEvents.filter((event) =>
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredEvents = this.nearbyEvents;
    }
  }

  onSearchChange() {
    this.updateFilteredEvents(); // Met à jour la liste des événements lorsque la recherche change
  }

  toggleFilter() {
    this.filterNearby = !this.filterNearby;
    this.updateFilteredEvents();
  }

  async deleteEvent(eventId: string) {
    // Afficher une alerte de confirmation
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer cet événement ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Suppression annulée.');
          }
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            // Supprimer l'événement si confirmé
            this.firestore
              .collection('events')
              .doc(eventId)
              .delete()
              .then(() => {
                console.log('Événement supprimé :', eventId);
                this.fetchEvents(); // Rafraîchir les données après suppression
                this.updateFilteredEvents(); // Mettre à jour les événements filtrés
              })
              .catch((error) => console.error('Erreur lors de la suppression :', error));
          }
        }
      ]
    });

    // Afficher l'alerte
    await alert.present();
  }

  viewDetails(event: any) {
    console.log('Voir les détails de l\'événement :', event);
  }

  editEvent(event: any) {
    this.router.navigate(['/edit-event', event.id]);
  }
}