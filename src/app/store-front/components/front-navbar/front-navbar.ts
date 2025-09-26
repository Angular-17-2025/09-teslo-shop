import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthServices } from '@auth/services/auth-services';

@Component({
  selector: 'app-front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
  styles: ``
})
export class FrontNavbar {

  authService = inject(AuthServices);

}
