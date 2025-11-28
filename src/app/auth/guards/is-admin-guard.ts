import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthServices } from '@auth/services/auth-services';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (route, segments) => {

  const authService = inject(AuthServices);
  const router = inject(Router);

  const isLogged = await firstValueFrom(authService.checkLoginstatus());

  if (!isLogged) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  const user = authService.user();
  const isAdmin = user && user.roles.includes('admin');

  if (!isAdmin) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
