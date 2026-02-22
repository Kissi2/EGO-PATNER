import { Routes } from '@angular/router';
import { DashboardComponent } from '../../projects/partner-lib/src/lib/features/dashboard/dashboard';
import { ConducteurComponent } from '../../projects/partner-lib/src/lib/features/conducteur/conducteur';
import { AbonnementComponent } from '../../projects/partner-lib/src/lib/features/abonnement/abonnement';
import { GainComponent } from '../../projects/partner-lib/src/lib/features/gain/gain';
import { LoginComponent } from '../../projects/partner-lib/src/lib/features/auth/login';
import { ProfileComponent } from '../../projects/partner-lib/src/lib/features/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'conducteur', component: ConducteurComponent },
  { path: 'abonnement', component: AbonnementComponent },
  { path: 'gain', component: GainComponent },
  { path: 'profil', component: ProfileComponent },
  { path: '**', redirectTo: 'login' },
];
