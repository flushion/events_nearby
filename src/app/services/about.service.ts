// src/app/services/about.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AboutService {

  constructor() {}

  // Méthode pour récupérer les données "À propos"
  getAboutData(): Observable<any> {
    const aboutData = {
      description: 'Notre application vise à connecter les utilisateurs avec des événements locaux pertinents, en facilitant la recherche, la création et la gestion des événements dans un environnement convivial. Nous mettons l\'accent sur l\'accessibilité des informations en temps réel grâce à la géolocalisation et à une interface simple.',
      features: [
        'Recherche d\'événements',
        'Création d\'événements',
        'Détails de l\'événement',
        'REMARQUE : Si vous effectuez plusieurs tentatives de sélection d\'adresse, il se peut qu\'il faille attendre un certain temps avant que cette fonctionnalité ne soit à nouveau disponible, car un API gratuit est utilisé, ce qui entraîne l\'envoi de nombreuses requêtes.'
      ]
    };
    return of(aboutData); // Retourne un Observable avec les données
  }
}