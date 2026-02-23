import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { Genre } from '../../../core/models/genre.enum';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  get username(): string | null {
    return localStorage.getItem('username');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToSearch(query: string) {
    this.router.navigate(['/search'], {
      queryParams: { q: query },
    });
  }

  genres = Object.values(Genre);

  navigateToGenre(event: Event) {
    const genre = (event.target as HTMLSelectElement).value;
    console.log('Selected genre:', genre);
    if (genre) {
      this.router.navigateByUrl(`/genres/${genre}`);
    }
  }

  navigateToBrowse(event: any) {
    const value = event.target.value;

    if (value === 'artist') {
      this.router.navigate(['/browse-artist']);
    }

    if (value === 'album') {
      this.router.navigate(['/browse-album']);
    }

    event.target.value = ''; // reset dropdown
  }
}
