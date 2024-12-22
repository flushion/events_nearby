import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  title: string = '';
  location: string = '';
  description: string = '';
  date: string = '';
  suggestions: any[] = [];
  latitude: number | null = null;
  longitude: number | null = null;

  constructor(private firestore: AngularFirestore, private http: HttpClient) {}

  async addEvent() {
    try {
      // Ajoute l'événement avec les coordonnées sélectionnées
      const event = {
        title: this.title,
        location: this.location,
        description: this.description,
        date: this.date,
        latitude: this.latitude,
        longitude: this.longitude
      };

      await this.firestore.collection('events').add(event);
      alert('Événement ajouté avec succès !');
      this.resetForm();
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’événement :', error);
    }
  }

  async onSearchAddress() {
    if (this.location.trim().length > 0) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        this.location
      )}`;
      this.http.get(url).subscribe((response: any) => {
        this.suggestions = response.map((result: any) => ({
          display_name: result.display_name,
          lat: result.lat,
          lon: result.lon
        }));
      });
    } else {
      this.suggestions = [];
    }
  }

  selectAddress(address: any) {
    this.location = address.display_name;
    this.latitude = parseFloat(address.lat);
    this.longitude = parseFloat(address.lon);
    this.suggestions = [];
  }

  resetForm() {
    this.title = '';
    this.location = '';
    this.description = '';
    this.date = '';
    this.suggestions = [];
    this.latitude = null;
    this.longitude = null;
  }
}