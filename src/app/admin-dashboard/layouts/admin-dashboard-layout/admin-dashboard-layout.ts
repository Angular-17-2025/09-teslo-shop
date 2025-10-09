import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthServices } from '@auth/services/auth-services';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard-layout.html',
  styles: ``
})
export class AdminDashboardLayout {

  authService = inject(AuthServices)

  user = computed(() => this.authService.user());

}
