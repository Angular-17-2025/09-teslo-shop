import { AuthServices } from '@auth/services/auth-services';
import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async (route, segments) => {

  const authServices = inject(AuthServices);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authServices.checkLoginstatus());

  if( isAuthenticated ) {
    router.navigateByUrl('/');
    return false;
  }

  return true;

};
