import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    // this.firestore.collection('testCollection').add({ test: 'Firebase test' })
    // .then(() => console.log('Connexion Firebase réussie !'))
    // .catch((error) => console.error('Erreur Firebase :', error));
  }

  testFirebaseConnection() {
    // Ajoute un document de test dans Firestore
    this.firestore
      .collection('testCollection')
      .add({ message: 'Hello Firebase!' })
      .then(() => {
        console.log('Document ajouté avec succès !');

        // Lis les documents pour vérifier la connexion
        this.firestore.collection('testCollection').snapshotChanges().subscribe(data => {
          console.log('Données Firestore :', data.map(e => e.payload.doc.data()));
        });
      })
      .catch(error => {
        console.error('Erreur de connexion à Firebase :', error);
      });
  }

}
