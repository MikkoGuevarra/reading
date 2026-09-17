import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },

  {
    path: 'syllables',
    loadComponent: () =>
      import('./pages/syllables/syllables').then((m) => m.Syllables),
  },

  {
    path: 'progress',
    loadComponent: () =>
      import('./pages/progress/progress').then((m) => m.Progress),
  },
  {
    path: 'words',
    loadComponent: () => import('./pages/words/words').then((m) => m.Words),
  },
  {
    path: 'sentences',
    loadComponent: () =>
      import('./pages/sentences/sentences').then((m) => m.Sentences),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
