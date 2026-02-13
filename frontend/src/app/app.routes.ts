import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AuthGuard } from './services/auth.guard';
import { PlanningCreateComponent } from './pages/planning-create/planning-create';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'planning/new',
    canActivate: [AuthGuard],
    component: PlanningCreateComponent
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
