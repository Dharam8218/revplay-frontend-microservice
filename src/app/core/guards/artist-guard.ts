import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const artistGuard = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const roles = auth.getRoles()
    .map(r => r.replace('ROLE_', ''));

  if (roles.includes('ARTIST')) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};