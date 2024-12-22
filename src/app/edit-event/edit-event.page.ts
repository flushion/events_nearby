import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {
  eventId: string = ''; // ID de l'événement
  event: any = {}; // Données de l'événement
  suggestions: any[] = []; // Suggestions de lieux

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id')!; // Récupérer l'ID de l'événement de l'URL
    if (this.eventId) {
      this.fetchEvent();
    }
  }

  // Récupérer l'événement depuis Firestore
  fetchEvent() {
    this.firestore
      .collection('events')
      .doc(this.eventId)
      .get()
      .subscribe((doc) => {
        if (doc.exists) {
          this.event = doc.data();
        } else {
          console.log('Événement non trouvé');
        }
      });
  }

  // Rechercher les adresses via OpenStreetMap
  async onSearchAddress() {
    if (this.event.location.trim().length > 0) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.event.location)}`;
        this.http.get(url).subscribe(
          (response: any) => {
            this.suggestions = response.map((result: any) => ({
              display_name: result.display_name,
              lat: result.lat,
              lon: result.lon,
            }));
          },
          (error: any) => {
            console.error('Erreur lors de la recherche de l’adresse :', error);
          }
        );
      } catch (error) {
        console.error('Erreur lors de la requête OpenStreetMap :', error);
      }
    } else {
      this.suggestions = [];
    }
  }

  // Sélectionner une adresse dans les suggestions
  selectAddress(address: any) {
    this.event.location = address.display_name;
    this.event.latitude = parseFloat(address.lat);
    this.event.longitude = parseFloat(address.lon);
    this.suggestions = [];
  }

  // Enregistrer ou mettre à jour l'événement
  async saveEvent(eventForm: any) {
    if (eventForm.valid) {
      try {
        if (this.eventId) {
          await this.firestore.collection('events').doc(this.eventId).update(this.event);
        } else {
          await this.firestore.collection('events').add(this.event);
        }
        const toast = await this.toastController.create({
          message: 'Événement sauvegardé avec succès',
          duration: 2000,
          color: 'success',
        });
        toast.present();
        this.router.navigate(['/tabs/tab1']);
      } catch (error) {
        const toast = await this.toastController.create({
          message: 'Erreur lors de la sauvegarde de l\'événement',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    }
  }

  // Annuler et revenir à la liste des événements
  cancel() {
    this.router.navigate(['/tabs/tab1']);
  }
}