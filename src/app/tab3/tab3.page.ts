// src/app/tab3/tab3.page.ts

import { Component, OnInit } from '@angular/core';
import { AboutService } from '../services/about.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  about$: Observable<any>;

  constructor(
    private aboutService: AboutService,
    private alertController: AlertController
  ) {
    this.about$ = this.aboutService.getAboutData(); // Récupère les données du service
  }

  ngOnInit() {}

  // Fonction pour afficher l'alerte de contact
  async contact(email: string) {
    const alert = await this.alertController.create({
      header: 'Contactez-nous',
      message: `Envoyez un email à : ${email}`,
      buttons: ['OK'],
    });
    await alert.present();
  }
}