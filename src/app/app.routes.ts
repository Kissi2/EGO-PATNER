import { Routes } from '@angular/router';
import { DashboardComponent } from '../../projects/partner-lib/src/lib/features/dashboard/dashboard';
import { ConducteurComponent } from '../../projects/partner-lib/src/lib/features/conducteur/conducteur';
import { AbonnementComponent } from '../../projects/partner-lib/src/lib/features/abonnement/abonnement';
import { GainComponent } from '../../projects/partner-lib/src/lib/features/gain/gain';
import { LoginComponent } from '../../projects/partner-lib/src/lib/features/auth/login';
import { ProfileComponent } from '../../projects/partner-lib/src/lib/features/profile/profile';
import { RedirectComponent } from '../../projects/partner-lib/src/lib/features/auth/redirect';
import { JourneesDemarreesComponent } from '../../projects/partner-lib/src/lib/features/journees-demarrees/journees-demarrees';
import { HistoriqueJourneesComponent } from '../../projects/partner-lib/src/lib/features/historique-journees/historique-journees';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'redirect', component: RedirectComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'conducteur', component: ConducteurComponent },
  { path: 'journees-demarrees', component: JourneesDemarreesComponent },
  { path: 'historique-journees', component: HistoriqueJourneesComponent },
  { path: 'abonnement', component: AbonnementComponent },
  { path: 'gain', component: GainComponent },
  { path: 'profil', component: ProfileComponent },
  { path: '**', redirectTo: 'login' },
];
