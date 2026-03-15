import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';
import { artistGuard } from './core/guards/artist-guard';
import { BrowseComponent } from './features/browse/pages/browse-component/browse-component';
import { BrowseByAlbumComponent } from './features/browse/pages/album-page/album-page';
import { BrowseByArtistComponent } from './features/browse/pages/artist-page/artist-page';

export const routes: Routes = [
  // 🔓 PUBLIC ROUTES (NO LAYOUT)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.LoginComponent),
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register').then((m) => m.RegisterComponent),
  },

  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized').then((m) => m.UnauthorizedComponent),
  },

  // 🔐 APP ROUTES (WITH LAYOUT)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/music/pages/music-home/music-home').then((m) => m.MusicHomeComponent),
      },
      {
        path: 'playlists/:id',
        loadComponent: () =>
          import('./features/playlist/pages/playlist-details/playlist-details').then(
            (m) => m.PlaylistDetailsComponent,
          ),
      },
      {
        path: 'playlists',
        loadComponent: () =>
          import('./features/playlist/pages/playlist-list/playlist-list').then(
            (m) => m.PlaylistListComponent,
          ),
      },

      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/favorites/pages/favorites-list/favorites-list').then(
            (m) => m.FavoritesListComponent,
          ),
      },

      {
        path: 'history',
        loadComponent: () =>
          import('./features/history/pages/history-list/history-list').then(
            (m) => m.HistoryListComponent,
          ),
      },

      {
        path: 'artist',
        loadComponent: () =>
          import('./features/artist/pages/artist-dashboard/artist-dashboard').then(
            (m) => m.ArtistDashboardComponent,
          ),
        canActivate: [authGuard, artistGuard],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/pages/profile/profile').then((m) => m.ProfileComponent),
        canActivate: [authGuard],
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./features/playlist/pages/public-playlists/public-playlists').then(
            (m) => m.PublicPlaylistsComponent,
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./features/search/pages/search-results/search-results').then(
            (m) => m.SearchResultsComponent,
          ),
      },
      {
        path: 'genres/:genre',
        loadComponent: () =>
          import('./features/browse/pages/genre-page/genre-page').then((m) => m.GenrePageComponent),
      },
      {
        path: 'browse',
        component: BrowseComponent,
      },
      {
        path: 'browse-artist',
        component: BrowseByArtistComponent,
      },
      {
        path: 'browse-artist/:id',
        component: BrowseByArtistComponent,
      },
      {
        path: 'browse-album',
        component: BrowseByAlbumComponent,
      },
      {
        path: 'browse-album/:id',
        component: BrowseByAlbumComponent,
      },
      {
        path: 'my-stats',
        loadComponent: () =>
          import('./features/user/user-stats/user-stats').then((m) => m.UserStatsComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
