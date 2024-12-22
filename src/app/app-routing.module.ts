import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EditEventPage } from './edit-event/edit-event.page'; // Import the new page

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'edit-event',
    loadChildren: () => import('./edit-event/edit-event.module').then( m => m.EditEventPageModule)
  },
  {
    path: 'edit-event/:id', // Route to edit an event
    component: EditEventPage,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
